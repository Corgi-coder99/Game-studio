"""Verify attendance, recommendations, equal army slots, profile scrolling and real summon targets."""
from playwright.sync_api import sync_playwright
import json,re,time,subprocess,os
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {kingdomInitial} from './kingdom.mjs';import {chooseRealm} from './realms.mjs';let s=chooseRealm(kingdomInitial(),'shu','chengdu');s.commerce.gold=100000;s.story.seen=['embers-opening'];console.log(JSON.stringify(s));"],cwd=ROOT,text=True))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox'])
 for w,h,m in [(1440,900,False),(926,428,True),(428,926,True)]:
  c=b.new_context(viewport={'width':w,'height':h},is_mobile=m,has_touch=m);c.add_init_script('localStorage.setItem("thien-menh-kingdom-v2",'+json.dumps(json.dumps(seed))+');localStorage.setItem("tm-beginner-guide-v1",JSON.stringify({finished:true}));')
  page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(os.environ.get('GAME_TEST_URL','http://127.0.0.1:3010'));page.wait_for_selector('.game-nav')
  def scene(v):page.evaluate('v=>{const b=document.createElement("button");b.dataset.view=v;document.querySelector("#app").append(b);b.click();b.remove()}',v)
  scene('profile');assert not page.locator('.scene-controls').count();assert page.locator('.profile-scroll').evaluate('e=>e.scrollHeight>e.clientHeight');page.screenshot(path=f'/tmp/new-profile-{w}.png')
  scene('squads');assert page.locator('.squad-preset').count()==3;assert page.locator('.squad-hero-thumbs').first.evaluate('e=>e.children.length')==5
  if m:
   heights=page.locator('.squad-hero-thumbs').first.evaluate('e=>[...e.children].map(c=>c.getBoundingClientRect().height)');assert max(heights)-min(heights)<2,heights
   page.locator('.squad-preset-list').evaluate('e=>e.scrollTop=e.scrollHeight');page.screenshot(path=f'/tmp/new-squads-{w}.png');page.locator('[data-recommend-squad="2"]').click();assert page.locator('.formation-gallery').evaluate('e=>e.classList.contains("recommendation-open")')
  scene('daily');page.screenshot(path=f'/tmp/new-daily-{w}.png');assert page.locator('.daily-cell').count()==30;page.locator('[data-daily-claim]').click();assert page.locator('[data-daily-claim]').is_disabled();assert not re.search('[À-ÖØ-öø-ỹĐđ]',page.locator('main').text_content())
  scene('summon');assert page.locator('.summon-seal').count()==2;page.locator('[data-summon-count="10"]').click();page.locator('[data-summon="10"]').click();assert page.locator('.summon-card').count()==10;page.wait_for_timeout(1100);page.screenshot(path=f'/tmp/new-summon-{w}.png');page.locator('[data-summon-skip]').click()
  scene('world');page.wait_for_timeout(1500);page.screenshot(path=f'/tmp/new-world-{w}.png')
  scene('settings');page.locator('[data-guide-start]').click();assert page.locator('.beginner-coach').count();page.locator('[data-guide-next]').click();page.locator('[data-guide-go]').click();assert page.locator('[data-production-site="farm"]').count();page.locator('[data-guide-close]').click();assert not page.locator('.beginner-coach').count();assert not errors,errors;print('New UI verified',w,h,flush=True);c.close()
 b.close()
