export const cityGate={x:12,y:28,size:240};
export const citySites=[{id:'hall',x:12,y:4,size:340},{id:'infirmary',x:4,y:5,size:230},{id:'dragon',x:21,y:5,size:240},{id:'barracks',type:'shield',x:4,y:13,size:220},{id:'barracks',type:'spear',x:4,y:21,size:220},{id:'barracks',type:'bow',x:19,y:14,size:220},{id:'barracks',type:'cavalry',x:19,y:22,size:220},{id:'farm',x:-1,y:24,size:220},{id:'wood',x:23,y:18,size:220},{id:'stone',x:24,y:11,size:220},{id:'tower',x:16,y:16,size:210},{id:'auction',x:1,y:12,size:185}];
export const cityHomes=[[-1,4],[-1,11],[-1,18],[24,2],[27,14],[27,25],[3,26],[9,24],[20,0],[6,0],[22,27],[15,25]];

// Share finite terrain bounds with the regional renderer and camera.
export const regionTerrainBounds={x:-1900,y:-800,width:3800,height:2600};

// Fit the whole city at minimum zoom; keep terrain and buildings in one camera space.
export function cityCameraLayout(width,height,camera={},touch=false){
 const top=touch?105:145,bottom=touch?85:125,availableWidth=Math.max(1,width-90),availableHeight=Math.max(1,height-top-bottom),zoom=Math.max(1,Math.min(3,camera.zoom||1)),base=Math.max(.01,Math.min(availableWidth/3168,availableHeight/1584)),z=base*zoom,maxX=Math.max(0,(3168*z-availableWidth)/2),maxY=Math.max(0,(1584*z-availableHeight)/2),x=Math.max(-maxX,Math.min(maxX,camera.x||0)),y=Math.max(-maxY,Math.min(maxY,camera.y||0));
 const side=Math.max(4096,width/base,height/base),terrain={x:-side/2,y:492-side/2,width:side,height:side};
 return{z,ox:width/2+x,oy:top+availableHeight/2-492*z,x,y,zoom,maxX,maxY,terrain};
}

// The minimum scale covers the entire canvas; panning never reveals the image edge.
export function regionCameraLayout(width,height,camera={}){
 const bounds=regionTerrainBounds,zoom=Math.max(1,Math.min(3,camera.zoom||1)),z=Math.max(width/bounds.width,height/bounds.height)*zoom,centerX=width/2,centerY=height/2+35-370*z,minOx=width-(bounds.x+bounds.width)*z,maxOx=-bounds.x*z,minOy=height-(bounds.y+bounds.height)*z,maxOy=-bounds.y*z,ox=Math.max(minOx,Math.min(maxOx,centerX+(camera.x||0))),oy=Math.max(minOy,Math.min(maxOy,centerY+(camera.y||0)));
 return{z,ox,oy,x:ox-centerX,y:oy-centerY,zoom,terrain:bounds};
}
