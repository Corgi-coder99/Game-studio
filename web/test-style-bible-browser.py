"""Golden palette, pixel scaling, asset alpha, controls and software fallback."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import subprocess,json,os
ROOT=Path(__file__).resolve().parent.parent
style=json.loads((ROOT/'config/style-bible.json').read_text())
allowed=[c.lower() for colors in style['ramps'].values() for c in colors]
seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{kingdomInitial}from'./kingdom.mjs';import{chooseRealm}from'./realms.mjs';let s=chooseRealm(kingdomInitial(),'shu','chengdu');s.story.seen=['embers-opening'];s.commerce.gold=100000;console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
URL=os.environ.get('GAME_TEST_URL','http://127.0.0.1:3010')
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height,mobile,cpu in [(1440,900,False,False),(926,428,True,False),(428,926,True,False),(1280,720,False,True)]:
  ctx=browser.new_context(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile)
  ctx.add_init_script('localStorage.setItem("thien-menh-kingdom-v2",'+json.dumps(json.dumps(seed))+');localStorage.setItem("tm-beginner-guide-v1",JSON.stringify({finished:true}));')
  if cpu:ctx.add_init_script("const nativeContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:nativeContext.call(this,type,...args)}")
  page=ctx.new_page();page.set_default_timeout(60000);errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(URL);page.wait_for_selector('.game-nav');page.wait_for_function("document.documentElement.dataset.paletteRenderer")
  result=page.locator('#world-map').evaluate('''(canvas,allowed)=>{const data=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data,colors=new Set();for(let i=0;i<data.length;i+=4)if(data[i+3])colors.add('#'+[data[i],data[i+1],data[i+2]].map(n=>n.toString(16).padStart(2,'0')).join(''));return {bad:[...colors].filter(c=>!allowed.includes(c)),count:colors.size,scale:Number(canvas.dataset.pixelScale)};}''',allowed)
  assert result['bad']==[],result;assert result['count']<=47;assert result['scale']>=1 and result['scale']==int(result['scale'])
  # Palette geometry must retain the inverse mapping used by real map gestures.
  if '/Game-studio/' not in URL and '876' not in URL:
   inverse=page.evaluate('''async()=>{const m=await import('/palette-renderer.mjs'),c=document.querySelector('#world-map'),p={x:250,y:300},q=m.goldenCanvasPoint(c,m.goldenCanvasDisplayPoint(c,p));return Math.abs(q.x-p.x)+Math.abs(q.y-p.y);}''');assert inverse<1e-6
   data=page.evaluate('''async()=>{const m=await import('/palette-renderer.mjs'),src=document.createElement('canvas');src.width=3;src.height=1;const c=src.getContext('2d'),d=c.createImageData(3,1);d.data.set([120,180,90,127,120,180,90,128,255,255,255,255]);c.putImageData(d,0,0);const url=await m.prepareGoldenArt(src.toDataURL());const img=new Image();img.src=url;await img.decode();c.clearRect(0,0,3,1);c.drawImage(img,0,0);return [...c.getImageData(0,0,3,1).data];}''');assert data[3]==0 and data[7]==255 and data[11]==255,data
  for scene in ['region','world','city']:
   page.evaluate('v=>{const b=document.createElement("button");b.dataset.view=v;document.querySelector("#app").append(b);b.click();b.remove()}',scene);page.wait_for_timeout(150)
   bad=page.locator('#world-map').evaluate("(canvas,allowed)=>{const p=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;for(let i=0;i<p.length;i+=16){const c='#'+[p[i],p[i+1],p[i+2]].map(n=>n.toString(16).padStart(2,'0')).join('');if(p[i+3]&&!allowed.includes(c))return c;}return null;}",allowed);assert bad is None,(scene,bad)
  if '/Game-studio/' not in URL and '876' not in URL:
   target=page.evaluate("""async()=>{const {citySites,cityCameraLayout}=await import('/city-layout.mjs'),{goldenCanvasDisplayPoint}=await import('/palette-renderer.mjs'),c=document.querySelector('#world-map'),s=citySites.find(s=>s.id==='farm'),l=cityCameraLayout(c.clientWidth,c.clientHeight,{zoom:1},matchMedia('(pointer:coarse)').matches),q=goldenCanvasDisplayPoint(c,{x:(s.x-s.y)*48*l.z+l.ox,y:((s.x+s.y)*24-s.size*.45)*l.z+l.oy}),r=c.getBoundingClientRect();return document.documentElement.classList.contains('rotated-game')?{x:r.right-q.y/c.clientHeight*r.width,y:r.top+q.x/c.clientWidth*r.height}:{x:r.left+q.x/c.clientWidth*r.width,y:r.top+q.y/c.clientHeight*r.height};}""");page.mouse.click(target['x'],target['y']);page.wait_for_selector('[data-production-site="farm"]');page.locator('[data-view="city"]').first.click()
  # Wheel and explicit controls remain usable after integer presentation.
  page.locator('[data-zoom="1"]').click();page.locator('[data-center]').click();page.locator('.game-nav [data-view="shop"]').click();page.locator('[data-buy-box="shardBoxD"]').click();page.locator('[data-open-box="shardBoxD"]').click();page.locator('.game-nav [data-view="settings"]').click();page.locator('[data-style-lineup]').click();page.wait_for_selector('.style-lineup-canvas');page.wait_for_timeout(250);assert int(page.locator('.style-lineup-canvas').get_attribute('data-integer-scale'))>=1;page.screenshot(path=f'/tmp/golden-contract-{width}-cpu-{cpu}.png');page.locator('[data-close-style-lineup]').click();assert not errors,errors
  print('Golden UI, art alpha, palette pixels, inverse map coordinates and shop controls passed',width,height,'CPU' if cpu else 'GPU',flush=True);ctx.close()
 browser.close()
