from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for name,w,h,touch in [('desktop',1626,902,False),('phone-wide',926,428,True),('phone-upright',428,926,True),('small-phone',375,667,True)]:
  c=b.new_context(viewport={'width':w,'height':h},is_mobile=touch,has_touch=touch);page=c.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script('''(()=>{const draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(image,...args){if(this.canvas.id==='world-map'&&image instanceof HTMLCanvasElement)window.cityMatrix=Array.from([this.getTransform().a,this.getTransform().d,this.getTransform().e,this.getTransform().f]);return draw.call(this,image,...args);};})()''')
  page.goto('http://127.0.0.1:3000');page.locator('[data-confirm-realm]').click();page.wait_for_timeout(3500)
  if touch:
   page.evaluate('window.originalMap=document.querySelector("canvas")');page.set_viewport_size({'width':w,'height':h-20});page.wait_for_timeout(250);page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(250);assert page.evaluate('window.originalMap===document.querySelector("canvas")')
  dims=page.locator('#app').evaluate('e=>({w:e.clientWidth,h:e.clientHeight,rect:e.getBoundingClientRect().toJSON(),rotated:document.documentElement.classList.contains("rotated-game")})');assert dims['w']>dims['h'];assert abs(dims['rect']['width']-(w if touch else min(w,h*1920/1080)))<2;assert abs(dims['rect']['height']-h)<2 if touch else True
  before=page.evaluate('cityMatrix');page.mouse.move(w*.5,h*.5);page.mouse.down();page.mouse.move(w*.8,h*.65,steps=15);page.mouse.up();page.mouse.wheel(0,5000);page.wait_for_timeout(300);assert before==page.evaluate('cityMatrix'),(before,page.evaluate('cityMatrix'))
  page.locator('[data-zoom="1"]').click();page.locator('[data-zoom="1"]').click();page.wait_for_timeout(200);assert page.evaluate('cityMatrix[0]')>before[0]
  page.locator('[data-center]').click();page.wait_for_timeout(200);assert page.evaluate('cityMatrix')==before
  if touch:
   rect=page.locator('#world-map').bounding_box();cx=rect['x']+rect['width']*.5;cy=rect['y']+rect['height']*.55
   session=c.new_cdp_session(page)
   session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':cx-25,'y':cy,'id':1},{'x':cx+25,'y':cy,'id':2}]})
   session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':cx-55,'y':cy,'id':1},{'x':cx+55,'y':cy,'id':2}]})
   session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(200);assert page.evaluate('cityMatrix[0]')>before[0];assert page.evaluate('visualViewport.scale')==1
   page.locator('[data-center]').click();page.wait_for_timeout(200)
  page.screenshot(path='/tmp/fixed-'+name+'.png')
  point=page.evaluate("""()=>{const canvas=document.querySelector('#world-map'),r=canvas.getBoundingClientRect(),m=cityMatrix,ratio=canvas.width/canvas.clientWidth,x=(768*m[0]+m[2])/ratio,y=(564*m[1]+m[3])/ratio;return document.documentElement.classList.contains('rotated-game')?{x:r.right-y*r.width/canvas.clientHeight,y:r.top+x*r.height/canvas.clientWidth}:{x:r.left+x*r.width/canvas.clientWidth,y:r.top+y*r.height/canvas.clientHeight};}""")
  page.mouse.click(point['x'],point['y']);page.wait_for_timeout(300);assert page.locator('.long-card').count()==7;page.screenshot(path='/tmp/fixed-'+name+'-longs.png');assert not errors,errors
  print(name,'PASS bounded overview, zoom/reset/pinch, landscape bounds and map selection',flush=True);c.close()
 b.close()
