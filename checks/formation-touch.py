from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for name,w,h,touch in [('desktop',1626,902,False),('phone',926,428,True),('upright',428,926,True),('short',812,320,True)]:
  context=browser.new_context(viewport={'width':w,'height':h},is_mobile=touch,has_touch=touch)
  page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:3000');page.locator('[data-confirm-realm]').click();page.locator('.game-nav [data-view="heroes"]').click();page.wait_for_timeout(300)
  assert page.locator('.formation-cell').count()==4
  assert page.locator('.formation-stage').evaluate('e=>{const stage=e.getBoundingClientRect();return [...e.querySelectorAll("[data-slot-select]")].every(b=>{const r=b.getBoundingClientRect();return r.left>=stage.left-1&&r.right<=stage.right+1&&r.top>=stage.top-1&&r.bottom<=stage.bottom+1})}'),name
  if touch:
   rect=page.locator('.hero-carousel').bounding_box();cx=rect['x']+rect['width']*.5;cy=rect['y']+rect['height']*.5;rotated=page.evaluate('document.documentElement.classList.contains("rotated-game")');session=context.new_cdp_session(page)
   def finger(t):return {'x':cx-55+110*t if rotated else cx,'y':cy if rotated else cy+55-110*t,'id':1}
   session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[finger(0)]})
   for n in range(1,9):session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[finger(n/8)]});page.wait_for_timeout(30)
   session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(300);assert page.locator('.hero-carousel').evaluate('e=>e.scrollTop')>0,name
   page.locator('.hero-carousel').evaluate('e=>e.scrollTop=0')
  slot=page.locator('[data-slot-select]').first.get_attribute('data-slot-select');page.locator('[data-slot-select]').first.click()
  target=page.locator('.hero-carousel [data-team="diaochan"]');target.scroll_into_view_if_needed();offset=page.locator('.hero-carousel').evaluate('e=>({x:e.scrollLeft,y:e.scrollTop})');target.click();page.wait_for_timeout(100)
  assert page.locator('[data-slot="'+slot+'"] [data-inspect="diaochan"]').count()==1
  restored=page.locator('.hero-carousel').evaluate('e=>({x:e.scrollLeft,y:e.scrollTop})');assert abs(restored['y']-offset['y'])<2 and abs(restored['x']-offset['x'])<2,(name,offset,restored)
  page.locator('[data-remove-slot="'+slot+'"]').click();page.locator('[data-slot-select="'+slot+'"]').click();target=page.locator('.hero-carousel [data-team="diaochan"]');target.scroll_into_view_if_needed();target.click();assert page.locator('[data-slot="'+slot+'"] [data-inspect="diaochan"]').count()==1
  if touch:
   page.locator('[data-formation-help]').click();assert page.locator('.recommendation-panel').is_visible();page.locator('[data-recommend-plan="boss"]').click();assert page.locator('.recommendation-panel').is_visible();page.locator('[data-formation-help]').click();assert page.locator('.formation-stage').is_visible()
  page.screenshot(path='/tmp/formation-'+name+'.png')
  page.locator('[data-slot="'+slot+'"] [data-inspect]').click();assert page.locator('.doll-hall').is_visible();page.screenshot(path='/tmp/character-'+name+'.png');assert page.locator('.doll-stage').evaluate('e=>{const a=e.getBoundingClientRect(),b=e.querySelector("[data-team]").getBoundingClientRect();return b.left>=a.left-1&&b.right<=a.right+1&&b.top>=a.top-1&&b.bottom<=a.bottom+1}'),name;page.screenshot(path='/tmp/character-'+name+'.png');page.locator('.doll-title [data-view="heroes"]').click();assert page.locator('.formation-cell').count()==4
  assert not errors,errors
  print(name,'PASS four visible slots, replace/remove/reassign, roster position, recommendations and hero details',flush=True);context.close()
 browser.close()
