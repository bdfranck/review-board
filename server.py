#!/usr/bin/env python3
"""
Simple HTTP server with GitHub API proxy to avoid CORS issues.
"""

import http.server
import socketserver
import urllib.request
import urllib.error
import json
import os
from urllib.parse import urlparse, parse_qs

PORT = 8080

class ProxyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        # Proxy GitHub API requests
        if self.path.startswith('/api/'):
            github_path = self.path.replace('/api', '')
            github_url = f'https://api.github.com{github_path}'
            
            try:
                req = urllib.request.Request(
                    github_url,
                    headers={
                        'User-Agent': 'PR-Review-Board',
                        'Accept': 'application/vnd.github.v3+json'
                    }
                )
                
                with urllib.request.urlopen(req) as response:
                    self.send_response(response.status)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(response.read())
                    
            except urllib.error.HTTPError as e:
                self.send_response(e.code)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(e.read())
                
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                error_msg = json.dumps({'error': str(e)})
                self.wfile.write(error_msg.encode())
        else:
            # Serve static files
            super().do_GET()

if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    with socketserver.TCPServer(("", PORT), ProxyHTTPRequestHandler) as httpd:
        print(f"Server running at http://localhost:{PORT}/")
        print("Press Ctrl+C to stop")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")
