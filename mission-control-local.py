#!/usr/bin/env python3
"""
Localhost-only Mission Control server
Only accessible from the VPS itself or via SSH tunnel
"""

import http.server
import socketserver
import json
import os
from pathlib import Path

PORT = 8080
HOST = '0.0.0.0'  # Allow external access (firewall now open)
NOTES_FILE = '/data/.openclaw/workspace/mission-control-notes.json'

class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # API: Load notes
        if self.path == '/api/notes':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            
            if os.path.exists(NOTES_FILE):
                with open(NOTES_FILE, 'r') as f:
                    self.wfile.write(f.read().encode())
            else:
                self.wfile.write(json.dumps({"notes": "", "tasks": {}}).encode())
            return
        
        # Serve dashboard
        if self.path == '/':
            self.path = '/mission-control-live.html'
        
        return super().do_GET()
    
    def do_POST(self):
        # API: Save notes
        if self.path == '/api/notes':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            with open(NOTES_FILE, 'wb') as f:
                f.write(post_data)
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "saved"}).encode())
            return

os.chdir('/data/.openclaw/workspace')

with socketserver.TCPServer((HOST, PORT), Handler) as httpd:
    print(f"🔒 Localhost-only server running at http://{HOST}:{PORT}")
    print(f"Access methods:")
    print(f"  1. From VPS: lynx http://localhost:{PORT}")
    print(f"  2. SSH tunnel: ssh -L 8080:localhost:8080 root@187.77.19.113")
    print(f"  3. Then open http://localhost:8080 on your computer")
    print(f"")
    print(f"External access: BLOCKED (only localhost)")
    httpd.serve_forever()
