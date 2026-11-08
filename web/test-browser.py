from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
from threading import Thread
from pathlib import Path
from urllib.parse import unquote,urlparse
from playwright.sync_api import sync_playwright
import tempfile,json,time,gzip,mimetypes
root=Path(__file__).resolve().parent.parent/'docs';counts={};fault={'remaining':1}
class Handler(SimpleHTTPRequestHandler):
 def translate_path(self,path):
  path=unquote(urlparse(path).path)
  if not path.startswith('/Game-studio/'):return '/nonexistent'
  parts=Path(path.removeprefix('/Game-studio/')).parts
  if '..' in parts:return '/nonexistent'
  return str(root.joinpath(*parts))
 def do_GET(self):
  counts[self.path]=counts.get(self.path,0)+1
  if self.path.endswith('/assets/skills-pixel.png') and fault['remaining']:
   fault['remaining']-=1;self.send_response(503);self.end_headers();return
  local=Path(self.translate_path(self.path))
  if local.is_file() and local.suffix in ['.html','.js','.css','.webmanifest']:
   data=gzip.compress(local.read_bytes());self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(local)[0] or 'application/json');self.send_header('Content-Encoding','gzip');self.send_header('Content-Length',str(len(data)));self.send_header('Vary','Accept-Encoding');self.end_headers();self.wfile.write(data);return
  super().do_GET()
 def end_headers(self):self.send_header('Cache-Control','no-store');super().end_headers()
 def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',3070),Handler);Thread(target=server.serve_forever,daemon=True).start();url='http://127.0.0.1:3070/Game-studio/';errors=[]
with tempfile.TemporaryDirectory(prefix='Thien Menh Safari PWA ') as profile,sync_playwright() as p:
 def launch():
  ctx=p.chromium.launch_persistent_context(profile,executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'],viewport={'width':926,'height':428},device_scale_factor=3,is_mobile=True,has_touch=True);ctx.set_default_timeout(25000);return ctx
 ctx=launch();page=ctx.pages[0];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(url);page.locator('#download').tap();page.wait_for_function('document.getElementById("download").textContent==="Retry"',timeout=120000);assert page.locator('#play').get_attribute('aria-disabled')=='true';print('failed transfer never unlocks partial game',flush=True)
 page.locator('#download').tap();page.wait_for_function('document.getElementById("play").getAttribute("aria-disabled")==="false"',timeout=180000);assert 'Ready Offline' in page.locator('#status').inner_text();print('retry completes verified cache',flush=True);page.screenshot(path='/tmp/safari-pwa-ready.png')
 manifest=page.evaluate('fetch("manifest.webmanifest").then(r=>r.json())');assert manifest['scope']=='./' and manifest['display']=='standalone'
 # Delete one cached image; status must no longer claim ready, and repair fetches only that missing item.
 page.evaluate('''async()=>{for(const key of await caches.keys()){if(key.startsWith('thien-menh-safari-')){const c=await caches.open(key);await c.delete(new URL('assets/roster-a-pixel.png',location.href).href);}}}''');page.reload();assert page.locator('#play').get_attribute('aria-disabled')=='true';page.locator('#download').tap();page.wait_for_function('document.getElementById("play").getAttribute("aria-disabled")==="false"',timeout=120000);print('missing cached image is detected and repaired',flush=True)
 ctx.set_offline(True);page.reload();page.wait_for_function('document.getElementById("play").getAttribute("aria-disabled")==="false"');page.locator('#play').tap();page.wait_for_selector('#app .game-nav');page.screenshot(path='/tmp/safari-pwa-first-game.png');assert not errors,errors
 # Complete first-run setup, then use the game's explicit sandbox button to test a 100-pull batch.
 page.locator('[data-confirm-realm]').tap();page.locator('.game-nav [data-view="studio"]').tap()
 for _ in range(20):
  target=page.locator('[data-sandbox-max="all"]')
  if target.count() and target.is_visible():break
  page.locator('.scene-controls [data-scene-next]').tap()
 target.tap();page.locator('.game-nav [data-view="summon"]').tap();page.locator('[data-summon="100"]').tap();assert page.locator('.summon-card').count()==100;page.locator('[data-summon-skip]').tap();page.locator('.game-nav [data-view="city"]').tap();page.screenshot(path='/tmp/safari-pwa-offline-city.png');assert json.loads(page.evaluate('localStorage.getItem("thien-menh-kingdom-v2")'))['pulls']>=100;print('game, all 100 cards and images work offline',flush=True);ctx.close()

 # A fully closed browser reopens at the cached project root, with networking disabled from the start.
 ctx=launch();ctx.set_offline(True);page=ctx.pages[0];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(url);page.wait_for_function('document.getElementById("play").getAttribute("aria-disabled")==="false"');page.locator('#play').tap();page.wait_for_selector('.game-nav');assert json.loads(page.evaluate('localStorage.getItem("thien-menh-kingdom-v2")'))['pulls']>=100;assert not errors,errors;print('offline relaunch survives browser restart and preserves save',flush=True);ctx.close()
server.shutdown();server.server_close();print('PASS scoped PWA install, failure/retry, integrity, repair, offline navigation and cold restart. Chromium mobile emulation; physical Safari not tested.',flush=True)
