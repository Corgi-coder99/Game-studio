// Original vector item illustrations, kept inline for fully offline play.
export function itemPicture(kind){const shapes={helmet:'<path d="M7 19V11L11 5H21L25 11V19H21V13H11V19Z"/><path d="M14 6V18H18V6" fill="#e8c86b"/>',armor:'<path d="M10 5L5 10L8 15L11 13V26H23V13L26 15L29 10L24 5L20 8H14Z"/>',weapon:'<path d="M23 3L27 5L14 22L10 19Z"/><path d="M7 18L17 25M11 23L6 29" stroke="#efc56e" stroke-width="4"/>',jewelry:'<path d="M16 3L27 15L16 29L5 15Z"/><path d="M16 8L22 15L16 23L10 15Z" fill="#dd7cf5"/>',relic:'<path d="M8 6H24V27H8Z"/><path d="M12 11H20M12 16H20M12 21H18" stroke="#f9d979" stroke-width="2"/>',food:'<path d="M16 29V5M16 12L9 7M16 18L24 11M16 24L9 18" stroke="#e7c851" stroke-width="4"/>',wood:'<path d="M5 20L21 5L29 13L13 28Z" fill="#a87546"/><circle cx="10" cy="24" r="5" fill="#e1b773"/>',stone:'<path d="M4 23L8 11L21 6L29 17L25 27H9Z" fill="#adc1cd"/>',coins:'<path d="M16 3L29 15L16 29L3 15Z" fill="#c58af5"/><path d="M16 9L23 15L16 23L9 15Z" fill="#f2d3ff"/>',petFood:'<path d="M7 20Q3 12 14 8Q25 3 27 13Q31 22 18 27Q10 30 7 20Z" fill="#78d29a"/>',speedup:'<path d="M8 4H24L22 12L17 16L22 20L24 28H8L10 20L15 16L10 12Z"/>',ssrUniversal:'<path d="M16 2L21 11L30 15L21 20L16 30L11 20L2 15L11 11Z" fill="#df9cf7"/>'};const shape=shapes[kind]|| (kind.toLowerCase().includes('ticket')||kind==='petGachaPoint'?'<path d="M4 8H28V24H4V19Q10 16 4 13Z"/><path d="M20 8V24" stroke="#fff0b8" stroke-dasharray="2"/>':'<path d="M6 5H25V27H6Z"/><path d="M11 9H21M11 15H21M11 21H18" stroke="#fff0b8" stroke-width="2"/>');return `<svg class="item-picture" viewBox="0 0 32 32" role="img" aria-label="${kind}"><rect x="1" y="1" width="30" height="30" rx="3" fill="#16313d"/> <g fill="#72bccb" stroke="#e9cc83" stroke-width="1" stroke-linejoin="miter">${shape}</g></svg>`;}
const scenePositions=new Map();
export function mountViewportScenes(main,key){
 const tabs=main.querySelector(':scope > .account-tabs');
 const fixed=main.querySelector(':scope > .doll-hall');
 const host=fixed?.querySelector('.doll-tab-content')||main;
 const exclusions=new Set([tabs,...main.querySelectorAll(':scope > .gear-curtain')]);
 const roots=[...host.children].filter(n=>!exclusions.has(n));
 if(!roots.length)return;
 const tray=document.createElement('div');tray.className='viewport-tray';
 const bar=document.createElement('nav');bar.className='scene-controls';bar.setAttribute('aria-label','Chuyển trang nội dung');
 host.append(tray,bar);
 const maxHeight=()=>Math.max(100,host.getBoundingClientRect().height-48);
 const pieces=[];
 function collect(node){
  // Break large collections at card boundaries. Each item remains a real interactive DOM node.
  const children=[...node.children];
  if(children.length>1 && (node.scrollHeight>maxHeight()||node.matches('.heroes-grid,.bag-grid,.rewards-grid,.character-skill-list,.bonds-grid,.rune-grid,.quest-grid')) && !node.matches('select,button,dl,form,.formation-screen,.collection-screen')){
   for(const child of children)collect(child);
  }else pieces.push(node);
 }
 roots.forEach(collect);
 const heights=pieces.map(node=>Math.max(30,node.getBoundingClientRect().height+12));
 roots.forEach(node=>node.remove());
 const pages=[];let page=null,used=0;
 for(const [pieceIndex,node] of pieces.entries()){const height=heights[pieceIndex];if(!page||used+height>maxHeight()){page=document.createElement('section');page.className='viewport-scene';tray.append(page);pages.push(page);used=0;}page.append(node);used+=height;}
 let index=Math.min(scenePositions.get(key)||0,pages.length-1);
 function show(){pages.forEach((page,i)=>{page.hidden=i!==index;});const page=pages[index];page.style.transform='';const scale=Math.min(1,(tray.clientHeight-10)/Math.max(page.scrollHeight,1));if(scale<1){page.style.transform=`scale(${scale})`;page.style.transformOrigin='top center';}bar.innerHTML=`<button data-scene-prev ${index===0?'disabled':''}>← Trước</button><span>${index+1} / ${pages.length}</span><button data-scene-next ${index===pages.length-1?'disabled':''}>Sau →</button>`;scenePositions.set(key,index);}
 bar.onclick=e=>{if(e.target.closest('[data-scene-prev]')&&index>0)index--;else if(e.target.closest('[data-scene-next]')&&index<pages.length-1)index++;else return;show();};
 show();
}

export function elementalDragonArt(element){const index=Math.max(0,["Hỏa","Thủy","Mộc"].indexOf(element));return `<span class="elemental-dragon-art" style="--dragon-x:${index*50}%" role="img" aria-label="${element} Long"></span>`;}
