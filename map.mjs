import {drawSecretRealm,drawHiddenGates} from './inheritance-map.mjs';
import {activeWorldCity} from './world-data.mjs';
import {drawRegionScene} from './region-map.mjs';
import {castleSkins} from './skins.mjs';
import { drawRealmAtlas } from './realm-map.mjs';
import { structures, worldNodes, skills, troopTypes } from './kingdom.mjs';

export const citySites = [
  { id: 'hall', x: 8, y: 5, size: 300 },
  { id: 'barracks', type: 'shield', x: 3, y: 6, size: 235 },
  { id: 'barracks', type: 'spear', x: 3, y: 11, size: 235 },
  { id: 'barracks', type: 'bow', x: 8, y: 13, size: 235 },
  { id: 'barracks', type: 'cavalry', x: 13, y: 13, size: 235 },
  { id: 'farm', x: 0, y: 15, size: 230 },
  { id: 'wood', x: 18, y: 12, size: 230 },
  { id: 'stone', x: 17, y: 3, size: 230 },
  { id: 'dragon', x: 13, y: 5, size: 250 },
];
export function mountMap(canvas, read, select) {
  const ctx = canvas.getContext('2d',{alpha:false}), camera = { x: 0, y: 0, zoom: 1 }, hits = [];
  const dragonSprite=new Image();dragonSprite.src='/assets/elemental-dragons-pixel.png';
  const cityArt=new Image(),fighterArt=new Image(),fighterA=new Image(),fighterB=new Image(),celestialArt=new Image(),castleArt=new Image(),backdrop=new Image();
  castleArt.src='/assets/castle-skins-pixel.png';celestialArt.src='/assets/celestial-pets-pixel.png';fighterA.src='/assets/roster-a-pixel.png';fighterB.src='/assets/roster-b-pixel.png';cityArt.src = '/assets/city-pixel.png'; fighterArt.src = '/assets/battle-units-pixel.png'; backdrop.src = '/assets/hulao-pixel.png';
  let dragging = null, moved = false, frame, disposed = false, lastFrame = -100;
  const resize = new ResizeObserver(() => { canvas.width = Math.round(canvas.clientWidth); canvas.height = Math.round(canvas.clientHeight); }); resize.observe(canvas);
  const iso = (x, y) => [(x - y) * 48, (x + y) * 24];
  const noise = (x, y) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1;
  function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); }
  function poly(c, p, color, stroke) { c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(Math.round(x), Math.round(y)) : c.moveTo(Math.round(x), Math.round(y))); c.closePath(); c.fillStyle = color; c.fill(); if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } }
  function tree(c, x, y, size = 1) {
    c.save(); c.translate(x, y); c.scale(size, size);
    rect(c, -4, -12, 9, 21, '#806743');
    poly(c, [[-24,-8],[-24,-22],[-16,-22],[-16,-40],[-5,-40],[-5,-53],[10,-53],[10,-42],[20,-42],[20,-28],[28,-28],[28,-10],[15,-1],[-12,2]], '#376b42');
    poly(c, [[-17,-22],[-17,-35],[-5,-35],[-5,-47],[7,-47],[7,-35],[17,-35],[17,-19],[4,-12]], '#5b9652');
    rect(c,-8,-36,11,6,'#82b668'); rect(c,7,-26,9,5,'#73a85a'); c.restore();
  }
  function wall(c, x, y, reverse = false) {
    const dx = reverse ? -48 : 48;
    poly(c, [[x,y-42],[x+dx,y-18],[x+dx,y+20],[x,y-4]], '#a7a797');
    poly(c, [[x,y-42],[x+dx,y-18],[x+dx+9,y-23],[x+9,y-47]], '#d1d0b3');
    for(let i=0;i<4;i++) rect(c,x+dx*i/4,y-46+i*6,9,8,'#d2ceb0');
    rect(c,x+dx/2,y-13,9,8,'#8a928a');
  }
  function bakeGround(city) {
    const layer = document.createElement('canvas'); layer.width=4096;layer.height=2688; const c=layer.getContext('2d',{alpha:false}); c.translate(2048,640);
    rect(c,-2048,-640,4096,2688,city?'#7e9b57':'#6c9655');
    for(let depth=-32;depth<75;depth++) for(let x=-22;x<45;x++) {
      const y=depth-x; if(y < -22 || y>45)continue;
      const [px,py]=iso(x,y), n=noise(x,y), river=city?x>24||y>26:x>21&&y<10;
      const road=city&&(Math.abs(x-8)<1||Math.abs(y-9)<1||(x===3&&y>=3&&y<=15)||(x===13&&y>=4&&y<=15));
      const plaza=city&&Math.abs(x-8)<=2&&Math.abs(y-5)<=2;
      const color=river?['#55a8ba','#5db2bf','#6cb6be'][Math.floor(n*3)]:road||plaza?['#c7bc90','#d0c69e','#c4b88b'][Math.floor(n*3)]:['#839f5b','#8ba55f','#7e9b57','#91a966'][Math.floor(n*4)];
      poly(c,[[px,py],[px+48,py+24],[px,py+48],[px-48,py+24]],color);
      if(road||plaza) { c.strokeStyle='#8b8a6744';c.lineWidth=1;c.beginPath();c.moveTo(px-46,py+24);c.lineTo(px,py+47);c.lineTo(px+46,py+24);c.stroke(); }
      else if(!river&&n>.5) for(let i=0;i<4;i++)rect(c,px-22+i*13,py+12+Math.floor(noise(x+i,y)*19),2,3,n>.8?'#b2bd7c':'#72934e');
      if(river&&n>.65)rect(c,px-12,py+24,21,2,'#9cd5cb');
    }
    if(city) {
      for(let i=-3;i<23;i++){const[x,y]=iso(-2,i);wall(c,x,y);const[a,b]=iso(i,-2);wall(c,a,b,true);}
      for(let i=0;i<130;i++){const x=-9+noise(i,3)*39,y=-7+noise(i,7)*39; if(citySites.some(b=>Math.hypot(x-b.x,y-b.y)<2)||Math.abs(x-8)<1.2||Math.abs(y-9)<1.2)continue;const[a,b]=iso(x,y);tree(c,a,b,.75+noise(i,1)*.6);}
      for(const [gx,gy] of [[6,7],[10,7],[6,10],[10,10]]) {const[x,y]=iso(gx,gy);poly(c,[[x-28,y],[x,y-13],[x+28,y],[x,y+13]],'#bfd2a1');for(let j=0;j<12;j++)rect(c,x-22+j*4,y-4+(j%3)*3,4,4,j%2?'#dd8fa0':'#e6cc70');}
    } else for(let i=0;i<140;i++){const x=-5+noise(i,3)*32,y=-5+noise(i,7)*32;if(worldNodes.some(n=>Math.hypot(x-n.x,y-n.y)<2))continue;const[a,b]=iso(x,y);tree(c,a,b,.8+noise(i,1)*.8);}
    return layer;
  }
  const cityGround=read().view==='city'?bakeGround(true):null,worldGround=read().view==='world'?bakeGround(false):null;
  function building(index,x,y,size) {
    if(!cityArt.complete||!cityArt.naturalWidth)return;
    const sw=cityArt.naturalWidth/3,sh=cityArt.naturalHeight/2;
    const ownSkin=castleSkins.find(c=>c.id===read().state.account?.equipped.city);if(index===0&&ownSkin?.artIndex!==null&&ownSkin?.artIndex!==undefined&&castleArt.complete&&castleArt.naturalWidth){const i=ownSkin.artIndex;ctx.drawImage(castleArt,i%3*castleArt.naturalWidth/3,Math.floor(i/3)*castleArt.naturalHeight/2,castleArt.naturalWidth/3,castleArt.naturalHeight/2,Math.round(x-size/2),Math.round(y-size+34),size,size);return;}ctx.drawImage(cityArt,index%3*sw,Math.floor(index/3)*sh,sw,sh,Math.round(x-size/2),Math.round(y-size+34),size,size);
  }
  function label(x,y,title,level,selected=false,timer=null,progress=0) {
    ctx.font='600 12px system-ui';const w=ctx.measureText(title).width+38;
    rect(ctx,x-w/2,y,w,24,selected?'#345c43ee':'#29483edb');
    ctx.fillStyle=selected?'#fff2b8':'#f3f0da';ctx.textAlign='center';ctx.fillText(title,x+8,y+16);
    ctx.fillStyle='#6095c5';ctx.beginPath();ctx.arc(x-w/2+8,y+12,11,0,Math.PI*2);ctx.fill();ctx.fillStyle='#fff';ctx.font='bold 10px system-ui';ctx.fillText(String(level),x-w/2+8,y+16);
    if(timer!==null){rect(ctx,x-w/2,y-15,w,10,'#243c35');rect(ctx,x-w/2+1,y-14,(w-2)*Math.max(0,Math.min(1,progress)),8,'#8bb958');ctx.font='8px system-ui';ctx.fillStyle='#fff';ctx.fillText(timer,x,y-7);}
    ctx.textAlign='left';
  }
  function soldier(x,y,color,type='shield',phase=0,scale=1,facing=1) {
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.scale(scale*facing,scale);
    const walk=Math.sin(phase)*2;
    if(type==='cavalry'){poly(ctx,[[-8,3],[-10,-3],[7,-4],[12,0],[8,6],[-7,7]],'#805b3d');rect(ctx,-6,7,2,6+walk,'#4c4433');rect(ctx,6,7,2,6-walk,'#4c4433');}
    else {rect(ctx,-5,4,3,7+walk,'#424c4c');rect(ctx,2,4,3,7-walk,'#424c4c');}
    rect(ctx,-6,-8,12,13,color);rect(ctx,-4,-14,8,7,'#f1cc96');rect(ctx,-5,-17,10,5,'#ccd4c8');rect(ctx,-2,-19,4,3,color);
    if(type==='shield'){rect(ctx,4,-5,8,12,'#b8bcb0');rect(ctx,6,-3,4,8,color);}
    else if(type==='bow'){ctx.strokeStyle='#d5b77f';ctx.lineWidth=2;ctx.beginPath();ctx.arc(10,-4,10,-1.3,1.3);ctx.stroke();}
    else{rect(ctx,10,-25,2,30,'#977e55');poly(ctx,[[8,-24],[11,-31],[14,-24]],'#dce4d8');}
    ctx.restore();
  }
  function dragon(x,y,time,element,scale=1){if(!dragonSprite.complete||!dragonSprite.naturalWidth)return;const index=Math.max(0,['Hỏa','Thủy','Mộc'].indexOf(element)),cell=dragonSprite.naturalWidth/3,height=dragonSprite.naturalHeight,size=130*scale;ctx.drawImage(dragonSprite,index*cell,0,cell,height,Math.round(x-size/2),Math.round(y-size/2+Math.sin(time*2)*5),size,size);}

  function spell(x,y,kind,color,progress,span=90){
    ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=4;ctx.globalAlpha=Math.max(0,1-progress*.6);
    if(kind==='swordFlight'){ctx.strokeStyle='#b4d9ff';for(let i=0;i<4;i++){const a=progress*4+i*Math.PI/2;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*span,y+Math.sin(a)*span*.6);ctx.lineTo(x+Math.cos(a)*(span-35),y+Math.sin(a)*(span-35)*.6);ctx.stroke();}}
    else if(kind==='spatialSwap'){ctx.strokeStyle='#d6a5ff';for(const sign of [-1,1]){ctx.beginPath();ctx.ellipse(x+sign*span*.5,y,18+progress*25,40+progress*15,0,0,Math.PI*2);ctx.stroke();}}
    else if(kind==='timeRewind'){ctx.strokeStyle='#f6dfa1';ctx.beginPath();ctx.arc(x,y,span*.6,0,Math.PI*2);ctx.stroke();for(let i=0;i<12;i++){const a=i*Math.PI/6-progress*4;rect(ctx,x+Math.cos(a)*span*.55,y+Math.sin(a)*span*.55,5,5,'#fff0bd');}ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(-progress*8)*span*.45,y+Math.sin(-progress*8)*span*.45);ctx.stroke();}
    else if(kind==='echo'){for(let i=-1;i<=1;i++){rect(ctx,x+i*40,y-40,18,34,'#aecbff77');rect(ctx,x+i*40+4,y-52,10,10,'#e5e2ff');}}
    else if(kind==='attributeDrain'||kind==='soulLink'){ctx.strokeStyle=kind==='soulLink'?'#9be6bd':'#bd8be8';for(let i=0;i<6;i++){const a=i*Math.PI/3+progress*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*span,y+Math.sin(a)*span*.55);ctx.stroke();}}
    else if(kind==='divineLight'||kind==='divineDark'){const light=kind==='divineLight';ctx.strokeStyle=light?'#fff4b0':'#cb80ff';ctx.lineWidth=4;for(let ring=0;ring<3;ring++){ctx.beginPath();ctx.ellipse(x,y,span*(.25+progress)+ring*17,span*(.15+progress*.5)+ring*9,progress*(light?1:-1),0,Math.PI*2);ctx.stroke();}for(let i=0;i<12;i++){const a=i*Math.PI/6+progress*4;rect(ctx,x+Math.cos(a)*span*progress,y+Math.sin(a)*span*.5*progress,6,light?18:7,light?'#fff7d1':'#9b5bf2');}}
    else if(kind==='formation'){for(let r=0;r<2;r++){ctx.beginPath();for(let i=0;i<=8;i++){const a=i*Math.PI/4+progress;const p=[x+Math.cos(a)*(span-r*15),y+Math.sin(a)*(span*.5-r*7)];i?ctx.lineTo(...p):ctx.moveTo(...p);}ctx.stroke();}}
    else if(kind==='beam'){ctx.lineWidth=8;ctx.beginPath();ctx.moveTo(x-span,y-span);ctx.lineTo(x+span*.4,y+span*.3);ctx.stroke();ctx.strokeStyle='#fff1dc';ctx.lineWidth=2;ctx.stroke();}
    else if(kind==='spear'){for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-span+i*24,y+span*.5);ctx.lineTo(x+span*.5+i*24,y-span*.6);ctx.stroke();}}
    else if(kind==='petal'){for(let i=0;i<18;i++){const a=i*2.4+progress*3;rect(ctx,x+Math.cos(a)*span*progress,y+Math.sin(a)*span*.6*progress,6,5,color);}}
    else if(kind==='flame'||kind==='dragon'){for(let i=0;i<24;i++){const a=i*2.4;rect(ctx,x+Math.cos(a)*span*progress,y+Math.sin(a)*span*.45*progress-progress*35,5+i%4,11,i%2?color:'#ffdf81');}}
    else if(kind==='monkey'){for(let i=0;i<3;i++){const dx=x+(i-1)*48;rect(ctx,dx,y-60-progress*20,6,72,color);rect(ctx,dx-7,y-32,20,25,'#df9d4f');}}
    else{ctx.beginPath();ctx.ellipse(x,y,20+progress*span,10+progress*span*.5,kind==='crescent'?-.5:0,0,kind==='crescent'?Math.PI*1.6:Math.PI*2);ctx.stroke();}
    ctx.globalAlpha=1;
  }
  const seen=new Map(), hpBefore=new Map(), floaters=[];
  function siegeCastles(state,b,time,w,h){
    const skin=castleSkins.find(c=>c.id===state.account.equipped.city),size=Math.min(310,w*.24),locations=[{x:w*.16,side:'ally',index:skin?.artIndex??null,units:b.allies},{x:w*.84,side:'enemy',index:1,units:b.enemies}];
    for(const fort of locations){const img=fort.index!==null&&castleArt.complete&&castleArt.naturalWidth?castleArt:cityArt,index=img===castleArt?fort.index:0;if(img.complete&&img.naturalWidth){ctx.drawImage(img,index%3*img.naturalWidth/3,Math.floor(index/3)*img.naturalHeight/2,img.naturalWidth/3,img.naturalHeight/2,fort.x-size/2,h*.4-size*.7,size,size);}const max=fort.units.reduce((n,u)=>n+u.maxHp,0),hp=fort.units.reduce((n,u)=>n+u.hp,0);rect(ctx,fort.x-size*.4,h*.4-size*.75,size*.8,9,'#243b4a');rect(ctx,fort.x-size*.4,h*.4-size*.75,size*.8*hp/max,9,fort.side==='ally'?'#6be1a6':'#ec8282');ctx.textAlign='center';ctx.font='bold '+Math.max(9,Math.min(13,w*.01))+'px system-ui';ctx.fillStyle='#ffedb0';ctx.fillText(fort.side==='ally'?'THÀNH QUÂN VƯƠNG':'THÀNH BOT',fort.x,h*.4+size*.32);}
    for(let n=0;n<5;n++){const t=(time*.5+n*.2)%1,x=w*(.2+t*.6),y=h*.45-Math.sin(t*Math.PI)*h*.15;rect(ctx,x,y,8,3,n%2?'#f8dc85':'#b6e8ea');}ctx.textAlign='left';
  }
  function battleScene(state,time,w,h){
    if(!state.battle)return;const b=state.battle;
    if(b.mode==='bot'){rect(ctx,0,0,w,h,'#a6c5be');for(let n=0;n<60;n++)rect(ctx,n*53%w,h*.2+n*71%(h*.6),40,25,n%2?'#91b4a8':'#accbc0');}else if(backdrop.complete&&backdrop.naturalWidth){const r=Math.max(w/backdrop.naturalWidth,h/backdrop.naturalHeight);ctx.drawImage(backdrop,(w-backdrop.naturalWidth*r)/2,(h-backdrop.naturalHeight*r)/2,backdrop.naturalWidth*r,backdrop.naturalHeight*r);}else rect(ctx,0,0,w,h,'#839b61');
    rect(ctx,0,0,w,h,'#152b3544');poly(ctx,[[0,h*.45],[w*.5,h*.30],[w,h*.45],[w,h],[0,h]],'#779251a8');
    if(b.mode==='bot')siegeCastles(state,b,time,w,h);
    const position=u=>{const row=Math.floor(u.slot/3),col=u.slot%3;return{x:w*(u.side==='ally'?[.4,.25,.1][row]:[.6,.75,.9][row]),y:h*(.32+col*.15)};};
    for(const side of ['ally','enemy'])for(let slot=0;slot<9;slot++){const p=position({side,slot}),r=Math.min(55,w*.035);poly(ctx,[[p.x-r,p.y+12],[p.x,p.y-r*.35],[p.x+r,p.y+12],[p.x,p.y+r*.6]],side==='ally'?'#9bd1b22b':'#edc29a22');}
    const fighters=[...b.allies,...b.enemies];
    for(const e of b.events){if(!seen.has(e.serial))seen.set(e.serial,time);}
    if(seen.size>250)for(const [id,t]of seen)if(time-t>4)seen.delete(id);
    for(const u of [...fighters].sort((a,b)=>position(a).y-position(b).y)){
      const p=position(u), side=u.side==='ally'?1:-1, type=u.side==='ally'?b.troopType:b.enemyTroopType, tint=u.side==='ally'?'#76b2e4':'#e59677';
      const count=Math.ceil(u.hp/u.maxHp*9);
      for(let i=0;i<count;i++)soldier(p.x-side*(30+Math.floor(i/3)*18),p.y+16+(i%3)*14,tint,type,time*5+i,Math.min(1.5,w/1000),side);
      const cast=b.events.findLast(e=>e.actor===u.id&&e.side===u.side&&time-(seen.get(e.serial)||0)<.7), age=cast?time-seen.get(cast.serial):1;
      const lunge=cast?.kind==='attack'?Math.sin(age/.7*Math.PI)*side*18:0;
      const size=Math.min(112,Math.max(60,w*.075))*(u.isBoss?1.75:1);
      if(u.hp<=0)ctx.globalAlpha=.3;
      ctx.fillStyle=u.side==='ally'?'#61b8ed55':'#e7816555';ctx.beginPath();ctx.ellipse(p.x+lunge,p.y+17,size*.37,size*.13,0,0,Math.PI*2);ctx.fill();
      const globalIndex=Object.keys(skills).indexOf(u.id),art=globalIndex<8?fighterArt:globalIndex<32?fighterA:globalIndex<56?fighterB:celestialArt,cols=globalIndex>=56?5:globalIndex<8?4:6,rows=globalIndex>=56?2:globalIndex<8?2:4,index=globalIndex>=56?globalIndex-56:globalIndex<8?globalIndex:(globalIndex-8)%24;if(art.complete&&art.naturalWidth){const sw=art.naturalWidth/cols,sh=art.naturalHeight/rows;ctx.save();ctx.translate(p.x+lunge,p.y-size*.55+Math.sin(time*2)*2);ctx.scale(side,1);ctx.drawImage(art,index%cols*sw,Math.floor(index/cols)*sh,sw,sh,-size/2,-size/2,size,size);ctx.restore();}
      ctx.globalAlpha=1;
      const width=Math.min(108,size);rect(ctx,p.x-width/2,p.y+28,width,8,'#263f39');rect(ctx,p.x-width/2+1,p.y+29,(width-2)*u.hp/u.maxHp,6,u.side==='ally'?'#82d798':'#ed9b85');
      if(u.immune>0||u.invincible>0){ctx.strokeStyle=u.invincible>0?'#fff2b8':'#93dcf5';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(p.x,p.y-30,size*.49,size*.62,0,0,Math.PI*2);ctx.stroke();}
      if(u.shield){ctx.strokeStyle='#9fd8ff';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(p.x,p.y-30,size*.43,size*.57,0,0,Math.PI*2);ctx.stroke();}
      ctx.font=`600 ${Math.max(10,Math.min(13,w/100))}px system-ui`;ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#172a29';ctx.strokeText(u.name,p.x,p.y+51);ctx.fillStyle='#fff4d6';ctx.fillText(u.name,p.x,p.y+51);ctx.textAlign='left';
      rect(ctx,p.x-width/2,p.y+38,width,3,'#2d403b');rect(ctx,p.x-width/2,p.y+38,width*u.energy/100,3,u.resource==='mana'?'#8ccaf7':'#f1c76b');const status=(u.stun?'★ ':'')+(u.slow?'↓ ':'')+(u.manaLock?'M↓ ':'')+(u.immune>0?'⛨ ':'')+(u.invincible>0?'✧ ':'')+(u.revived?'↻':'');ctx.font='10px system-ui';ctx.fillStyle='#fff0bf';ctx.textAlign='center';ctx.fillText(status,p.x,p.y+66);ctx.textAlign='left';
      const old=hpBefore.get(u.key);if(old!==undefined&&old!==u.hp)floaters.push({x:p.x,y:p.y-size*.7,value:Math.round(u.hp-old),time});hpBefore.set(u.key,u.hp);
      if(u.burn)spell(p.x,p.y-20,'flame','#f48c44',(time%1)*.6,40);
    }
    for(const e of b.events){const age=time-(seen.get(e.serial)||0);if(age>1.2||age<0||b.clock-e.at>2)continue;const actor=fighters.find(u=>u.id===e.actor&&u.side===e.side);const ap=actor?position(actor):{x:w*.5,y:h*.3};
      if(e.kind==='attack'){const target=fighters.find(u=>u.key===e.targets[0]);if(target){const tp=position(target), t=Math.min(1,age/.45);ctx.strokeStyle=e.side==='ally'?'#d4f4ff':'#ffce9c';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(ap.x+(tp.x-ap.x)*t,ap.y-30+(tp.y-ap.y)*t);ctx.lineTo(ap.x+(tp.x-ap.x)*t-16,ap.y-32+(tp.y-ap.y)*t);ctx.stroke();}}
      else if(e.kind==='combo'){ctx.strokeStyle='#f2cb77';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(w*.32,h*.6,100+age*70,50+age*20,0,0,Math.PI*2);ctx.stroke();}
      else{const target=fighters.find(u=>e.targets?.includes(u.key)),p=target?position(target):ap;spell(p.x,p.y-30,e.kind,skills[e.actor]?.color||'#f3ce7c',age/1.2,Math.min(130,w*.1));}
    }
    for(let i=floaters.length-1;i>=0;i--){const f=floaters[i],age=time-f.time;if(age>1.4){floaters.splice(i,1);continue;}ctx.globalAlpha=1-age/1.4;ctx.font='bold 21px system-ui';ctx.textAlign='center';ctx.strokeStyle='#243b39';ctx.lineWidth=3;const value=f.value>0?'+'+f.value:String(f.value);ctx.strokeText(value,f.x,f.y-age*40);ctx.fillStyle=f.value>0?'#b5ffc8':'#ffdf9e';ctx.fillText(value,f.x,f.y-age*40);ctx.globalAlpha=1;ctx.textAlign='left';}
    dragon(w*.15,h*.27,time,state.dragon,Math.min(1.7,w/900));
  }
  function transform(w,h,city){const z=Math.max(.72,Math.min(1.35,w/1300))*camera.zoom;return{z,ox:w/2+camera.x,oy:h/2-(city?410:475)*z+camera.y};}
  function draw(ms){if(disposed)return;if(ms-lastFrame<33){frame=requestAnimationFrame(draw);return;}lastFrame=ms;const{state,view,selected}=read(),time=ms/1000,w=canvas.width,h=canvas.height,city=view==='city';ctx.imageSmoothingEnabled=false;hits.length=0;
    if(view==='combat'){battleScene(state,time,w,h);frame=requestAnimationFrame(draw);return;}
    if(view==='region'){rect(ctx,0,0,w,h,'#6b9683');const{z,ox,oy}=transform(w,h,false);ctx.save();ctx.translate(ox,oy);ctx.scale(z,z);if(state.inheritance.activeRealm)hits.push(...drawSecretRealm(ctx,state,time,{fighterArt,fighterA,fighterB}));else{hits.push(...drawRegionScene(ctx,state,time,cityArt,castleArt));hits.push(...drawHiddenGates(ctx,state,time,activeWorldCity(state)));}ctx.restore();frame=requestAnimationFrame(draw);return;}
    if(view==='world'){rect(ctx,0,0,w,h,'#193d4c');const{z,ox,oy}=transform(w,h,false);ctx.save();ctx.translate(ox,oy);ctx.scale(z,z);hits.push(...drawRealmAtlas(ctx,state,time));ctx.restore();frame=requestAnimationFrame(draw);return;}
    rect(ctx,0,0,w,h,city?'#829e5d':'#719858');const{z,ox,oy}=transform(w,h,city);ctx.save();ctx.translate(ox,oy);ctx.scale(z,z);ctx.drawImage(city?cityGround:worldGround,-2048,-640);
    if(city){
      // Houses and civic ornaments make the scene a continuous inhabited city.
      for(const [x,y]of [[-1,5],[0,8],[17,7],[17,16],[5,17],[19,6],[12,0]]){const[a,b]=iso(x,y);building(2,a,b,105);}
      const[fx,fy]=iso(9,9);poly(ctx,[[fx-65,fy],[fx,fy-30],[fx+65,fy],[fx,fy+30]],'#dbd0a5');ctx.fillStyle='#65b6bc';ctx.beginPath();ctx.ellipse(fx,fy-2,36,16,0,0,Math.PI*2);ctx.fill();rect(ctx,fx-5,fy-35,10,34,'#e2d6b4');for(let i=0;i<4;i++)rect(ctx,fx-24+i*15,fy-5+Math.sin(time*2+i)*3,7,2,'#d9f8d7');
      for(const b of [...citySites].sort((a,b)=>a.x+a.y-b.x-b.y)){const[x,y]=iso(b.x,b.y);const selectedHere=selected===b.id&&(b.id!=='barracks'||read().trainingType===b.type);if(selectedHere){ctx.strokeStyle='#d7ef8e';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y+6,b.size*.42,b.size*.2,0,0,Math.PI*2);ctx.stroke();}building(structures.findIndex(s=>s.id===b.id),x,y,b.size);
        if(b.type){const color=troopTypes[b.type].color;rect(ctx,x+b.size*.27,y-b.size*.55,3,65,'#bbac7c');poly(ctx,[[x+b.size*.27+3,y-b.size*.55],[x+b.size*.27+37,y-b.size*.55+9],[x+b.size*.27+3,y-b.size*.55+25]],color);for(let i=0;i<5;i++)soldier(x-35+i*16,y+8,color,b.type,time*4+i,.9);}
        hits.push({id:b.id,type:b.type,x:x-b.size/2,y:y-b.size+34,w:b.size,h:b.size+24});}
      for(const b of citySites){const[x,y]=iso(b.x,b.y),job=state.construction?.id===b.id?state.construction:b.id==='barracks'&&state.training?.type===b.type?state.training:null;const timer=job?`${Math.max(0,Math.ceil((job.endsAt-Date.now())/1000))}s`:null;const duration=job?.amount?Math.max(4000,14000-state.levels.barracks*2000):(8+state.levels[b.id]*4)*1000;const progress=job?1-(job.endsAt-Date.now())/duration:0;label(x,y+32,b.type?`Doanh trại ${troopTypes[b.type].name.replace(' binh','')}`:structures.find(s=>s.id===b.id).name,state.levels[b.id],selected===b.id&&(!b.type||read().trainingType===b.type),timer,progress);}
      for(let i=0;i<20;i++){const p=(time*.22+i*1.3)%15,[x,y]=iso(i%2?8:p+1,i%2?p+2:9);soldier(x,y+11,i%3?'#82a9ba':'#d2ac83','spear',time*6+i,.65,i%2?1:-1);}
    }else{
      for(const n of [...worldNodes].sort((a,b)=>a.x+a.y-b.x-b.y)){const[x,y]=iso(n.x,n.y);if(n.type==='home')building(0,x,y,270);else if(n.type==='camp'){poly(ctx,[[x-75,y+12],[x,y-110],[x+75,y+12]],'#af6755','#e0b57b');poly(ctx,[[x,y-110],[x+75,y+12],[x+20,y+12]],'#804d48');rect(ctx,x-12,y-23,25,36,'#313b35');for(let i=0;i<4;i++)soldier(x-45+i*26,y+14,'#e3a37d','spear',time*4+i,1.2,-1);}else building(n.type==='food'?1:n.type==='wood'?2:3,x,y,210);label(x,y+37,n.name,n.level,selected===n.id);hits.push({id:n.id,x:x-105,y:y-195,w:210,h:260});}
      if(state.march){const m=state.march,n=worldNodes.find(n=>n.id===m.nodeId),[hx,hy]=iso(10,10),[nx,ny]=iso(n.x,n.y),progress=Math.min(1,m.progress/m.duration),r=m.stage==='marching'?progress:m.stage==='returning'?1-progress:1,x=hx+(nx-hx)*r,y=hy+(ny-hy)*r;ctx.strokeStyle='#e8df9a';ctx.lineWidth=3;ctx.setLineDash([8,12]);ctx.beginPath();ctx.moveTo(hx,hy);ctx.lineTo(nx,ny);ctx.stroke();ctx.setLineDash([]);for(let i=0;i<12;i++)soldier(x+Math.floor(i/4)*18,y+(i%4)*12,'#81bad7',m.type||'shield',time*6+i,1.1,m.stage==='returning'?-1:1);label(x,y-60,m.stage==='combat'?'ĐANG GIAO CHIẾN':m.stage==='gathering'?'ĐANG THU THẬP':m.stage==='returning'?'ĐANG TRỞ VỀ':'ĐANG HÀNH QUÂN',1,true);}
    }
    ctx.restore();if(city&&state.account?.equipped.city!=='city-default'){const skin=state.account?.equipped.city;ctx.save();ctx.globalAlpha=.12;ctx.fillStyle=skin==='city-gold'?'#ffbf26':skin==='city-celestial'?'#b477ff':'#18d5b0';ctx.fillRect(0,0,w,h);ctx.globalAlpha=.7;ctx.strokeStyle=ctx.fillStyle;ctx.lineWidth=6;ctx.strokeRect(3,3,w-6,h-6);ctx.restore();}frame=requestAnimationFrame(draw);
  }
  canvas.addEventListener('pointerdown',e=>{if(read().view==='combat')return;dragging={x:e.clientX,y:e.clientY,cx:camera.x,cy:camera.y};moved=false;canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(!dragging)return;const ratio=canvas.width/canvas.getBoundingClientRect().width,dx=(e.clientX-dragging.x)*ratio,dy=(e.clientY-dragging.y)*ratio;if(Math.abs(dx)+Math.abs(dy)>5)moved=true;camera.x=Math.max(-950,Math.min(950,dragging.cx+dx));camera.y=Math.max(-700,Math.min(700,dragging.cy+dy));});
  canvas.addEventListener('pointerup',e=>{if(!moved&&dragging){const r=canvas.getBoundingClientRect(),{z,ox,oy}=transform(canvas.width,canvas.height,read().view==='city'),x=((e.clientX-r.left)*canvas.width/r.width-ox)/z,y=((e.clientY-r.top)*canvas.height/r.height-oy)/z;const hit=[...hits].reverse().find(p=>x>=p.x&&x<=p.x+p.w&&y>=p.y&&y<=p.y+p.h);if(hit)select(hit.id,hit.type);}dragging=null;});
  canvas.addEventListener('pointercancel',()=>{dragging=null;});canvas.addEventListener('wheel',e=>{e.preventDefault();camera.zoom=Math.max(.55,Math.min(1.7,camera.zoom-e.deltaY*.001));},{passive:false});frame=requestAnimationFrame(draw);
  return{reset(){camera.x=0;camera.y=0;camera.zoom=1;},zoom(d){camera.zoom=Math.max(.55,Math.min(1.7,camera.zoom+d));},focus(id,type){const b=citySites.find(s=>s.id===id&&(!type||s.type===type))||worldNodes.find(s=>s.id===id);if(!b)return;const[x,y]=iso(b.x,b.y),{z}=transform(canvas.width,canvas.height,read().view==='city');camera.x=-x*z;camera.y=((read().view==='city'?410:475)-y+80)*z;},dispose(){disposed=true;cancelAnimationFrame(frame);resize.disconnect();}};
}
