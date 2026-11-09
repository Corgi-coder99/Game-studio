"""Run the bundled game using only the Python standard library."""
import argparse
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import sys
import threading
from urllib.parse import urlsplit
import webbrowser


GAME_FILE = Path(__file__).resolve().parent / 'Thien-Menh.html'


class GameHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_game(include_body=True)

    def do_HEAD(self):
        self.send_game(include_body=False)

    def send_game(self, include_body):
        if urlsplit(self.path).path not in ('/', '/Thien-Menh.html'):
            self.send_error(404)
            return
        try:
            content = GAME_FILE.read_bytes()
        except OSError:
            self.send_error(500, 'Cannot read Thien-Menh.html. Extract the entire ZIP first.')
            return
        self.send_response(200)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(content)))
        self.send_header('Cache-Control', 'no-store')
        self.end_headers()
        if include_body:
            self.wfile.write(content)


def main():
    parser = argparse.ArgumentParser(description='Thien Menh - offline pixel game; Python 3, no extra packages.')
    parser.add_argument('--port', type=int, default=8765, help='Local port (default: 8765).')
    parser.add_argument('--no-browser', action='store_true', help='Do not open a browser automatically.')
    args = parser.parse_args()
    if not 0 <= args.port <= 65535:
        parser.error('Port must be between 0 and 65535.')
    if not GAME_FILE.is_file():
        print('Missing Thien-Menh.html. Extract the entire ZIP next to serve_game.py.', file=sys.stderr)
        return 1
    try:
        server = ThreadingHTTPServer(('127.0.0.1', args.port), GameHandler)
    except OSError as error:
        print('Cannot start local server: {}\nTry: python serve_game.py --port 8766'.format(error), file=sys.stderr)
        return 1
    url = 'http://127.0.0.1:{}/'.format(server.server_port)
    print('Thien Menh - OFFLINE PIXEL EDITION', flush=True)
    print('Open: ' + url, flush=True)
    print('Keep this window open while playing. Press Ctrl+C to stop.', flush=True)
    if not args.no_browser:
        def open_browser():
            try:
                webbrowser.open(url)
            except webbrowser.Error:
                print('Open the address above in Edge or Chrome.', flush=True)
        timer = threading.Timer(0.5, open_browser)
        timer.daemon = True
        timer.start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nGame server stopped.')
    finally:
        server.server_close()
    return 0


if __name__ == '__main__':
    sys.exit(main())
