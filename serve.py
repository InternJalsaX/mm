"""Local dev server for MM Motors.

Plain `python -m http.server` lets the browser cache CSS and JS between edits,
which makes design iteration unreliable. This adds no-store headers and the
correct MIME type for ES modules.

    python serve.py [port]
"""
import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).parent


class Handler(SimpleHTTPRequestHandler):
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".js": "text/javascript",
        ".mjs": "text/javascript",
        ".json": "application/json",
        ".svg": "image/svg+xml",
        ".webp": "image/webp",
        ".avif": "image/avif",
        ".woff2": "font/woff2",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Keep the console readable: only report failures
        if args and str(args[1]).startswith(("4", "5")):
            super().log_message(fmt, *args)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8123
    handler = partial(Handler, directory=str(ROOT))
    print(f"MM Motors on http://localhost:{port}")
    ThreadingHTTPServer(("127.0.0.1", port), handler).serve_forever()
