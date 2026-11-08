"""Loopback-only developer workspace. Python 3 standard library only."""
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, parse_qs
import argparse, json, secrets, webbrowser, zipfile
ROOT = Path(__file__).resolve().parent
TOKEN = secrets.token_urlsafe(32)
parser = argparse.ArgumentParser(description='Local game developer workspace')
parser.add_argument('--port', type=int, default=8769)
parser.add_argument('--no-browser', action='store_true')
args = parser.parse_args()
if not 1024 <= args.port <= 65535:
    parser.error('Port must be between 1024 and 65535.')
PORT = args.port
GAME = next((folder / 'Thien-Menh-Windows.zip' for folder in [ROOT, ROOT.parent, ROOT.parent.parent] if (folder / 'Thien-Menh-Windows.zip').is_file()), ROOT.parent / 'Thien-Menh-Windows.zip')
if not GAME.exists():
    raise SystemExit('Place this folder beside Thien-Menh-Windows.zip before starting live mode. Offline JSON editing works without it.')
with zipfile.ZipFile(GAME) as archive:
    names = [n for n in archive.namelist() if n.endswith('/Thien-Menh.html') or n == 'Thien-Menh.html']
    if len(names) != 1:
        raise SystemExit('The game ZIP must contain exactly one Thien-Menh.html.')
    game = archive.read(names[0]).decode('utf-8')
marker = '\n})();\n</script>'
if game.count(marker) != 1:
    raise SystemExit('Unsupported game bundle. Rebuild the current release.')
bridge = (ROOT / 'live-bridge.js').read_text().replace('__DEV_TOKEN__', json.dumps(TOKEN))
GAME_HTML = game.replace(marker, '\n' + bridge + marker).encode()
class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        target = urlsplit(self.path)
        host = self.headers.get('Host', '')
        origin = self.headers.get('Origin')
        allowed = f'127.0.0.1:{PORT}'
        if host != allowed or (origin and origin != 'http://' + allowed):
            self.send_error(403); return
        if parse_qs(target.query).get('token') != [TOKEN]:
            self.send_error(403); return
        if target.path == '/':
            body = (ROOT / 'Heavenly-Mandate-DevTools.html').read_bytes()
        elif target.path == '/play/':
            body = GAME_HTML
        else:
            self.send_error(404); return
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.send_header('Cache-Control', 'no-store')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('X-Frame-Options', 'SAMEORIGIN')
        self.end_headers(); self.wfile.write(body)
url = f'http://127.0.0.1:{PORT}/?token={TOKEN}'
print('Developer workspace:', url)
print('Close this window or press Ctrl+C to stop. Keep this local session URL private.')
if not args.no_browser:
    webbrowser.open(url)
ThreadingHTTPServer(('127.0.0.1', PORT), Handler).serve_forever()
