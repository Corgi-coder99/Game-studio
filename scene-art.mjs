import {styleAnimationFrame} from './animation-timing.mjs';
import {cachedImage} from './art-cache.mjs';
import {elementNames} from './elements.mjs';
export function runePicture(index,name){return `<span class="rune-picture" style="--rune-x:${index%7*100/6}%;--rune-y:${Math.floor(index/7)*100/3}%" role="img" aria-label="Ngọc ${name}"></span>`;}
export function provincePicture(index,name='Cảnh quan'){return `<span class="province-picture" style="--province-x:${index%4*100/3}%;--province-y:${Math.floor(index/4)*100}%" role="img" aria-label="${name}"></span>`;}
export function drawProvinceProp(ctx,index,x,y,width){const img=cachedImage('/assets/province-props-pixel.png');if(!img.complete||!img.naturalWidth)return;const sw=img.naturalWidth/4,sh=img.naturalHeight/2;ctx.drawImage(img,index%4*sw,Math.floor(index/4)*sh,sw,sh,x-width/2,y-width+12,width,width);}
export function dragonFrame(time){return styleAnimationFrame('idle',Math.max(0,time)*1000);}
// Each element uses the same painted poses with its own flight palette.
const dragonFlightFilters=['none','hue-rotate(186deg)','hue-rotate(76deg) saturate(.64)','sepia(.48) saturate(.82)','grayscale(1) brightness(1.23)','sepia(.6) brightness(1.34)','hue-rotate(260deg) brightness(.75)'];
export function drawFlyingDragon(ctx,element,x,y,size,time,{yaw=0,pitch=0,launch=1}={}){
 const column=Math.max(0,elementNames.indexOf(element));
 const atlas=cachedImage('/assets/fire-dragon-motion-pixel.png');
 if(!atlas.complete||!atlas.naturalWidth)return;
 const heading=Math.cos(yaw),direction=heading<0?1:-1;
 const flightFrame=Math.floor(time*7)%4;
 const launchFrame=Math.min(3,Math.floor(launch*4));
 const frame=launch<1?launchFrame:4+flightFrame;
 const sw=atlas.naturalWidth/4,sh=atlas.naturalHeight/2;
 ctx.save();
 ctx.translate(Math.round(x),Math.round(y));
 ctx.rotate(pitch*direction);
 ctx.scale(direction,1);
 ctx.imageSmoothingEnabled=false;
 ctx.filter=dragonFlightFilters[column];
 const width=size*1.28,height=width*sh/sw;
 ctx.drawImage(atlas,frame%4*sw,Math.floor(frame/4)*sh,sw,sh,-width/2,-height/2,width,height);
 ctx.restore();
}
export function drawCivilian(ctx,row,x,y,size,time,facing=1){const img=cachedImage('/assets/village-motion-pixel.png');if(!img.complete||!img.naturalWidth)return;const sw=img.naturalWidth/4,sh=img.naturalHeight/3,frame=Math.floor(Math.max(0,time)*6)%4;ctx.save();ctx.translate(x,y);ctx.scale(facing,1);ctx.drawImage(img,frame*sw,row*sh,sw,sh,-size/2,-size,size,size);ctx.restore();}
