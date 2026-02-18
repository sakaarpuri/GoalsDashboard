const STATUS_URL = './status.json';
const LIVE_EVENTS_URL = './events';

const statusColor = (s) => {
  switch ((s || '').toLowerCase()) {
    case 'running': return '#16a487';
    case 'blocked': return '#e23a3a';
    case 'warning': return '#c88400';
    case 'idle':
    default: return '#7a8aa6';
  }
};

const fmt = (v, fallback='—') => (v === undefined || v === null || v === '' ? fallback : String(v));

function el(tag, attrs = {}, children = []) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of children) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  return e;
}

function renderCards(data) {
  const cards = document.getElementById('cards');
  cards.innerHTML = '';
  (data.agents || []).forEach(a => {
    const st = (a.status || 'idle').toLowerCase();
    const tag = el('span', { class: `tag ${st}` }, [st.toUpperCase()]);

    const title = el('div', {}, [
      el('h3', {}, [fmt(a.name)]),
      el('div', { class: 'muted' }, [fmt(a.role)])
    ]);

    const top = el('div', { class: 'card-top' }, [title, tag]);

    const kv = el('div', { class: 'kv' }, [
      el('div', { class: 'k' }, ['Task']), el('div', {}, [fmt(a.task)]),
      el('div', { class: 'k' }, ['ETA']), el('div', {}, [fmt(a.eta)]),
      el('div', { class: 'k' }, ['Last note']), el('div', {}, [fmt(a.note)]),
      el('div', { class: 'k' }, ['Risk']), el('div', {}, [fmt(a.risk, 'normal')]),
    ]);

    cards.appendChild(el('div', { class: 'card' }, [top, kv]));
  });
}

function svgText(x, y, text, className) {
  const t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  t.setAttribute('x', x);
  t.setAttribute('y', y);
  t.setAttribute('class', className);
  t.textContent = text;
  return t;
}

function svgEl(tag, attrs = {}) {
  const e = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, String(v));
  return e;
}

