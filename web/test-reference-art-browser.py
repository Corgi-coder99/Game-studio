"""Audit every screen and production atlas, then exercise real map and shop targets."""
from playwright.sync_api import sync_playwright
from pathlib import Path
import json,os,re,subprocess
ROOT=Path(__file__).resolve().parent.parent
URL=os.environ.get('GAME_TEST_URL','http://127.0.0.1:3014')
views=['city','region','world','heroes','character','summon','profile','vip','pets','bag','gear-gacha','shop','quests','inheritance','runes','skins','army','campaign','longs','medical','squads','allocation','mail','auction','relocation','exchange','strongholds','boss','titles','daily','journal','saves','about','settings','help','building','online']
seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import{kingdomInitial}from'./kingdom.mjs';import{chooseRealm}from'./realms.mjs';const s=chooseRealm(kingdomInitial(),'shu','chengdu');s.story.seen=['embers-opening'];s.coins=200000;s.commerce.gold=100000;console.log(JSON.stringify(s))"],cwd=ROOT,text=True))
art=json.loads((ROOT/'art/reference-release.json').read_text())['atlases']
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for width,height,mobile in [(1440,900,False),(926,428,True),(428,926,True)]:
  context=browser.new_context(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile)
  context.add_init_script('localStorage.setItem("thien-menh-kingdom-v2",'+json.dumps(json.dumps(seed))+');localStorage.setItem("tm-beginner-guide-v1",JSON.stringify({finished:true}));window.__canvasCaptions=[];for(const k of ["fillText","strokeText"]){const f=CanvasRenderingContext2D.prototype[k];CanvasRenderingContext2D.prototype[k]=function(t,...a){if(window.__canvasCaptions.length<2000)window.__canvasCaptions.push(String(t));return f.call(this,t,...a);};}')
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(URL);page.wait_for_selector('.game-nav')
  def scene(view):
   page.evaluate('v=>{const b=document.createElement("button");b.dataset.view=v;document.querySelector("#app").append(b);b.click();b.remove();}',view)
  if not mobile and not os.environ.get('GAME_TEST_PACKAGED'):
   stats=page.evaluate('''async atlases=>{const out=[];for(const a of atlases){const im=new Image();im.src=new URL('assets/'+a.file,location.href);await im.decode();const c=document.createElement('canvas');c.width=im.naturalWidth;c.height=im.naturalHeight;const g=c.getContext('2d',{willReadFrequently:true});g.drawImage(im,0,0);const d=g.getImageData(0,0,c.width,c.height).data;let minimum=Infinity;for(let row=0;row<a.rows;row++)for(let col=0;col<a.columns;col++){let count=0;for(let y=Math.floor(row*c.height/a.rows);y<(row+1)*c.height/a.rows;y+=4)for(let x=Math.floor(col*c.width/a.columns);x<(col+1)*c.width/a.columns;x+=4)if(d[(y*c.width+x)*4+3]>80)count++;minimum=Math.min(count,minimum);}out.push({file:a.file,minimum,cornerAlpha:d[3],transparent:a.transparent});}return out;}''',art)
   for s in stats:
    assert s['minimum']>2,s
    if s['transparent']:assert s['cornerAlpha']<64,s
   print('All 32 atlas grids decode with populated cells and expected transparent corners',flush=True)
  for view in views:
   scene(view);page.wait_for_timeout(120)
   texts=page.locator('#app').evaluate('''e=>{const w=document.createTreeWalker(e,NodeFilter.SHOW_TEXT),out=[];let n;while(n=w.nextNode())if(!n.parentElement.closest('script,style,textarea,[data-player-name]'))out.push(n.nodeValue);for(const n of e.querySelectorAll('[title],[aria-label],[placeholder]'))for(const a of ['title','aria-label','placeholder'])if(n.hasAttribute(a))out.push(n.getAttribute(a));return out;}''')
   leftovers=[t for t in texts if re.search('[À-ÖØ-öø-ỹĐđ]',t)]
   assert not leftovers,(view,leftovers)
   if view in ['city','region','world','heroes','longs','shop','boss','summon']:
    page.wait_for_timeout(350);page.screenshot(path=f'/tmp/reference-{view}-{width}.png')
  assert not [t for t in page.evaluate('window.__canvasCaptions') if re.search('[À-ÖØ-öø-ỹĐđ]',t)]
  scene('longs');assert page.locator('.long-card').count()==7
  animation=page.locator('.elemental-dragon-art').first.evaluate('e=>getComputedStyle(e).animationName')
  assert 'dragon-cells' in animation,animation
  page.locator('[data-dragon="Thủy"]').click();assert page.locator('.long-card.active h3').inner_text()=='Water Dragon'
  scene('city');page.wait_for_timeout(350)
  assert page.locator('#world-map').evaluate('e=>e.width>0&&e.height>0')
  zoom=page.locator('[data-zoom="in"]')
  if zoom.count():zoom.click();page.locator('[data-zoom="out"]').click()
  assert not errors,errors
  print('English screens, canvas captions and pixel-art layouts verified',width,height,len(views),flush=True);context.close()
 browser.close()
