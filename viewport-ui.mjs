import {elementNames} from './elements.mjs';
import {worldSiteArt} from './world-art.mjs';
import {characterById} from './characters.mjs';
// Original vector item illustrations, kept inline for fully offline play.
export function itemPicture(kind){if(kind==='portal')return worldSiteArt('portal');const icons={food:0,wood:1,stone:2,coins:3,essence:4,resourcePack:5,xpTome:6,summonTicket:7,gearTicket:8,petGachaPoint:9,petFood:10,speedup:11,ssrUniversal:12,map:13,frame:14,chat:14};if(icons[kind]!==undefined){const index=icons[kind];return `<span class="item-picture inventory-picture" style="--item-x:${index%5*25}%;--item-y:${Math.floor(index/5)*50}%" role="img" aria-label="${kind}"></span>`;}const shapes={helmet:'<path d="M7 19V11L11 5H21L25 11V19H21V13H11V19Z"/><path d="M14 6V18H18V6" fill="#e8c86b"/>',armor:'<path d="M10 5L5 10L8 15L11 13V26H23V13L26 15L29 10L24 5L20 8H14Z"/>',weapon:'<path d="M23 3L27 5L14 22L10 19Z"/><path d="M7 18L17 25M11 23L6 29" stroke="#efc56e" stroke-width="4"/>',jewelry:'<path d="M16 3L27 15L16 29L5 15Z"/><path d="M16 8L22 15L16 23L10 15Z" fill="#dd7cf5"/>',relic:'<path d="M8 6H24V27H8Z"/><path d="M12 11H20M12 16H20M12 21H18" stroke="#f9d979" stroke-width="2"/>',food:'<path d="M16 29V5M16 12L9 7M16 18L24 11M16 24L9 18" stroke="#e7c851" stroke-width="4"/>',wood:'<path d="M5 20L21 5L29 13L13 28Z" fill="#a87546"/><circle cx="10" cy="24" r="5" fill="#e1b773"/>',stone:'<path d="M4 23L8 11L21 6L29 17L25 27H9Z" fill="#adc1cd"/>',coins:'<path d="M16 3L29 15L16 29L3 15Z" fill="#c58af5"/><path d="M16 9L23 15L16 23L9 15Z" fill="#f2d3ff"/>',petFood:'<path d="M7 20Q3 12 14 8Q25 3 27 13Q31 22 18 27Q10 30 7 20Z" fill="#78d29a"/>',speedup:'<path d="M8 4H24L22 12L17 16L22 20L24 28H8L10 20L15 16L10 12Z"/>',ssrUniversal:'<path d="M16 2L21 11L30 15L21 20L16 30L11 20L2 15L11 11Z" fill="#df9cf7"/>'};const shape=shapes[kind]|| (kind.toLowerCase().includes('ticket')||kind==='petGachaPoint'?'<path d="M4 8H28V24H4V19Q10 16 4 13Z"/><path d="M20 8V24" stroke="#fff0b8" stroke-dasharray="2"/>':'<path d="M6 5H25V27H6Z"/><path d="M11 9H21M11 15H21M11 21H18" stroke="#fff0b8" stroke-width="2"/>');return `<svg class="item-picture" viewBox="0 0 32 32" role="img" aria-label="${kind}"><rect x="1" y="1" width="30" height="30" rx="3" fill="#16313d"/> <g fill="#72bccb" stroke="#e9cc83" stroke-width="1" stroke-linejoin="miter">${shape}</g></svg>`;}
const scenePositions=new Map();
export function mountViewportScenes(main,key){
 if(main.querySelector(':scope > .fixed-screen'))return;
 const tabs=main.querySelector(':scope > .account-tabs'),fixed=main.querySelector(':scope > .doll-hall'),host=fixed?.querySelector('.doll-tab-content')||main;
 const roots=[...host.children].filter(n=>n!==tabs&&!n.matches('.gear-curtain'));
 if(!roots.length)return;
 const tray=document.createElement('div');tray.className='viewport-tray';const bar=document.createElement('nav');bar.className='scene-controls';bar.setAttribute('aria-label','Chuyển trang nội dung');
 roots.forEach(n=>n.remove());host.append(tray,bar);
 const pages=[];let current;
 function newPage(){current=document.createElement('section');current.className='viewport-scene';tray.append(current);pages.push(current);}
 const collections='.heroes-grid,.bag-grid,.level-rewards,.character-skill-list,.skin-gallery,.time-gifts,.rune-grid,.pets-grid,.bonds-grid';
 function place(node){
  if(node.matches(collections)){[...node.children].forEach(place);return;}
  if(!current)newPage();current.append(node);
  if(current.scrollHeight<=tray.clientHeight+2)return;
  if(current.children.length>1){node.remove();newPage();current.append(node);}
  if(current.scrollHeight>tray.clientHeight+2&&node.children.length>1&&!node.matches('article,form,dl,button,select')){node.remove();[...node.children].forEach(place);}
 }
 roots.forEach(place);
 for(let i=pages.length-1;i>=0;i--)if(!pages[i].children.length){pages[i].remove();pages.splice(i,1);}
 if(!pages.length){bar.remove();return;}
 let index=Math.min(scenePositions.get(key)||0,pages.length-1);
 function show(){pages.forEach((p,i)=>p.hidden=i!==index);bar.innerHTML=`<button data-scene-prev ${index===0?'disabled':''}>← Trước</button><span>${index+1} / ${pages.length}</span><button data-scene-next ${index===pages.length-1?'disabled':''}>Sau →</button>`;scenePositions.set(key,index);}
 bar.onclick=e=>{if(e.target.closest('[data-scene-prev]')&&index>0)index--;else if(e.target.closest('[data-scene-next]')&&index<pages.length-1)index++;else return;show();};show();
}

