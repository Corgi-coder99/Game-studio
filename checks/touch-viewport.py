from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for name,size,touch in [('phone-landscape',{'width':926,'height':428},True),('phone-portrait',{'width':428,'height':926},True),('desktop',{'width':1440,'height':900},False)]:
  c=b.new_context(viewport=size,is_mobile=touch,has_touch=touch);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)));page.goto('http://127.0.0.1:3000');page.locator('[data-confirm-realm]').click();page.wait_for_timeout(3500)
  assert page.evaluate('scrollX===0&&scrollY===0')
  if touch:
   assert page.evaluate('document.documentElement.classList.contains("touch-game")')
   page.evaluate('window.originalMap=document.querySelector("canvas")');page.set_viewport_size({'width':size['width'],'height':size['height']-20});page.wait_for_timeout(300);assert page.evaluate('window.originalMap===document.querySelector("canvas")')
   page.mouse.move(450,230);page.mouse.down();page.mouse.move(550,240,steps=12);page.mouse.up();assert page.evaluate('scrollY===0')
  page.locator('[data-building="dragon"]').first.click();page.wait_for_timeout(500)
  assert page.locator('.long-card').count()==7
  assert page.locator('.long-card .elemental-dragon-art').first.evaluate('e=>e.offsetWidth===e.offsetHeight && getComputedStyle(e).backgroundSize==="700% 400%" && !["50%"].includes(getComputedStyle(e).backgroundPositionY)')
  page.screenshot(path='/tmp/v13-'+name+'-longs.png')
  if touch:
   page.locator('.long-gallery').evaluate('e=>e.scrollTop=9999');assert page.locator('[data-dragon="Bóng tối"]').is_visible()
  assert not errors,errors
  print(name,'PASS stable viewport, seven dragons, scrollable gallery; no page errors',flush=True)
  c.close()
 b.close()
