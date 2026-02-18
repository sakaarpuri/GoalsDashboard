#!/usr/bin/env bash
set -euo pipefail

# Example: update Crawley-Forge to running
# Usage:
#   DASHBOARD_TOKEN=... ./update-example.sh

TOKEN_HEADER=()
if [[ -n "${DASHBOARD_TOKEN:-}" ]]; then
  TOKEN_HEADER=( -H "x-dashboard-token: ${DASHBOARD_TOKEN}" )
fi

curl -sS -X POST "http://127.0.0.1:8790/update" \
  -H 'content-type: application/json' \
  "${TOKEN_HEADER[@]}" \
  -d '{
    "agents": [
      {
        "name": "Crawley-Forge",
        "status": "running",
        "task": "Scaffold MVP",
        "eta": "~30m",
        "note": "Working",
        "risk": "normal"
      }
    ]
  }'

echo