function addChibi(g, pos, scale, accent) {
  const skin = 'rgba(255,255,255,0.88)';
  const outline = 'rgba(11,18,32,0.14)';
  const outfit = 'rgba(255,255,255,0.70)';
  const outfit2 = 'rgba(11,18,32,0.06)';

  // soft shadow blob under feet
  g.appendChild(svgEl('ellipse', {
    cx: pos.x,
    cy: pos.y + 56*scale,
    rx: 40*scale,
    ry: 10*scale,
    fill: 'rgba(11,18,32,0.10)',
    opacity: 0.16
  }));

  // head
  g.appendChild(svgEl('circle', {
    cx: pos.x,
    cy: pos.y - 78 * scale,
    r: 28 * scale,
    fill: skin,
    stroke: outline,
    'stroke-width': 2
  }));

  // hair band / visor
  g.appendChild(svgEl('path', {
    d: `M ${pos.x - 24*scale} ${pos.y - 88*scale} Q ${pos.x} ${pos.y - 112*scale} ${pos.x + 24*scale} ${pos.y - 88*scale}`,
    fill: 'none',
    stroke: accent,
    'stroke-width': 5,
    'stroke-linecap': 'round',
    opacity: 0.92
  }));

  // tiny earcom
  g.appendChild(svgEl('circle', {
    cx: pos.x + 26*scale,
    cy: pos.y - 76*scale,
    r: 3.2*scale,
    fill: accent,
    opacity: 0.9
  }));

  // eyes
  g.appendChild(svgEl('circle', { cx: pos.x - 10*scale, cy: pos.y - 78*scale, r: 3.8*scale, fill: accent, opacity: 0.9 }));
  g.appendChild(svgEl('circle', { cx: pos.x + 10*scale, cy: pos.y - 78*scale, r: 3.8*scale, fill: accent, opacity: 0.9 }));

  // mouth
  g.appendChild(svgEl('path', {
    d: `M ${pos.x - 7*scale} ${pos.y - 64*scale} Q ${pos.x} ${pos.y - 59*scale} ${pos.x + 7*scale} ${pos.y - 64*scale}`,
    fill: 'none',
    stroke: 'rgba(11,18,32,0.35)',
    'stroke-width': 2,
    'stroke-linecap': 'round',
    opacity: 0.7
  }));

  // blush
  g.appendChild(svgEl('circle', { cx: pos.x - 17*scale, cy: pos.y - 67*scale, r: 4.6*scale, fill: accent, opacity: 0.12 }));
  g.appendChild(svgEl('circle', { cx: pos.x + 17*scale, cy: pos.y - 67*scale, r: 4.6*scale, fill: accent, opacity: 0.12 }));

  // body (outfit)
  g.appendChild(svgEl('rect', {
    x: pos.x - 34*scale,
    y: pos.y - 50*scale,
    width: 68*scale,
    height: 74*scale,
    rx: 18*scale,
    fill: outfit,
    stroke: outline,
    'stroke-width': 2
  }));

  // chest panel
  g.appendChild(svgEl('rect', {
    x: pos.x - 18*scale,
    y: pos.y - 34*scale,
    width: 36*scale,
    height: 22*scale,
    rx: 10*scale,
    fill: outfit2,
    stroke: 'rgba(11,18,32,0.10)',
    'stroke-width': 1.5
  }));
  // tiny indicator lights
  g.appendChild(svgEl('circle', { cx: pos.x - 7*scale, cy: pos.y - 23*scale, r: 2.4*scale, fill: accent, opacity: 0.75 }));
  g.appendChild(svgEl('circle', { cx: pos.x + 7*scale, cy: pos.y - 23*scale, r: 2.4*scale, fill: accent, opacity: 0.35 }));

  // status badge
  g.appendChild(svgEl('circle', {
    cx: pos.x + 26*scale,
    cy: pos.y - 40*scale,
    r: 7*scale,
    fill: accent,
    opacity: 0.95
  }));
  g.appendChild(svgEl('circle', {
    cx: pos.x + 26*scale,
    cy: pos.y - 40*scale,
    r: 13*scale,
    fill: accent,
    opacity: 0.12
  }));

  // arms
  g.appendChild(svgEl('line', {
    x1: pos.x - 34*scale,
    y1: pos.y - 20*scale,
    x2: pos.x - 58*scale,
    y2: pos.y - 8*scale,
    stroke: 'rgba(11,18,32,0.24)',
    'stroke-width': 4,
    'stroke-linecap': 'round'
  }));
  g.appendChild(svgEl('line', {
    x1: pos.x + 34*scale,
    y1: pos.y - 20*scale,
    x2: pos.x + 58*scale,
    y2: pos.y - 8*scale,
    stroke: 'rgba(11,18,32,0.24)',
    'stroke-width': 4,
    'stroke-linecap': 'round'
  }));

  // legs
  g.appendChild(svgEl('line', {
    x1: pos.x - 14*scale,
    y1: pos.y + 24*scale,
    x2: pos.x - 14*scale,
    y2: pos.y + 48*scale,
    stroke: 'rgba(11,18,32,0.24)',
    'stroke-width': 5,
    'stroke-linecap': 'round'
  }));
  g.appendChild(svgEl('line', {
    x1: pos.x + 14*scale,
    y1: pos.y + 24*scale,
    x2: pos.x + 14*scale,
    y2: pos.y + 48*scale,
    stroke: 'rgba(11,18,32,0.24)',
    'stroke-width': 5,
    'stroke-linecap': 'round'
  }));

  // shoes
  g.appendChild(svgEl('path', {
    d: `M ${pos.x - 22*scale} ${pos.y + 50*scale} Q ${pos.x - 14*scale} ${pos.y + 58*scale} ${pos.x - 4*scale} ${pos.y + 52*scale}`,
    fill: 'none',
    stroke: 'rgba(11,18,32,0.22)',
    'stroke-width': 4,
    'stroke-linecap': 'round'
  }));
  g.appendChild(svgEl('path', {
    d: `M ${pos.x + 4*scale} ${pos.y + 52*scale} Q ${pos.x + 14*scale} ${pos.y + 58*scale} ${pos.x + 22*scale} ${pos.y + 50*scale}`,
    fill: 'none',
    stroke: 'rgba(11,18,32,0.22)',
    'stroke-width': 4,
    'stroke-linecap': 'round'
  }));
}

