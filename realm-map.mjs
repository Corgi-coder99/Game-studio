import {realmFactions,realmCities} from './realms.mjs';
import {cachedImage} from './art-cache.mjs';
import {drawProvinceProp} from './scene-art.mjs';
const atlasLand=[
 {color:'#A38B64',edge:'#D49A72',points:[[110,80],[240,45],[330,75],[450,50],[560,78],[690,50],[810,90],[920,160],[955,265],[905,340],[820,390],[680,385],[560,355],[460,330],[350,365],[265,310],[145,335],[70,230]]},
 {color:'#3E8E4A',edge:'#8FB4F2',points:[[145,335],[265,310],[350,365],[460,330],[510,400],[490,515],[545,585],[460,650],[325,665],[245,610],[140,640],[70,550],[80,440]]},
 {color:'#7BC25F',edge:'#C4EE8F',points:[[510,400],[560,355],[680,385],[820,390],[905,340],[965,405],[970,525],[935,590],[870,675],[740,645],[660,695],[545,650],[545,585],[490,515]]}
];
let realmLandscape=null,realmPropsReady=false,realmPropsSource='';
function realmGround(){
 const props=cachedImage('/assets/province-props-pixel.png'),terrain=cachedImage('/assets/living-terrain-pixel.png'),ready=!!(props.complete&&props.naturalWidth&&terrain.complete&&terrain.naturalWidth),key=props.src+'|'+terrain.src;
 if(realmLandscape&&realmPropsReady===ready&&realmPropsSource===key)return realmLandscape;
 realmPropsReady=ready;realmPropsSource=key;
 const c=document.createElement('canvas');c.width=1050;c.height=790;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 g.fillStyle='#17384c';g.fillRect(0,0,1050,790);
 for(let i=0;i<80;i++){g.fillStyle=i%3?'#21485a':'#285264';g.fillRect((i*137)%1050,(i*83)%790,8+i%12,2);}
 const trace=points=>{g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.closePath();};
 for(const [index,land]of atlasLand.entries()){
  trace(land.points);g.strokeStyle='#58796a';g.lineWidth=8;g.stroke();g.fillStyle=land.color;g.fill();
  g.save();g.clip();
  if(terrain.complete&&terrain.naturalWidth){const panel=[1,0,2][index],sw=terrain.naturalWidth/3;g.drawImage(terrain,panel*sw,0,sw,terrain.naturalHeight,50,40,930,680);}
  for(let i=0;i<24;i++){const x=85+(i*137)%890,y=95+(i*89)%570;if(ready)drawProvinceProp(g,i%5===0?6:index===0?0:1,x,y,30+i%12);}
  g.restore();trace(land.points);g.lineWidth=2;g.strokeStyle=land.edge;g.setLineDash([4,7]);g.stroke();g.setLineDash([]);
 }
 function river(points,width){g.lineJoin='round';g.lineCap='round';g.beginPath();points.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.strokeStyle='#b8bc86';g.lineWidth=width+5;g.stroke();g.strokeStyle='#327f9d';g.lineWidth=width;g.stroke();g.strokeStyle='#6cbdc5';g.lineWidth=2;g.stroke();}
 river([[210,160],[330,155],[420,195],[535,200],[590,245],[730,240],[860,285],[935,265]],9);
 river([[230,505],[330,530],[410,480],[510,460],[625,485],[730,480],[815,430],[920,435],[960,470]],13);
 realmLandscape=c;return c;
}

export function drawRealmAtlas(ctx,state,time){
 const hits=[],ox=-520,oy=75;ctx.save();ctx.translate(ox,oy);ctx.imageSmoothingEnabled=false;ctx.drawImage(realmGround(),0,0);
 function text(value,x,y,size=16,color='#FFE9A0'){ctx.textAlign='center';ctx.font=`bold ${size*2}px "Mandate Pixel",monospace`;ctx.strokeStyle='#2B3055';ctx.lineWidth=4;ctx.strokeText(value,x,y);ctx.fillStyle=color;ctx.fillText(value,x,y);}
 const motion=state.feedback?.reduceMotion?0:time;
 // Small water glints and drifting cloud shadows add life without obscuring sites.
 for(let i=0;i<9;i++){const x=110+(i*107+motion*3)%830,y=60+i*71;ctx.save();ctx.globalAlpha=.12;ctx.fillStyle='#F6EBD0';ctx.fillRect(Math.round(x),y,44,5);ctx.fillRect(Math.round(x+9),y-4,28,4);ctx.restore();}
 text('WEI',575,112,26,'#F6EBD0');text('SHU',240,380,26,'#D6E6FF');text('WU',770,595,26,'#F6EBD0');
 const home=realmCities.find(c=>c.id===(state.relocation?.position?.cityId||state.account?.realm?.city)),rp=state.relocation?.position,j=state.relocation?.journey;
 if(j&&rp){ctx.strokeStyle='#FFE9A0';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(rp.x,rp.y);ctx.lineTo(j.to.x,j.to.y);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#8FB4F2';ctx.fillRect(j.to.x-16,j.to.y-20,32,25);}
 const art=cachedImage('/assets/castle-skins-pixel.png');
 for(const city of realmCities){const selected=home?.id===city.id,f=realmFactions[city.faction];if(art.complete&&art.naturalWidth){const index=city.faction==='shu'?4:city.faction==='wei'?5:6,sw=art.naturalWidth/5,sh=art.naturalHeight/2;ctx.drawImage(art,index%5*sw,Math.floor(index/5)*sh,sw,sh,city.x-33,city.y-53,66,66);}else{ctx.fillStyle=f.color;ctx.fillRect(city.x-18,city.y-25,36,28);}
  if(selected){ctx.strokeStyle='#FFE9A0';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(city.x,city.y-7,36+Math.sin(motion*2)*2,27,0,0,Math.PI*2);ctx.stroke();}text(city.name,city.x,city.y+26,13);hits.push({id:city.id,type:'realmCity',x:city.x+ox-42,y:city.y+oy-52,w:84,h:93});}
 text('THREE REALMS · THE FRACTURED MANDATE',520,741,17,'#F6EBD0');
 for(const n of state.strongholds?.sites||[])if(n.guardianEvent===state.worldBoss.guardEvent&&['alive','occupied'].includes(n.status)){ctx.fillStyle='#FF9B54';ctx.fillRect(n.globalX-6,n.globalY-10,12,14);hits.push({id:n.id,type:'stronghold',x:ox+n.globalX-18,y:oy+n.globalY-25,w:36,h:36});}
 const portal=cachedImage('/assets/world-sites-pixel.png');if(portal.complete&&portal.naturalWidth){const sw=portal.naturalWidth/5;ctx.drawImage(portal,3*sw,0,sw,portal.naturalHeight,496,341,70,70);}else{ctx.strokeStyle='#E8BC8A';ctx.strokeRect(505,360,50,40);}text('BOSS SANCTUARY',530,428,13,'#FFE9A0');hits.push({id:'world-boss',type:'worldBoss',x:ox+490,y:oy+330,w:85,h:105});ctx.restore();return hits;
}
