#!/usr/bin/env node

/*
  Crawley Agent Dashboard — Live Server (SSE)

  - Binds to 127.0.0.1 by default (do not expose publicly without auth/TLS).
  - Serves:
    - GET  /status          -> JSON (current status)
    - GET  /events          -> SSE stream (push updates)
    - POST /update          -> update status (writes status.json + broadcasts)

  Auth (optional but recommended even on loopback if multiple users share host):
    export DASHBOARD_TOKEN='...'
    Then send header: x-dashboard-token: <token>
*/

const http = require('http');
const fs = require('fs');
const path = require('path');

const HOST = process.env.DASHBOARD_HOST || '127.0.0.1';
const PORT = Number(process.env.DASHBOARD_PORT || 8790);
const TOKEN = process.env.DASHBOARD_TOKEN || '';

const statusPath = path.join(__dirname, 'status.json');

function readStatus() {
  try {
    const raw = fs.readFileSync(statusPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return { updatedAt: new Date().toISOString(), agents: [] };
  }
}

function writeStatus(next) {
  fs.writeFileSync(statusPath, JSON.stringify(next, null, 2) + '\n', 'utf8');
}

function okJson(res, obj) {
  const body = JSON.stringify(obj);
  res.writeHead(200, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  });
  res.end(body);
}

function bad(res, code, msg) {
  res.writeHead(code, { 'content-type': 'text/plain; charset=utf-8' });
  res.end(msg);
}

function requireAuth(req, res) {
  if (!TOKEN) return true;
  const got = req.headers['x-dashboard-token'];
  if (got && String(got) === TOKEN) return true;
  bad(res, 401, 'unauthorized');
  return false;
}

/** @type {Set<http.ServerResponse>} */
const clients = new Set();

function sseSend(res, event, data) {
  res.write(`event: ${event}\n`);
  res.write(`data: ${JSON.stringify(data)}\n\n`);
}

function broadcast(event, data) {
  for (const res of clients) {
    try { sseSend(res, event, data); } catch { /* ignore */ }
  }
}

function collectBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (c) => {
      raw += c;
      if (raw.length > 1_000_000) { // 1MB guard
        reject(new Error('body too large'));
        req.destroy();
      }
    });
    req.on('end', () => resolve(raw));
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);

  if (req.method === 'GET' && url.pathname === '/health') {
    res.writeHead(200, { 'content-type': 'text/plain; charset=utf-8' });
    return res.end('ok');
  }

  if (req.method === 'GET' && url.pathname === '/status') {
    if (!requireAuth(req, res)) return;
    return okJson(res, readStatus());
  }

  if (req.method === 'GET' && url.pathname === '/events') {
    if (!requireAuth(req, res)) return;

    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-store',
      'connection': 'keep-alive',
      'access-control-allow-origin': '*'
    });

    // initial hello + snapshot
    sseSend(res, 'hello', { ok: true, ts: Date.now() });
    sseSend(res, 'status', readStatus());

    clients.add(res);

    // keepalive
    const ka = setInterval(() => {
      try { res.write(': keepalive\n\n'); } catch { /* ignore */ }
    }, 20_000);

    req.on('close', () => {
      clearInterval(ka);
      clients.delete(res);
    });

    return;
  }

  if (req.method === 'POST' && url.pathname === '/update') {
    if (!requireAuth(req, res)) return;

    let bodyRaw = '';
    try {
      bodyRaw = await collectBody(req);
    } catch (e) {
      return bad(res, 413, e.message);
    }

    let patch;
    try {
      patch = JSON.parse(bodyRaw || '{}');
    } catch {
      return bad(res, 400, 'invalid json');
    }

    const cur = readStatus();
    const now = new Date().toISOString();

    // Patch format:
    // { updatedAt?, agents: [{ name, status?, task?, eta?, note?, risk?, pos? }, ...] }
    const byName = new Map((cur.agents || []).map(a => [a.name, { ...a }]));
    for (const a of (patch.agents || [])) {
      if (!a || !a.name) continue;
      const prev = byName.get(a.name) || { name: a.name };
      byName.set(a.name, { ...prev, ...a });
    }

    const next = {
      ...cur,
      ...patch,
      updatedAt: patch.updatedAt || now,
      agents: Array.from(byName.values())
    };

    writeStatus(next);
    broadcast('status', next);

    return okJson(res, { ok: true, updatedAt: next.updatedAt });
  }

  // small convenience: serve the static dashboard files if desired
  if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
    const p = path.join(__dirname, 'index.html');
    res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
    return fs.createReadStream(p).pipe(res);
  }
  if (req.method === 'GET' && url.pathname === '/app.js') {
    const p = path.join(__dirname, 'app.js');
    res.writeHead(200, { 'content-type': 'application/javascript; charset=utf-8', 'cache-control': 'no-store' });
    return fs.createReadStream(p).pipe(res);
  }
  if (req.method === 'GET' && url.pathname === '/style.css') {
    const p = path.join(__dirname, 'style.css');
    res.writeHead(200, { 'content-type': 'text/css; charset=utf-8', 'cache-control': 'no-store' });
    return fs.createReadStream(p).pipe(res);
  }
  if (req.method === 'GET' && url.pathname === '/status.json') {
    const p = statusPath;
    res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
    return fs.createReadStream(p).pipe(res);
  }

  return bad(res, 404, 'not found');
});

server.listen(PORT, HOST, () => {
  // eslint-disable-next-line no-console
  console.log(`Live dashboard server: http://${HOST}:${PORT}/`);
  if (TOKEN) console.log('Auth: enabled (x-dashboard-token required)');
  else console.log('Auth: disabled (set DASHBOARD_TOKEN to enable)');
});
