#!/bin/bash
# Mission Control SSH Tunnel
# Double-click to connect, then open http://localhost:8080 in browser

echo "🚀 Starting Mission Control tunnel..."
echo ""
echo "After connection opens:"
echo "1. Open browser: http://localhost:8080"
echo "2. Login: username=anything, password=skaar2026"
echo ""
echo "Keep this window open while using the dashboard"
echo "Press Ctrl+C to disconnect"
echo ""

ssh -L 8080:localhost:8080 root@187.77.19.113