export function elementalDragonArt(element){const index=Math.max(0,elementNames.indexOf(element));return `<span class="elemental-dragon-art" style="--dragon-x:${index*100/6}%" role="img" aria-label="${element} Long"></span>`;}
export function equipmentAffinity(template){return characterById[template.heroId]?.divine.path|| (Array.from(template.id).reduce((n,c)=>n+c.charCodeAt(0),0)%2?'dark':'light');}
export function equipmentPicture(template){const slots=['helmet','armor','weapon','jewelry','relic'],path=equipmentAffinity(template),index=Math.max(0,slots.indexOf(template.slot));const tier=Math.max(0,['D','C','B','A','S','SS','SSS','SSR'].indexOf(template.grade)),name=template.name||'',weapon=template.slot==='weapon'?(name.includes('Bổng')?0:name.includes('Thương')||name.includes('Kích')?1:name.includes('Cung')?2:name.includes('Trượng')?3:name.includes('Đao')?5:name.includes('Quạt')||name.includes('Phiến')?6:name.includes('Chùy')||name.includes('Chù')?7:4):null;return `<span class="equipment-picture rarity-picture rarity-${template.grade} ${weapon!==null?'rarity-weapon':''} affinity-${path} ${weapon!==null?'weapon-picture':''}" style="--rarity-x:${index*25}%;--rarity-y:${tier*100/7}%;--weapon-rarity-x:${(weapon||0)*100/7}%;--gear-x:${index*25}%;--gear-y:${path==='dark'?100:0}%;${weapon!==null?'--weapon-x:'+weapon%4*100/3+'%;--weapon-y:'+Math.floor(weapon/4)*100+'%;':''}" role="img" aria-label="${template.name}"><i class="affinity-mark" title="${path==='dark'?'Bóng tối':'Ánh sáng'}">${path==='dark'?'☾':'☀'}</i></span>`;}

export function fitGameResolution(){
 const root=document.documentElement,vv=window.visualViewport,css=getComputedStyle(root),left=parseFloat(css.getPropertyValue('--safe-left'))||0,right=parseFloat(css.getPropertyValue('--safe-right'))||0,top=parseFloat(css.getPropertyValue('--safe-top'))||0,bottom=parseFloat(css.getPropertyValue('--safe-bottom'))||0,w=Math.max(1,(vv?.width||innerWidth)-left-right),h=Math.max(1,(vv?.height||innerHeight)-top-bottom),mobile=matchMedia('(pointer:coarse)').matches,rotated=mobile&&h>w,screenWidth=rotated?h:w,screenHeight=rotated?w:h,width=mobile?1280:1920,height=mobile?width*screenHeight/screenWidth:1080,scale=Math.min(screenWidth/width,screenHeight/height);
 root.classList.toggle('touch-game',mobile);root.classList.toggle('rotated-game',rotated);root.style.setProperty('--game-width',width+'px');root.style.setProperty('--game-height',height+'px');root.style.setProperty('--game-scale',scale);root.style.setProperty('--game-left',(rotated?left+w:left+Math.max(0,(w-width*scale)/2))+'px');root.style.setProperty('--game-top',(top+Math.max(0,(screenHeight-height*scale)/2))+'px');
}


export function navArt(id){if(id==='bag'||id==='shop')return `<span class="navigation-art navigation-painted" style="--navigation-x:${id==='bag'?0:100/3}%" role="img" aria-label="${id==='bag'?'Túi đồ':'Cửa hàng'}"></span>`;if(id==='city'||id==='skins')return `<span class="navigation-art navigation-castle" role="img" aria-label="Thành trì"></span>`;if(id==='heroes'||id==='profile')return `<span class="navigation-art navigation-hero" role="img" aria-label="Anh hùng"></span>`;if(id==='pets')return `<span class="navigation-art navigation-pet" role="img" aria-label="Thú cưng"></span>`;const item={shop:'resourcePack',bag:'resourcePack',quests:'xpTome',inheritance:'map',region:'map',summon:'summonTicket',studio:'gearTicket',runes:'coins',help:'xpTome'}[id];if(item)return `<span class="navigation-art">${itemPicture(item)}</span>`;const index=({army:9,mail:4})[id]??3;return `<span class="navigation-art navigation-skill" style="--nav-x:${index%4*100/3}%;--nav-y:${Math.floor(index/4)*100/3}%" role="img" aria-label="${id}"></span>`;}

// Native scrolling can use the wrong axis inside Safari's rotated game frame.
export function bindHeroCarouselGestures(carousel){
 if(!matchMedia('(pointer:coarse)').matches)return;
 let drag=null,swiped=false;
 carousel.style.touchAction='none';
 carousel.addEventListener('pointerdown',e=>{if(e.pointerType!=='touch')return;drag={id:e.pointerId,x:e.clientX,y:e.clientY,top:carousel.scrollTop};swiped=false;});
 carousel.addEventListener('pointermove',e=>{if(!drag||drag.id!==e.pointerId)return;const scale=parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--game-scale'))||1,delta=document.documentElement.classList.contains('rotated-game')?-(e.clientX-drag.x)/scale:(e.clientY-drag.y)/scale;if(!swiped&&Math.abs(delta)<6)return;if(!swiped){swiped=true;carousel.setPointerCapture(e.pointerId);}e.preventDefault();carousel.scrollTop=drag.top-delta;},{passive:false});
 carousel.addEventListener('pointerup',()=>{drag=null;});
 carousel.addEventListener('pointercancel',()=>{drag=null;swiped=false;});
 carousel.addEventListener('click',e=>{if(swiped){e.preventDefault();e.stopImmediatePropagation();swiped=false;}},true);
}
