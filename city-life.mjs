import {citySites,cityHomes} from './city-layout.mjs';
import {drawFlyingDragon,drawCivilian,drawProvinceProp} from './scene-art.mjs';
import {elementNames} from './elements.mjs';
import {cachedImage} from './art-cache.mjs';
export function drawCityDecoration(ctx,index,x,y,width){const img=cachedImage('/assets/city-life-pixel.png');if(!img.complete||!img.naturalWidth)return;const sw=img.naturalWidth/4,sh=img.naturalHeight/2,h=width*sh/sw;ctx.drawImage(img,index%4*sw,Math.floor(index/4)*sh,sw,sh,x-width/2,y-h+12,width,h);}
export function drawConstructionAura(ctx,x,y,size,time,complete=false){const r=size*.45,phase=complete?time%4:time%3;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=complete?'#FFE9A0':'#8FB4F2';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(x,y+10,r*(complete?1+phase*.2:1),r*.4,0,0,7);ctx.stroke();if(!complete){ctx.strokeStyle='#A38B64';ctx.lineWidth=4;for(const side of [-1,1]){ctx.beginPath();ctx.moveTo(x+side*r,y+10);ctx.lineTo(x+side*r,y-size*.7);ctx.lineTo(x-side*r,y-size*.7);ctx.stroke();}for(let i=0;i<3;i++){ctx.beginPath();ctx.moveTo(x-r,y-size*(.1+i*.2));ctx.lineTo(x+r,y-size*(.1+i*.2));ctx.stroke();}}
 for(let i=0;i<24;i++){const q=(time*.45+i*.071)%1,a=i*2.399+time*.6,dx=x+Math.cos(a)*r*(1-q*.4),dy=y-q*size*(complete?1.4:.8);ctx.globalAlpha=(1-q)*.75;ctx.fillStyle=i%3?'#FFE9A0':'#D6E6FF';ctx.fillRect(dx,dy,3+i%3,7+i%5);}
 if(complete){ctx.globalAlpha=Math.max(0,.5-phase*.1);const g=ctx.createLinearGradient(x,y,x,y-size*1.5);g.addColorStop(0,'#E8BC8A');g.addColorStop(1,'#E8BC8A');ctx.fillStyle=g;ctx.beginPath();ctx.moveTo(x-r,y+10);ctx.lineTo(x+r,y+10);ctx.lineTo(x+r*.4,y-size*1.4);ctx.lineTo(x-r*.4,y-size*1.4);ctx.fill();}ctx.restore();}
export function cityLife(ctx,iso,time,state,layer){if(layer==='market'){const p=citySites.find(b=>b.id==='auction'),[x,y]=iso(p.x,p.y);drawCityDecoration(ctx,1,x,y,185);return;}if(layer==='ground'){const foundation=cachedImage('/assets/city-foundation-pixel.png');if(foundation.complete&&foundation.naturalWidth)return;for(const [x,y]of cityHomes){const[a,b]=iso(x,y);drawCityDecoration(ctx,0,a,b,135);}for(const[i,x,y,w]of [[1,7,25,160],[3,19,0,160]]){const[a,b]=iso(x,y);drawCityDecoration(ctx,i,a,b,w);}const f=citySites.find(s=>s.id==='farm'),[fx,fy]=iso(f.x,f.y);drawProvinceProp(ctx,7,fx+65,fy+40,100);return;}
 // Four-frame workers only harvest after an actual production order.
 for(const [k,j]of Object.entries(state.production?.jobs||{})){if(!j)continue;const site=citySites.find(s=>s.id===k),home=cityHomes[k==='farm'?0:k==='wood'?2:3],p=(time*.11)%1,[x,y]=iso(home[0]+(site.x-home[0])*p,home[1]+(site.y-home[1])*p);drawCivilian(ctx,0,x,y,36,time,site.x>=home[0]?1:-1);const[a,b]=iso(site.x,site.y);for(let i=0;i<Math.min(4,Math.ceil(j.workers/8));i++)drawCivilian(ctx,Date.now()<j.endsAt?1:0,a+(i-1.5)*22,b+30,37,time+i*.15);}
 for(let i=0;i<18;i++){const p=(time*.05+i*.21)%1,[x,y]=iso(12,2+p*25);drawCivilian(ctx,0,x,y,29,time+i,i%2?1:-1);}
 const site = citySites.find(s => s.id === 'dragon'), [dx,dy] = iso(site.x,site.y);
 const motion = state.feedback?.reduceMotion ? 0 : time;
 const cycle = motion % 24;
 const climb = Math.min(1,Math.max(0,(cycle-1)/2));
 const landing = Math.min(1,Math.max(0,(cycle-21)/3));
 const lift = Math.sin(climb*Math.PI/2)*(1-landing*landing);
 const angle = Math.max(0,Math.min(1,(cycle-3)/18))*Math.PI*2;
 const x = dx + Math.sin(angle)*490;
 const y = dy-48-lift*(360+(1-Math.cos(angle))*60);
 drawFlyingDragon(ctx,state.dragon,x,y,145+lift*45,motion,{
  yaw:angle,
  pitch:Math.sin(angle)*.055,
  launch:climb===0?0:climb*(1-landing)
 });
 for(let i=0;i<2;i++){const x=-800+((time*28+i*720)%1800),y=100+Math.sin(time*.2+i)*30;drawCivilian(ctx,2,x,y,65,time+i);}}

export function drawSkinAura(ctx,index,x,y,size,time){if(!index)return;const colors=['#C3C8D8','#8FB4F2','#FFE9A0','#D6E6FF','#C4EE8F','#8FB4F2','#F2C14E','#FFE9A0','#E9ECF5','#C07BFF'],color=colors[index]||colors[1],r=size*.45;ctx.save();ctx.globalCompositeOperation='lighter';ctx.strokeStyle=color;ctx.globalAlpha=.5;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(x,y+12,r,r*.36,0,0,7);ctx.stroke();if(index>=6){const g=ctx.createLinearGradient(x,y+10,x,y-size*1.2);g.addColorStop(0,color+'88');g.addColorStop(1,color+'00');ctx.fillStyle=g;for(let i=0;i<18;i++){const a=time*.25+i*1.256,dx=Math.cos(a)*r*.75;ctx.beginPath();ctx.moveTo(x+dx-8,y);ctx.lineTo(x+dx+8,y);ctx.lineTo(x+dx*1.3+25,y-size*(.9+Math.sin(a)*.15));ctx.lineTo(x+dx*1.3-25,y-size*(.9+Math.sin(a)*.15));ctx.fill();}}for(let i=0;i<14;i++){const a=i*2.399+time*.4,q=(time*.25+i*.12)%1;ctx.globalAlpha=(1-q)*.8;ctx.fillStyle=color;ctx.fillRect(x+Math.cos(a)*r,y-Math.sin(q*Math.PI/2)*size*.85,3,5);}ctx.restore();}
