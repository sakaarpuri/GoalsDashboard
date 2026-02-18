#!/bin/bash
cd /data/.openclaw/workspace/stylesync
pkill -f "node backend/server" 2>/dev/null
sleep 2
node backend/server.js > server.log 2>&1 &
echo $! > server.pid
echo "Server started on port 3001"
sleep 3
curl -s http://localhost:3001/api/health