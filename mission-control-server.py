#!/usr/bin/env python3
"""
Password-protected Mission Control server
"""

import http.server
import socketserver
import json
import os
import base64
from pathlib import Path

PORT = 8080
NOTES_FILE = '/data/.openclaw/workspace/mission-control-notes.json'
PASSWORD = 'skaar2026'  # Simple password for now

class Handler(http.server.SimpleHTTPRequestHandler):
    def is_authenticated(self):
        auth = self.headers.get('Authorization')
        if auth:
            try:
                scheme, credentials = auth.split(' ', 1)
                if scheme.lower() == 'basic':
                    decoded = base64.b64decode(credentials).decode('utf-8')
                    username, password = decoded.split(':', 1)
                    return password == PASSWORD
            except:
                pass
        return False
    
    def request_auth(self):
        self.send_response(401)
        self.send_header('WWW-Authenticate', 'Basic realm="Mission Control"')
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(b'<h1>Authentication Required</h1>')
    
    def do_GET(self):
        if not self.is_authenticated():
            self.request_auth()
            return
        
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
        if not self.is_authenticated():
            self.request_auth()
            return
        
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

with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
    print(f"🔒 Password-protected server running at http://0.0.0.0:{PORT}")
    print(f"Password: {PASSWORD}")
    httpd.serve_forever()
