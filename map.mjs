import {goldenStyle} from './style-palette.mjs';
import {presentGoldenCanvas,goldenCanvasPoint} from './palette-renderer.mjs';
import {feedback} from './feedback.mjs';
import {drawCityTitles} from './titles-ui.mjs';
import {englishCanvasContext} from './english.mjs';
import {drawWeather,drawConnectedGate} from './environment.mjs';
import {citySites,cityGate,cityCameraLayout,regionCameraLayout} from './city-layout.mjs';
import {drawProvinceProp,drawFlyingDragon} from './scene-art.mjs';
import {drawAnimal} from './wildlife.mjs';
import {elementNames} from './elements.mjs';
import {cityLife,drawConstructionAura,drawSkinAura} from './city-life.mjs';
import {drawSkillVfx} from './skill-vfx.mjs';
import {drawWorldSite} from './world-art.mjs';
import {combatPose} from './combat-motion.mjs';
import {cachedImage} from './art-cache.mjs';
import {trainingFor,constructionSeconds} from './city-rules.mjs';
let cachedCityGround=null,cachedGroundTextured=false,cachedCivicTrees=false,cachedGroundPaletteKey='';
import {drawSecretRealm,drawHiddenGates} from './inheritance-map.mjs';
import {activeWorldCity} from './world-data.mjs';
import {drawRegionScene} from './region-map.mjs';
import {castleSkins} from './skins.mjs';
import { drawRealmAtlas } from './realm-map.mjs';
import { structures, worldNodes, skills, troopTypes } from './kingdom.mjs';


