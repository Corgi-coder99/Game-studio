"""Exercise populated reports, legacy advice and real touch targets in Chromium."""
from playwright.sync_api import sync_playwright
import json,re,os,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
seed=json.loads(subprocess.check_output(['node','--input-type=module','-e',"""
import {kingdomInitial} from './kingdom.mjs';
import {createTacticsBattle,tickTactics} from './tactics.mjs';
import {recordBattleMail} from './mail.mjs';
const s=kingdomInitial();let b=createTacticsBattle(s,{id:'bot-test',name:'Trấn Thanh Phong',level:1,enemies:['wukong','guanyu']});
for(let i=0;i<6;i++)b=tickTactics(b,1,true,s.dragon,1);
b.winner='ally';recordBattleMail(s,b,{mode:'bot',target:'Trấn Thanh Phong'});
s.mailbox.reports[0].advice=['Báo cáo cũ còn tiếng Việt'];console.log(JSON.stringify(s));
"""],cwd=ROOT,text=True))
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for width,height,mobile in [(1440,900,False),(926,428,True),(428,926,True)]:
  c=b.new_context(viewport={'width':width,'height':height},is_mobile=mobile,has_touch=mobile);c.add_init_script('localStorage.setItem("thien-menh-kingdom-v2",'+json.dumps(json.dumps(seed))+');');page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto(os.environ.get('GAME_TEST_URL','http://127.0.0.1:3000'),timeout=60000);page.wait_for_selector('.game-nav')
  if page.locator('[data-confirm-realm]').count():page.locator('[data-confirm-realm]').click()
  if page.locator('[data-story-ack]').count():page.locator('[data-story-ack]').click()
  page.locator('.hud-mail').click();assert page.locator('.report-unit-card').count()>0
  def english():assert not re.search('[À-ÖØ-öø-ỹĐđ]',page.locator('.game-content').text_content()),page.locator('.game-content').text_content()
  english();page.screenshot(path=f'/tmp/mail-summary-{width}.png');page.locator('[data-report-analysis]').click();english();assert 'Advice Based on Battle Statistics' in page.locator('main').text_content();assert 'Báo cáo cũ' not in page.locator('main').text_content();page.screenshot(path=f'/tmp/mail-analysis-{width}.png')
  page.evaluate("document.querySelector('[data-report-summary]').click()");page.locator('.report-unit-card').first.click();assert page.locator('.description-dialog').count();assert not re.search('[À-ÖØ-öø-ỹĐđ]',page.locator('.description-dialog').inner_text());assert not errors,errors;print('Populated report, analysis, legacy advice and hero detail verified',width,height,flush=True);c.close()
 b.close()
