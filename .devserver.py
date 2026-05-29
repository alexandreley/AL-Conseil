"""
Mini-serveur local qui mime le comportement de Vercel (cleanUrls + redirects).
Usage : python3 .devserver.py [port]
"""

from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse
import os
import sys

REDIRECTS = {
    "/index": "/",
    "/index.html": "/",
    "/cabinet.html": "/cabinet",
    "/contact.html": "/contact",
    "/mentions-legales.html": "/mentions-legales",
    "/design-system.html": "/",
    "/design-system": "/",
}

CLEAN_TO_FILE = {
    "/": "/index.html",
    "/cabinet": "/cabinet.html",
    "/contact": "/contact.html",
    "/mentions-legales": "/mentions-legales.html",
}


class VercelLikeHandler(SimpleHTTPRequestHandler):
    def _rewrite(self):
        parsed = urlparse(self.path)
        path = parsed.path
        query = ("?" + parsed.query) if parsed.query else ""
        if path in REDIRECTS:
            self.send_response(308)
            self.send_header("Location", REDIRECTS[path] + query)
            self.end_headers()
            return False
        if path in CLEAN_TO_FILE:
            self.path = CLEAN_TO_FILE[path] + query
        return True

    def do_GET(self):
        if self._rewrite():
            super().do_GET()

    def do_HEAD(self):
        if self._rewrite():
            super().do_HEAD()

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    print(f"Vercel-like dev server on http://localhost:{port}")
    ThreadingHTTPServer(("", port), VercelLikeHandler).serve_forever()
