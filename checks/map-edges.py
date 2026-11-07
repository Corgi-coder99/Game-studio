from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
 for name,w,h,touch in [('desktop',1626,902,False),('wide',926,428,True),('upright',428,926,True),('short',812,320,True)]:
  context=browser.new_context(viewport={'width':w,'height':h},is_mobile=touch,has_touch=touch);page=context.new_page();errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
  page.add_init_script('''(()=>{const draw=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(image,...a){if(this.canvas.id==='world-map'&&image instanceof HTMLImageElement&&image.src.includes('living-terrain-pixel.png')){const m=this.getTransform();window.terrainRect={left:a[4]*m.a+m.e,top:a[5]*m.d+m.f,right:(a[4]+a[6])*m.a+m.e,bottom:(a[5]+a[7])*m.d+m.f,width:this.canvas.width,height:this.canvas.height,scale:m.a};}return draw.call(this,image,...a);};})()''')
  page.goto('http://127.0.0.1:3000');page.locator('[data-confirm-realm]').click();page.wait_for_timeout(1200)
  def covered():
   assert page.evaluate('terrainRect.left<=.01&&terrainRect.top<=.01&&terrainRect.right>=terrainRect.width-.01&&terrainRect.bottom>=terrainRect.height-.01'),page.evaluate('terrainRect')
  for scene in ['city','region']:
   if scene=='region':page.locator('.game-nav [data-view="region"]').click()
   page.wait_for_timeout(250);covered();page.locator('[data-zoom="-1"]').click();page.wait_for_timeout(150);covered();base=page.evaluate('terrainRect.scale')
   for _ in range(4):page.locator('[data-zoom="1"]').click()
   page.wait_for_timeout(150);assert page.evaluate('terrainRect.scale')>base;covered()
   for start,end in [((.4,.5),(.95,.9)),((.8,.7),(.05,.12)),((.5,.5),(.95,.08))]:
    page.mouse.move(w*start[0],h*start[1]);page.mouse.down();page.mouse.move(w*end[0],h*end[1],steps=15);page.mouse.up();page.wait_for_timeout(80);covered()
   page.screenshot(path='/tmp/map-edges-'+name+'-'+scene+'-zoom.png')
   page.locator('[data-center]').click();page.wait_for_timeout(150);covered();page.screenshot(path='/tmp/map-edges-'+name+'-'+scene+'-overview.png')
  assert not errors,errors
  print(name,'PASS city/region terrain covers every viewport edge through zoom, pan and reset',flush=True);context.close()
 browser.close()