function renderMap(data) {
  const layer = document.getElementById('agentsLayer');
  layer.innerHTML = '';

  const agents = data.agents || [];

  // Fixed positions unless overridden
  const defaultPos = {
    'Crawley': { x: 520, y: 275 },
    'Crawley-Forge': { x: 220, y: 245 },
    'Crawley-Lens': { x: 520, y: 155 },
    'Crawley-Guard': { x: 800, y: 270 }
  };

  // Add the commander (me)
  const commander = {
    name: 'Crawley',
    role: 'Commander',
    status: 'running',
    task: 'Coordinating',
    eta: '—',
    note: 'Online',
    risk: 'normal',
    pos: defaultPos['Crawley']
  };

  const all = [commander, ...agents].map(a => {
    const pos = a.pos || defaultPos[a.name] || { x: 500, y: 260 };
    return { ...a, pos };
  });

  // Draw subtle links from commander to each agent (behind sprites)
  const cmd = all.find(a => a.name === 'Crawley');
  const linksG = svgEl('g', { opacity: '0.95' });
  if (cmd) {
    for (const a of all) {
      if (a.name === cmd.name) continue;
      const st = (a.status || 'idle').toLowerCase();
      const link = svgEl('path', {
        class: `link st-${st}`,
        fill: 'none',
        d: `M ${cmd.pos.x} ${cmd.pos.y - 20} C ${cmd.pos.x} ${cmd.pos.y - 130}, ${a.pos.x} ${a.pos.y - 130}, ${a.pos.x} ${a.pos.y - 20}`
      });
      linksG.appendChild(link);
    }
  }
  layer.appendChild(linksG);

  all.forEach(a => {
    const pos = a.pos;
    const st = (a.status || 'idle').toLowerCase();
    const color = statusColor(st);

    const g = svgEl('g', { class: `agent-node st-${st}` });

    const isCommander = a.name === 'Crawley';
    const scale = isCommander ? 1.18 : 1.0;

    // Aura behind commander
    if (isCommander) {
      g.appendChild(svgEl('circle', {
        cx: pos.x,
        cy: pos.y - 40,
        r: 86,
        fill: color,
        opacity: 0.07
      }));
      g.appendChild(svgEl('circle', {
        cx: pos.x,
        cy: pos.y - 40,
        r: 64,
        fill: color,
        opacity: 0.06
      }));
    }

    addChibi(g, pos, scale, color);

    // Labels
    const labelX = pos.x - 70*scale;
    g.appendChild(svgText(labelX, pos.y + 78*scale, fmt(a.name), 'agent-label'));
    g.appendChild(svgText(labelX, pos.y + 98*scale, fmt(a.role, ''), 'agent-sub'));
    g.appendChild(svgText(labelX, pos.y + 122*scale, `Task: ${fmt(a.task)}`, 'agent-status'));
    g.appendChild(svgText(labelX, pos.y + 140*scale, `ETA: ${fmt(a.eta)}`, 'agent-status'));

    // Tooltip
    const tip = `${fmt(a.name)}\n${fmt(a.role,'')}\nStatus: ${st}\nTask: ${fmt(a.task)}\nETA: ${fmt(a.eta)}\nNote: ${fmt(a.note,'')}`;
    const titleEl = svgEl('title');
    titleEl.textContent = tip;
    g.appendChild(titleEl);

    layer.appendChild(g);
  });
}

async function loadStatus() {
  const bust = `t=${Date.now()}`;
  const res = await fetch(`${STATUS_URL}?${bust}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load status.json (${res.status})`);
  return res.json();
}

function applyStatus(data) {
  document.getElementById('lastUpdate').textContent = fmt(data.updatedAt);
  renderCards(data);
  renderMap(data);
}

async function refresh() {
  try {
    const data = await loadStatus();
    applyStatus(data);
  } catch (e) {
    console.error(e);
    document.getElementById('lastUpdate').textContent = 'ERROR';
  }
}

let timer = null;
function setAuto(on) {
  if (timer) clearInterval(timer);
  timer = null;
  if (on) timer = setInterval(refresh, 5000);
}

let es = null;
function connectLive(on) {
  try {
    if (es) es.close();
    es = null;

    if (!on) return;

    es = new EventSource(LIVE_EVENTS_URL);

    es.addEventListener('hello', () => {
      // live connected
    });

    es.addEventListener('status', (evt) => {
      try {
        const data = JSON.parse(evt.data);
        applyStatus(data);
      } catch (e) {
        console.error('bad status event', e);
      }
    });

    es.onerror = () => {
      // live may be unavailable; polling will handle updates if enabled
    };
  } catch (e) {
    console.error('live connect failed', e);
  }
}

document.getElementById('refreshBtn').addEventListener('click', refresh);
document.getElementById('autoRefresh').addEventListener('change', (e) => {
  setAuto(e.target.checked);
  connectLive(e.target.checked);
});

// Default: try live + polling
setAuto(true);
connectLive(true);
refresh();
