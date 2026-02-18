# Crawley Agent Dashboard (MVP)

A lightweight 2D overview page that reads `status.json` and renders a simple map + agent cards.

## Run (on the VPS)

### Option 2A (live, recommended): SSE server

From this folder:

```bash
cd /data/.openclaw/workspace/agent-dashboard
node live-server.js
```

It binds to `127.0.0.1:8790` by default.

(Optional auth):

```bash
export DASHBOARD_TOKEN='change-me'
node live-server.js
```

### Option 1 (static): Python server

```bash
cd /data/.openclaw/workspace/agent-dashboard
python3 -m http.server 8788 --bind 127.0.0.1
```

### Access safely from your laptop (SSH port-forward)

Live server:

```bash
ssh -L 8790:127.0.0.1:8790 <user>@<vps_host>
```

Open: http://127.0.0.1:8790/

Static server:

```bash
ssh -L 8788:127.0.0.1:8788 <user>@<vps_host>
```

Open: http://127.0.0.1:8788/

## Update statuses

Edit `status.json` (task/status/eta/note). Refresh the page.

Status values: `idle | running | blocked | warning`

## Security

Do NOT expose this port publicly without auth + TLS. SSH tunnel or Tailscale is the recommended path.

## Visuals notes

The dashboard is intentionally "static" (no heavy assets). The map scene and agent sprites are drawn with SVG primitives; status-driven CSS animations are subtle and respect `prefers-reduced-motion`.