export function mountMap(canvas, read, select) {
  const ctx = englishCanvasContext(canvas.getContext('2d',{alpha:false})), camera = { x: 0, y: 0, zoom: ['city','region'].includes(read().view)?1:matchMedia('(pointer:coarse)').matches?1.35:1 }, hits = [];
  const terrainArt=cachedImage('/assets/living-terrain-pixel.png');
  const troopSprite=cachedImage('/assets/troops-walk-pixel.png');
  const cityArt=cachedImage('/assets/city-pixel.png'),fighterArt=cachedImage('/assets/battle-units-pixel.png'),fighterA=cachedImage('/assets/roster-a-pixel.png'),fighterB=cachedImage('/assets/roster-b-pixel.png'),celestialArt=cachedImage('/assets/celestial-pets-pixel.png'),castleArt=cachedImage('/assets/castle-skins-pixel.png'),backdrop=cachedImage('/assets/hulao-pixel.png');
  function localPoint(e){const r=canvas.getBoundingClientRect();return goldenCanvasPoint(canvas,document.documentElement.classList.contains('rotated-game')?{x:(e.clientY-r.top)*canvas.clientWidth/r.height,y:(r.right-e.clientX)*canvas.clientHeight/r.width}:{x:(e.clientX-r.left)*canvas.clientWidth/r.width,y:(e.clientY-r.top)*canvas.clientHeight/r.height});}
  const touchPointers=new Map();let pinch=null;let dragging = null, moved = false, frame, disposed = false, lastFrame = -100;
  let pixelRatio=1;const resize=new ResizeObserver(()=>{pixelRatio=Math.min(2,Math.max(1,(devicePixelRatio||1)*Math.min(innerWidth/1920,innerHeight/1080)));const width=Math.round(canvas.clientWidth*pixelRatio),height=Math.round(canvas.clientHeight*pixelRatio);if(canvas.width!==width||canvas.height!==height){canvas.width=width;canvas.height=height;}});resize.observe(canvas);
  const iso = (x, y) => [(x - y) * 48, (x + y) * 24];
  const noise = (x, y) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
  function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function poly(c, p, color, stroke) { c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(Math.round(x), Math.round(y)) : c.moveTo(Math.round(x), Math.round(y))); c.closePath(); c.fillStyle = color; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function tree(c, x, y, size = 1) {
    c.save(); c.translate(x, y); c.scale(size, size);
    rect(c, -4, -12, 9, 21, '#6B5A44');
    poly(c, [[-24,-8],[-24,-22],[-16,-22],[-16,-40],[-5,-40],[-5,-53],[10,-53],[10,-42],[20,-42],[20,-28],[28,-28],[28,-10],[15,-1],[-12,2]], '#1F5A36');
    poly(c, [[-17,-22],[-17,-35],[-5,-35],[-5,-47],[7,-47],[7,-35],[17,-35],[17,-19],[4,-12]], '#3E8E4A');
    rect(c,-8,-36,11,6,'#7BC25F'); rect(c,7,-26,9,5,'#7BC25F'); c.restore();
  }
  function wall(c, x, y, reverse = false) {
    const dx = reverse ? -48 : 48;
    poly(c, [[x,y-42],[x+dx,y-18],[x+dx,y+20],[x,y-4]], '#6B739E');
    poly(c, [[x,y-42],[x+dx,y-18],[x+dx+9,y-23],[x+9,y-47]], '#8A90A6');
    for(let i=0;i<4;i++) rect(c,x+dx*i/4,y-46+i*6,9,8,'#8A90A6');
    rect(c,x+dx/2,y-13,9,8,'#4B5063');
  }
  function bakeGround(city) {
    const cityBase=cachedImage('/assets/city-foundation-pixel.png');
    const layer = document.createElement('canvas'); layer.width=4096;layer.height=2688; const c=layer.getContext('2d',{alpha:city}); c.translate(2048,640);
    if(!city)rect(c,-2048,-640,4096,2688,'#7BC25F');let grassPattern=null;if(terrainArt.complete&&terrainArt.naturalWidth){const tile=document.createElement('canvas');tile.width=160;tile.height=160;const tc=tile.getContext('2d'),sw=terrainArt.naturalWidth/3;tc.drawImage(terrainArt,sw*.35,terrainArt.naturalHeight*.35,sw*.2,terrainArt.naturalHeight*.2,0,0,160,160);grassPattern=c.createPattern(tile,'repeat');cachedGroundTextured=true;}
    // City terrain is rendered in screen space so its edges never enter the view.
    for(let depth=-32;depth<75;depth++) for(let x=-22;x<45;x++) {
      if(city&&cityBase.complete&&cityBase.naturalWidth)continue;const y=depth-x; if(y < -22 || y>45)continue;
      const [px,py]=iso(x,y), n=noise(x,y), river=city?x>30||y>30:x>21&&y<10;
      const road=city&&(Math.abs(x-12)<1&&y>=4||Math.abs(y-10)<1&&x>=-3&&x<=28||(x===4&&y>=3&&y<=24)||(x===19&&y>=4&&y<=24));
      const plaza=city&&Math.abs(x-12)<=3&&Math.abs(y-5)<=3;
      const color=river?['#4C7BD6','#8A90A6','#8A90A6'][Math.floor(n*3)]:road||plaza?['#D9C79A','#D9C79A','#D9C79A'][Math.floor(n*3)]:grassPattern||['#7BC25F','#7BC25F','#7BC25F','#7BC25F'][Math.floor(n*4)];
      poly(c,[[px,py],[px+48,py+24],[px,py+48],[px-48,py+24]],color);
      if(road||plaza) { c.strokeStyle='#A38B64';c.lineWidth=1;c.beginPath();c.moveTo(px-46,py+24);c.lineTo(px,py+47);c.lineTo(px+46,py+24);c.stroke(); }
      else if(!river&&n>.5) for(let i=0;i<4;i++)rect(c,px-22+i*13,py+12+Math.floor(noise(x+i,y)*19),2,3,n>.8?'#D49A72':'#7BC25F');
      if(river&&n>.65)rect(c,px-12,py+24,21,2,'#C3C8D8');
    }
    if(city) {
      cachedCivicTrees=!!(cityBase.complete&&cityBase.naturalWidth);if(cachedCivicTrees)c.drawImage(cityBase,-1584,-300,3168,1584);else for(let i=-5;i<28;i++){let[x,y]=iso(-5,i);wall(c,x,y,true);[x,y]=iso(i,-5);wall(c,x,y);[x,y]=iso(28,i);wall(c,x,y,true);if(i<9||i>=15){[x,y]=iso(i,28);wall(c,x,y);}}
      if(!cachedCivicTrees)for(const [gx,gy] of [[6,7],[10,7],[6,10],[10,10]]) {const[x,y]=iso(gx,gy);poly(c,[[x-28,y],[x,y-13],[x+28,y],[x,y+13]],'#D9C79A');for(let j=0;j<12;j++)rect(c,x-22+j*4,y-4+(j%3)*3,4,4,j%2?'#D49A72':'#E8BC8A');}
    } else for(let i=0;i<140;i++){const x=-5+noise(i,3)*32,y=-5+noise(i,7)*32;if(worldNodes.some(n=>Math.hypot(x-n.x,y-n.y)<2))continue;const[a,b]=iso(x,y);tree(c,a,b,.8+noise(i,1)*.8);}
    return layer;
  }
  let cityGround=read().view==='city'?(cachedCityGround??=bakeGround(true)):null;
  function building(index,x,y,size) {
    if(!cityArt.complete||!cityArt.naturalWidth)return;
    const sw=cityArt.naturalWidth/3,sh=cityArt.naturalHeight/2;
    const ownSkin=castleSkins.find(c=>c.id===read().state.account?.equipped.city);if(index===0&&ownSkin?.artIndex!==null&&ownSkin?.artIndex!==undefined&&castleArt.complete&&castleArt.naturalWidth){const i=ownSkin.artIndex;ctx.drawImage(castleArt,i%5*castleArt.naturalWidth/5,Math.floor(i/5)*castleArt.naturalHeight/2,castleArt.naturalWidth/5,castleArt.naturalHeight/2,Math.round(x-size/2),Math.round(y-size+34),size,size);return;}ctx.drawImage(cityArt,index%3*sw,Math.floor(index/3)*sh,sw,sh,Math.round(x-size/2),Math.round(y-size+34),size,size);
  }
  function label(x,y,title,level,selected=false,timer=null,progress=0){const unit=1/Math.max(.3,Math.hypot(ctx.getTransform().a,ctx.getTransform().b)/pixelRatio);ctx.font=`600 ${30*unit}px "Mandate Pixel",monospace`;const w=ctx.measureText(title).width+44*unit;rect(ctx,x-w/2,y,w,42*unit,selected?'#1F5A36':'#1B1F3B');ctx.fillStyle='#F6EBD0';ctx.textAlign='center';ctx.fillText(title,x+11*unit,y+30*unit);ctx.fillStyle='#4C7BD6';ctx.beginPath();ctx.arc(x-w/2+12*unit,y+21*unit,15*unit,0,Math.PI*2);ctx.fill();ctx.fillStyle='#E9ECF5';ctx.font=`bold ${24*unit}px "Mandate Pixel",monospace`;ctx.fillText(String(level),x-w/2+12*unit,y+29*unit);if(timer!==null){rect(ctx,x-w/2,y-17*unit,w,12*unit,'#1B1F3B');rect(ctx,x-w/2+unit,y-16*unit,(w-2*unit)*Math.max(0,Math.min(1,progress)),10*unit,'#7BC25F');ctx.font=`${24*unit}px "Mandate Pixel",monospace`;ctx.fillStyle='#E9ECF5';ctx.fillText(timer,x,y-7*unit);}ctx.textAlign='left';}
  function drawDitherShadow(x,y,rx,ry){ctx.save();ctx.fillStyle='#0E1024';for(let yy=-Math.ceil(ry/3);yy<=ry/3;yy++)for(let xx=-Math.ceil(rx/3);xx<=rx/3;xx++)if((xx*3/rx)**2+(yy*3/ry)**2<=1&&(xx+yy)%2===0)ctx.fillRect(Math.round(x+xx*3),Math.round(y+yy*3),3,3);ctx.restore();}
  function soldier(x,y,color,type='shield',phase=0,scale=1,facing=1){if(!troopSprite.complete||!troopSprite.naturalWidth)return;const row=Math.max(0,['shield','spear','bow','cavalry'].indexOf(type)),col=Math.floor(Math.abs(phase)*1.2)%4,sw=troopSprite.naturalWidth/4,sh=troopSprite.naturalHeight/4,size=42*scale;ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(facing,1);ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(0,5,size*.23,size*.08,0,0,Math.PI*2);ctx.fill();ctx.drawImage(troopSprite,col*sw,row*sh,sw,sh,-size/2,-size+10,size,size);ctx.restore();}
  function dragon(x,y,time,element,scale=1){drawFlyingDragon(ctx,element,x,y+Math.sin(time*2)*3,130*scale,time);}

  function spell(x,y,kind,color,progress,span=90){
    ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=4;ctx.globalAlpha=Math.max(0,1-progress*.6);
    if(kind==='swordFlight'){ctx.strokeStyle='#D6E6FF';for(let i=0;i<4;i++){const a=progress*4+i*Math.PI/2;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*span,y+Math.sin(a)*span*.6);ctx.lineTo(x+Math.cos(a)*(span-35),y+Math.sin(a)*(span-35)*.6);ctx.stroke();}}
    else if(kind==='spatialSwap'){ctx.strokeStyle='#C07BFF';for(const sign of [-1,1]){ctx.beginPath();ctx.ellipse(x+sign*span*.5,y,18+progress*25,40+progress*15,0,0,Math.PI*2);ctx.stroke();}}
    else if(kind==='timeRewind'){ctx.strokeStyle='#FFE9A0';ctx.beginPath();ctx.arc(x,y,span*.6,0,Math.PI*2);ctx.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6-progress*4;rect(ctx,x+Math.cos(a)*span*.55,y+Math.sin(a)*span*.55,5,5,'#F6EBD0');}ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(-progress*8)*span*.45,y+Math.sin(-progress*8)*span*.45);ctx.stroke();}
    else if(kind==='echo'){for(let i=-1;i<=1;i++){rect(ctx,x+i*40,y-40,18,34,'#8FB4F2');rect(ctx,x+i*40+4,y-52,10,10,'#E9ECF5');}}
    else if(kind==='attributeDrain'||kind==='soulLink'){ctx.strokeStyle=kind==='soulLink'?'#C3C8D8':'#C07BFF';for(let i=0;i<6;i++){const a=i*Math.PI/3+progress*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*span,y+Math.sin(a)*span*.55);ctx.stroke();}}
    else if(kind==='divineLight'||kind==='divineDark'){const light=kind==='divineLight';ctx.strokeStyle=light?'#FFE9A0':'#C07BFF';ctx.lineWidth=4;for(let ring=0;ring<3;ring++){ctx.beginPath();ctx.ellipse(x,y,span*(.25+progress)+ring*17,span*(.15+progress*.5)+ring*9,progress*(light?1:-1),0,Math.PI*2);ctx.stroke();}for(let i=0;i<12;i++){const a=i*Math.PI/6+progress*4;rect(ctx,x+Math.cos(a)*span*progress,y+Math.sin(a)*span*.5*progress,6,light?18:7,light?'#F6EBD0':'#C07BFF');}}
    else if(kind==='formation'){for(let r=0;r<2;r++){ctx.beginPath();for(let i=0;i<=8;i++){const a=i*Math.PI/4+progress;const p=[x+Math.cos(a)*(span-r*15),y+Math.sin(a)*(span*.5-r*7)];i?ctx.lineTo(...p):ctx.moveTo(...p);}ctx.stroke();}}
    else if(kind==='beam'){ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x-span,y-span);ctx.lineTo(x+span*.4,y+span*.3);ctx.stroke();ctx.strokeStyle='#F6EBD0';ctx.lineWidth=2;ctx.stroke();}
    else if(kind==='spear'){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-span+i*24,y+span*.5);ctx.lineTo(x+span*.5+i*24,y-span*.6);ctx.stroke();}}
    else if(kind==='petal'){for(let i=0;i<18;i++){const a=i*2.4+progress*3;rect(ctx,x+Math.cos(a)*span*progress,y+Math.sin(a)*span*.6*progress,6,5,color);}}
    else if(kind==='flame'||kind==='dragon'){for(let i=0;i<24;i++){const a=i*2.4;rect(ctx,x+Math.cos(a)*span*progress,y+Math.sin(a)*span*.45*progress-progress*35,5+i%4,11,i%2?color:'#FFE9A0');}}
    else if(kind==='monkey'){for(let i=0;i<3;i++){const dx=x+(i-1)*48;rect(ctx,dx,y-60-progress*20,6,72,color);rect(ctx,dx-7,y-32,20,25,'#D08F55');}}
    else{ctx.beginPath();ctx.ellipse(x,y,20+progress*span,10+progress*span*.5,kind==='crescent'?-.5:0,0,kind==='crescent'?Math.PI*1.6:Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=1;
  }
  const seen=new Map(), hpBefore=new Map(), floaters=[];
  function siegeCastles(state,b,time,w,h){
    const skin=castleSkins.find(c=>c.id===state.account.equipped.city),size=Math.min(310,w*.24),locations=[{x:w*.16,side:'ally',index:skin?.artIndex??null,units:b.allies},{x:w*.84,side:'enemy',index:1,units:b.enemies}];
    for(const fort of locations){const img=fort.index!==null&&castleArt.complete&&castleArt.naturalWidth?castleArt:cityArt,index=img===castleArt?fort.index:0;if(img.complete&&img.naturalWidth){ctx.drawImage(img,index%(img===castleArt?5:3)*img.naturalWidth/(img===castleArt?5:3),Math.floor(index/(img===castleArt?5:3))*img.naturalHeight/2,img.naturalWidth/(img===castleArt?5:3),img.naturalHeight/2,fort.x-size/2,h*.4-size*.7,size,size);}const max=fort.units.reduce((n,u)=>n+u.maxHp,0),hp=fort.units.reduce((n,u)=>n+u.hp,0);rect(ctx,fort.x-size*.4,h*.4-size*.75,size*.8,9,'#2B3055');rect(ctx,fort.x-size*.4,h*.4-size*.75,size*.8*hp/max,9,fort.side==='ally'?'#3E8E4A':'#B3262E');ctx.textAlign='center';ctx.font='bold '+Math.max(9,Math.min(13,w*.01))+'px "Mandate Pixel",monospace';ctx.fillStyle='#FFE9A0';ctx.fillText(fort.side==='ally'?'THÀNH QUÂN VƯƠNG':'THÀNH BOT',fort.x,h*.4+size*.32);}
    for(let n=0;n<5;n++){const t=(time*.5+n*.2)%1,x=w*(.2+t*.6),y=h*.45-Math.sin(t*Math.PI)*h*.15;rect(ctx,x,y,8,3,n%2?'#FFE9A0':'#D6E6FF');}ctx.textAlign='left';
  }
  function battleScene(state,time,w,h){
    if(!state.battle)return;const b=state.battle;
    if(['bot','hunt'].includes(b.mode)&&terrainArt.complete&&terrainArt.naturalWidth){ctx.drawImage(terrainArt,0,terrainArt.naturalHeight*.15,terrainArt.naturalWidth/3,terrainArt.naturalHeight*.7,0,0,w,h);}else if(backdrop.complete&&backdrop.naturalWidth){const r=Math.max(w/backdrop.naturalWidth,h/backdrop.naturalHeight);ctx.drawImage(backdrop,(w-backdrop.naturalWidth*r)/2,(h-backdrop.naturalHeight*r)/2,backdrop.naturalWidth*r,backdrop.naturalHeight*r);}else rect(ctx,0,0,w,h,'#A38B64');
    rect(ctx,0,0,w,h,'#1B1F3B');poly(ctx,[[0,h*.45],[w*.5,h*.30],[w,h*.45],[w,h],[0,h]],'#A38B64');

    const position=u=>{const row=Math.floor(u.slot/3),col=u.slot%3;return{x:w*(u.side==='ally'?[.4,.25,.1][row]:[.6,.75,.9][row]),y:h*(.32+col*.15)};};
    for(const side of ['ally','enemy'])for(let slot=0;slot<9;slot++){const p=position({side,slot}),r=Math.min(55,w*.035);poly(ctx,[[p.x-r,p.y+12],[p.x,p.y-r*.35],[p.x+r,p.y+12],[p.x,p.y+r*.6]],side==='ally'?'#C3C8D8':'#F0C8A0');}
    const fighters=[...b.allies,...b.enemies];canvas.feedbackPositions=Object.fromEntries(fighters.map(u=>[u.key,{...position(u),y:position(u).y-70}]));
    for(const e of b.events){if(!seen.has(e.serial))seen.set(e.serial,time);}
    if(seen.size>250)for(const [id,t]of seen)if(time-t>4)seen.delete(id);
    if(b.turn){const u=fighters.find(u=>u.key===b.turn.key);if(u){const p=position(u);ctx.strokeStyle='#FFE9A0';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p.x,p.y+18,62,23,0,0,7);ctx.stroke();ctx.fillStyle='#F6EBD0';ctx.textAlign='center';ctx.font='400 27px "Mandate Pixel",monospace';ctx.fillText('LƯỢT TIẾP THEO',p.x,p.y-125);}}
    for(const u of [...fighters].sort((a,b)=>position(a).y-position(b).y)){
      const hitVisual=feedback.hitState(u.key),p=position(u);p.x+=(u.side==='ally'?-1:1)*hitVisual.knock;const side=u.side==='ally'?1:-1, type=u.side==='ally'?b.troopType:b.enemyTroopType, tint=u.side==='ally'?'#8FB4F2':'#D49A72';
      const count=Math.ceil(u.hp/u.maxHp*9);
      for(let i=0;i<count;i++)soldier(p.x-side*(30+Math.floor(i/3)*18),p.y+16+(i%3)*14,tint,type,time*5+i,Math.min(1.5,w/1000),side);
      const cast=b.events.findLast(e=>e.actor===u.id&&e.side===u.side&&e.kind!=='attack'&&b.clock-e.at<1.1&&time-(seen.get(e.serial)||0)<1.05)||b.events.findLast(e=>e.actor===u.id&&e.side===u.side&&e.kind==='attack'&&b.clock-e.at<.7&&time-(seen.get(e.serial)||0)<.65), age=cast?time-seen.get(cast.serial):99;
      const impact=b.events.findLast(e=>e.side!==u.side&&e.targets?.includes(u.key)&&time-(seen.get(e.serial)||0)<.45),ranged=skills[u.id]?.role.includes('Pháp sư')||skills[u.id]?.role.includes('Cung thủ')||skills[u.id]?.role.includes('mage')||skills[u.id]?.role.includes('archer')||skills[u.id]?.role.includes('support'),pose=combatPose(cast?.kind,age,side,ranged,impact?time-seen.get(impact.serial):99),lunge=pose.x;
      const size=Math.min(160,Math.max(100,w*.09))*(u.isBoss?1.4:1);
      if(u.hp<=0)ctx.globalAlpha=.3;
      drawDitherShadow(p.x+lunge,p.y+17,size*.37,size*.13);
      if(u.beastKind){drawAnimal(ctx,u.beastKind,p.x+lunge,p.y+12,size*1.2,time,u.side==='ally'?1:-1);}else{const globalIndex=Object.keys(skills).indexOf(u.id),art=globalIndex<8?fighterArt:globalIndex<32?fighterA:globalIndex<56?fighterB:celestialArt,cols=globalIndex>=56?5:globalIndex<8?4:6,rows=globalIndex>=56?2:globalIndex<8?2:4,index=globalIndex>=56?globalIndex-56:globalIndex<8?globalIndex:(globalIndex-8)%24;if(art.complete&&art.naturalWidth){const sw=art.naturalWidth/cols,sh=art.naturalHeight/rows;ctx.save();ctx.translate(p.x+lunge,p.y-size*.55+pose.y+Math.sin(time*2)*2);ctx.rotate(pose.angle);ctx.scale(side,1);if(hitVisual.flash)ctx.filter='brightness(3)';ctx.drawImage(art,index%cols*sw,Math.floor(index/cols)*sh,sw,sh,-size/2,-size/2,size,size);ctx.filter='none';ctx.restore();}}
      ctx.globalAlpha=1;
      if(cast&&age<.75&&u.hp>0){const t=age/.75,alpha=Math.sin(t*Math.PI);ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=goldenStyle.elements[u.element]||'#C3C8D8';ctx.lineWidth=ranged?3:8;ctx.lineCap='round';ctx.beginPath();if(ranged)ctx.ellipse(p.x+pose.x,p.y-65,35+t*30,20+t*18,-t,0,Math.PI*2);else ctx.arc(p.x+side*30,p.y-55,65,-1.8+t*1.4,1+t*1.4);ctx.stroke();ctx.restore();}
      if(u.stun>0){for(let j=0;j<3;j++){const a=time*4+j*Math.PI*2/3;ctx.fillStyle='#F2C14E';ctx.fillRect(p.x+Math.cos(a)*28-3,p.y-size+Math.sin(a)*8,7,7);}}
      const width=Math.min(108,size);rect(ctx,p.x-width/2,p.y+28,width,8,'#0E1024');rect(ctx,p.x-width/2+1,p.y+29,(width-2)*u.hp/u.maxHp,6,u.side==='ally'?'#3E8E4A':'#B3262E');
      if(u.immune>0||u.invincible>0){ctx.strokeStyle=u.invincible>0?'#FFE9A0':'#8FB4F2';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p.x,p.y-30,size*.49,size*.62,0,0,Math.PI*2);ctx.stroke();}
      if(u.shield){ctx.strokeStyle='#8FB4F2';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y-30,size*.43,size*.57,0,0,Math.PI*2);ctx.stroke();}
      ctx.font=`400 30px "Mandate Pixel",monospace`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#12301F';ctx.strokeText(u.name,p.x,p.y+51);ctx.fillStyle='#F6EBD0';ctx.fillText(u.name,p.x,p.y+51);ctx.textAlign='left';
      rect(ctx,p.x-width/2,p.y+38,width,3,'#1F5A36');rect(ctx,p.x-width/2,p.y+38,width*u.energy/100,3,u.resource==='mana'?'#8FB4F2':'#F2C14E');const status=(u.stun?'★ ':'')+(u.slow?'↓ ':'')+(u.manaLock?'M↓ ':'')+(u.immune>0?'⛨ ':'')+(u.invincible>0?'✧ ':'')+(u.revived?'↻':'');ctx.font='10px "Mandate Pixel",monospace';ctx.fillStyle='#F6EBD0';ctx.textAlign='center';ctx.fillText(status,p.x,p.y+66);ctx.textAlign='left';
      if(u.burn)spell(p.x,p.y-20,'flame','#FF9B54',(time%1)*.6,40);
    }
    for(const e of b.events){const age=time-(seen.get(e.serial)||0);if(age>1.65||age<0||b.clock-e.at>3)continue;const actor=fighters.find(u=>u.id===e.actor&&u.side===e.side);const ap=actor?position(actor):{x:w*.5,y:h*.3};
      if(e.skillId){drawSkillVfx(ctx,e,age,ap,fighters.filter(u=>e.targets?.includes(u.key)).map(position),w,h);continue;}
      drawSkillVfx(ctx,e.kind==='attack'?{...e,skillId:'strike-'+e.actor,skillName:'Trảm',kind:'slash'}:e,age,ap,fighters.filter(u=>e.targets?.includes(u.key)).map(position),w,h);
    }
    const orbit=time*.6,dx=w*(.26+Math.cos(orbit)*.14),dy=h*(.19+Math.sin(orbit)*.025);ctx.save();ctx.globalAlpha=.78;ctx.translate(dx,dy);ctx.rotate(Math.sin(orbit)*.12);dragon(0,0,time,b.dragon||state.dragon,.7);ctx.restore();if(b.dragonEnergy<12){ctx.strokeStyle='#D6E6FF';ctx.lineWidth=3;for(const u of b.allies.filter(u=>u.hp>0)){const p=position(u);ctx.beginPath();ctx.ellipse(p.x,p.y+12,50,20,0,0,7);ctx.stroke();}}
  }
  function transform(w,h,city){if(city){const layout=cityCameraLayout(w,h,camera,matchMedia('(pointer:coarse)').matches);camera.x=layout.x;camera.y=layout.y;camera.zoom=layout.zoom;return layout;}const view=read().view;if(view==='region'){const layout=regionCameraLayout(w,h,camera);camera.x=layout.x;camera.y=layout.y;camera.zoom=layout.zoom;return layout;}const fit=city?Math.min((w-220)/3100,(h-210)/1750):view==='region'?Math.min((w-320)/1550,(h-250)/1100):Math.min((w-240)/1060,(h-230)/800);const z=fit*camera.zoom;const mx=city?0:view==='world'?-10:0,my=city?570:view==='world'?470:370;const maxX=Math.max(80,(1700*z-(w-300))/2+80),maxY=Math.max(60,(1000*z-(h-250))/2+60);camera.x=Math.max(-maxX,Math.min(maxX,camera.x));camera.y=Math.max(-maxY,Math.min(maxY,camera.y));return{z,ox:w/2-mx*z+camera.x,oy:h/2+35-my*z+camera.y};}
  function setMapZoom(value,anchor=null){const w=canvas.clientWidth,h=canvas.clientHeight,city=read().view==='city',bounded=['city','region'].includes(read().view),before=transform(w,h,city);camera.zoom=Math.max(bounded?1:.6,Math.min(bounded?3:2.6,value));if(anchor){const worldX=(anchor.x-before.ox)/before.z,worldY=(anchor.y-before.oy)/before.z,after=transform(w,h,city);camera.x+=anchor.x-(worldX*after.z+after.ox);camera.y+=anchor.y-(worldY*after.z+after.oy);}transform(w,h,city);}
  function draw(ms){if(disposed)return;if(read().view==='combat'&&feedback.isHitStopped()){frame=requestAnimationFrame(draw);return;}if(ms-lastFrame<(read().view==='combat'?16:33)){frame=requestAnimationFrame(draw);return;}lastFrame=ms;const{state,view,selected,motionDelta=0}=read(),time=ms/1000,w=canvas.clientWidth,h=canvas.clientHeight,city=view==='city';ctx.setTransform(pixelRatio,0,0,pixelRatio,0,0);ctx.imageSmoothingEnabled=false;hits.length=0;
    if(view==='combat'){battleScene(state,time,w,h);presentGoldenCanvas(canvas,ctx);frame=requestAnimationFrame(draw);return;}
    if(view==='region'){rect(ctx,0,0,w,h,'#6B739E');const{z,ox,oy}=transform(w,h,false);ctx.save();ctx.translate(ox,oy);ctx.scale(z,z);if(state.inheritance.activeRealm)hits.push(...drawSecretRealm(ctx,state,time,{fighterArt,fighterA,fighterB}));else{hits.push(...drawRegionScene(ctx,state,time,cityArt,castleArt,z,motionDelta));hits.push(...drawHiddenGates(ctx,state,time,activeWorldCity(state)));}ctx.restore();drawWeather(ctx,w,h,time);presentGoldenCanvas(canvas,ctx);frame=requestAnimationFrame(draw);return;}
    if(view==='world'){rect(ctx,0,0,w,h,'#2B3055');const{z,ox,oy}=transform(w,h,false);ctx.save();ctx.translate(ox,oy);ctx.scale(z,z);hits.push(...drawRealmAtlas(ctx,state,time));ctx.restore();presentGoldenCanvas(canvas,ctx);frame=requestAnimationFrame(draw);return;}
    const foundation=cachedImage('/assets/city-foundation-pixel.png'),groundKey=terrainArt.src+'|'+foundation.src;if(city&&terrainArt.complete&&terrainArt.naturalWidth&&(!cachedGroundTextured||!cachedCivicTrees&&foundation.complete||cachedGroundPaletteKey!==groundKey)){cityGround=cachedCityGround=bakeGround(true);cachedGroundPaletteKey=groundKey;}rect(ctx,0,0,w,h,city?'#7BC25F':'#7BC25F');const layout=transform(w,h,city),{z,ox,oy}=layout;ctx.save();ctx.translate(ox,oy);ctx.scale(z,z);if(city&&terrainArt.complete&&terrainArt.naturalWidth){const t=layout.terrain;ctx.drawImage(terrainArt,0,0,terrainArt.naturalWidth/3,terrainArt.naturalHeight,t.x,t.y,t.width,t.height);}ctx.drawImage(cityGround,-2048,-640);
    if(city){cityLife(ctx,iso,time,state,'ground');
      // Houses and civic ornaments make the scene a continuous inhabited city.
      if(!cachedCivicTrees)for(const [x,y]of [[1,6],[1,9],[23,8],[23,18],[8,19],[26,7],[16,0]]){const[a,b]=iso(x,y);building(2,a,b,105);}
      const[fx,fy]=iso(9,9);poly(ctx,[[fx-65,fy],[fx,fy-30],[fx+65,fy],[fx,fy+30]],'#D9C79A');ctx.fillStyle='#8A90A6';ctx.beginPath();ctx.ellipse(fx,fy-2,36,16,0,0,Math.PI*2);ctx.fill();rect(ctx,fx-5,fy-35,10,34,'#F0C8A0');for(let i=0;i<4;i++)rect(ctx,fx-24+i*15,fy-5+Math.sin(time*2+i)*3,7,2,'#F6EBD0');
      for(const b of [...citySites].sort((a,b)=>a.x+a.y-b.x-b.y)){const[x,y]=iso(b.x,b.y);const selectedHere=selected===b.id&&(b.id!=='barracks'||read().trainingType===b.type);if(selectedHere){ctx.strokeStyle='#C4EE8F';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y+6,b.size*.42,b.size*.2,0,0,Math.PI*2);ctx.stroke();}if(b.id==='hall')drawCityTitles(ctx,state,x,y-b.size+20,camera.zoom);if(b.id==='hall')drawSkinAura(ctx,castleSkins.find(c=>c.id===state.account.equipped.city)?.artIndex||0,x,y,b.size,time);if(b.id==='auction'){cityLife(ctx,iso,time,state,'market');}else if(b.id==='infirmary')drawProvinceProp(ctx,3,x,y,b.size);else if(b.id==='tower')drawWorldSite(ctx,'tower',x,y,b.size);else building(structures.findIndex(s=>s.id===b.id),x,y,b.size);
        if(state.construction?.id===b.id)drawConstructionAura(ctx,x,y,b.size,time);if(state.cityCelebration?.id===b.id&&Date.now()-state.cityCelebration.at<4000)drawConstructionAura(ctx,x,y,b.size,(Date.now()-state.cityCelebration.at)/1000,true);
        if(b.type){const color=troopTypes[b.type].color;rect(ctx,x+b.size*.27,y-b.size*.55,3,65,'#D49A72');poly(ctx,[[x+b.size*.27+3,y-b.size*.55],[x+b.size*.27+37,y-b.size*.55+9],[x+b.size*.27+3,y-b.size*.55+25]],color);for(let i=0;i<5;i++)soldier(x-35+i*16,y+8,color,b.type,time*4+i,.9);}
        hits.push({id:b.id,type:b.type,x:x-b.size/2,y:y-b.size*(b.id==='tower'?1.7:1)+34,w:b.size,h:b.size*(b.id==='tower'?1.7:1)+24});}
      for(const b of citySites){const[x,y]=iso(b.x,b.y),job=state.construction?.id===b.id?state.construction:b.id==='barracks'?trainingFor(state,b.type):null;const timer=job?`${Math.max(0,Math.ceil((job.endsAt-Date.now())/1000))}s`:null;const duration=job?.amount?Math.max(4000,14000-state.levels.barracks*2000):constructionSeconds(state.levels[b.id])*1000;const progress=job?1-(job.endsAt-Date.now())/duration:0;label(x,y+32,b.type?`Doanh trại ${troopTypes[b.type].name.replace(' binh','')}`:(b.id==='tower'?'Tháp Luyện Ngục · 999 tầng':(b.id==='auction'?'Vạn Bảo Lâu':structures.find(s=>s.id===b.id).name)),b.id==='tower'?state.campaign.unlocked:(b.id==='auction'?1:state.levels[b.id]),selected===b.id&&(!b.type||read().trainingType===b.type),timer,progress);}
      const[gx,gy]=iso(cityGate.x,cityGate.y);if(!cachedCivicTrees)drawConnectedGate(ctx,iso,cityGate.x,cityGate.y,time);hits.push({id:'city-gate',x:gx-cityGate.size/2,y:gy-cityGate.size+12,w:cityGate.size,h:cityGate.size});cityLife(ctx,iso,time,state,'air');for(let i=0;i<20;i++){const p=(time*.22+i*1.3)%15,[x,y]=iso(i%2?8:p+1,i%2?p+2:9);soldier(x,y+11,i%3?'#8A90A6':'#D49A72','spear',time*6+i,.65,i%2?1:-1);}
    }else{
      for(const n of [...worldNodes].sort((a,b)=>a.x+a.y-b.x-b.y)){const[x,y]=iso(n.x,n.y);if(n.type==='home')building(0,x,y,270);else if(n.type==='camp'){poly(ctx,[[x-75,y+12],[x,y-110],[x+75,y+12]],'#9C6A4E','#E8BC8A');poly(ctx,[[x,y-110],[x+75,y+12],[x+20,y+12]],'#6B5A44');rect(ctx,x-12,y-23,25,36,'#3A2F26');for(let i=0;i<4;i++)soldier(x-45+i*26,y+14,'#D49A72','spear',time*4+i,1.2,-1);}else building(n.type==='food'?1:n.type==='wood'?2:3,x,y,210);label(x,y+37,n.name,n.level,selected===n.id);hits.push({id:n.id,x:x-105,y:y-195,w:210,h:260});}
      if(state.march){const m=state.march,n=worldNodes.find(n=>n.id===m.nodeId),[hx,hy]=iso(10,10),[nx,ny]=iso(n.x,n.y),progress=Math.min(1,m.progress/m.duration),r=m.stage==='marching'?progress:m.stage==='returning'?1-progress:1,x=hx+(nx-hx)*r,y=hy+(ny-hy)*r;ctx.strokeStyle='#F0C8A0';ctx.lineWidth=3;ctx.setLineDash([8,12]);ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(nx,ny);ctx.stroke();ctx.setLineDash([]);for(let i=0;i<12;i++)soldier(x+Math.floor(i/4)*18,y+(i%4)*12,'#8FB4F2',m.type||'shield',time*6+i,1.1,m.stage==='returning'?-1:1);label(x,y-60,m.stage==='combat'?'ĐANG GIAO CHIẾN':m.stage==='gathering'?'ĐANG THU THẬP':m.stage==='returning'?'ĐANG TRỞ VỀ':'ĐANG HÀNH QUÂN',1,true);}
    }
    ctx.restore();if(city&&state.account?.equipped.city!=='city-default'){const skin=state.account?.equipped.city;ctx.save();ctx.globalAlpha=.12;ctx.fillStyle=skin==='city-gold'?'#F2C14E':skin==='city-celestial'?'#C07BFF':'#4C7BD6';ctx.fillRect(0,0,w,h);ctx.globalAlpha=.7;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=6;ctx.strokeRect(3,3,w-6,h-6);ctx.restore();}if(city)drawWeather(ctx,w,h,time);presentGoldenCanvas(canvas,ctx);frame=requestAnimationFrame(draw);
  }
  canvas.addEventListener('pointerdown',e=>{if(read().view==='combat')return;e.preventDefault();canvas.setPointerCapture(e.pointerId);touchPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(touchPointers.size===2){const[a,b]=[...touchPointers.values()];pinch={distance:Math.hypot(a.x-b.x,a.y-b.y),zoom:camera.zoom};moved=true;return;}dragging={...localPoint(e),cx:camera.x,cy:camera.y};moved=false;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(touchPointers.has(e.pointerId))touchPointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pinch&&touchPointers.size===2){const[a,b]=[...touchPointers.values()];setMapZoom(pinch.zoom*Math.hypot(a.x-b.x,a.y-b.y)/Math.max(1,pinch.distance));return;}if(!dragging)return;const point=localPoint(e),dx=point.x-dragging.x,dy=point.y-dragging.y;if(Math.abs(dx)+Math.abs(dy)>5)moved=true;camera.x=dragging.cx+dx;camera.y=dragging.cy+dy;});
  canvas.addEventListener('pointercancel',e=>{touchPointers.delete(e.pointerId);pinch=null;dragging=null;moved=true;});
  canvas.addEventListener('pointerup',e=>{touchPointers.delete(e.pointerId);if(pinch){pinch=null;dragging=null;return;}if(!moved&&dragging){const point=localPoint(e),{z,ox,oy}=transform(canvas.clientWidth,canvas.clientHeight,read().view==='city'),x=(point.x-ox)/z,y=(point.y-oy)/z;const hit=[...hits].reverse().find(p=>x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h);if(hit)select(hit.id,hit.type);else if(read().view==='world'){const ax=Math.round(x+520),ay=Math.round(y-75);if(ax>=150&&ax<=950&&ay>=100&&ay<=650)select(ax+','+ay,'coordinate');}}dragging=null;});
  canvas.addEventListener('wheel',e=>{e.preventDefault();setMapZoom(camera.zoom-e.deltaY*.001,localPoint(e));},{passive:false});frame=requestAnimationFrame(draw);
  return{reset(){camera.x=0;camera.y=0;camera.zoom=['city','region'].includes(read().view)?1:matchMedia('(pointer:coarse)').matches?1.35:1;},zoom(d){setMapZoom(camera.zoom+d);},focus(id,type){if(read().view==='city')return;const b=citySites.find(s=>s.id===id&&(!type||s.type===type));if(!b)return;const[x,y]=iso(b.x,b.y),{z}=transform(canvas.clientWidth,canvas.clientHeight,true);camera.x=(40-x)*z-180;camera.y=(420-y+80)*z;},dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();}};
}
