export const cityGate={x:12,y:28,size:240};
export const citySites=[{id:'hall',x:12,y:4,size:340},{id:'infirmary',x:4,y:5,size:230},{id:'dragon',x:21,y:5,size:240},{id:'barracks',type:'shield',x:4,y:13,size:220},{id:'barracks',type:'spear',x:4,y:21,size:220},{id:'barracks',type:'bow',x:19,y:14,size:220},{id:'barracks',type:'cavalry',x:19,y:22,size:220},{id:'farm',x:-1,y:24,size:220},{id:'wood',x:23,y:18,size:220},{id:'stone',x:24,y:11,size:220},{id:'tower',x:16,y:16,size:210},{id:'auction',x:1,y:12,size:185}];
export const cityHomes=[[-1,4],[-1,11],[-1,18],[24,2],[27,14],[27,25],[3,26],[9,24],[20,0],[6,0],[22,27],[15,25]];

// Fit the whole city at minimum zoom; clamp panning to the visible city bounds.
export function cityCameraLayout(width,height,camera={},touch=false){
 const top=touch?105:145,bottom=touch?85:125,availableWidth=Math.max(1,width-90),availableHeight=Math.max(1,height-top-bottom),zoom=Math.max(1,Math.min(3,camera.zoom||1)),base=Math.max(.01,Math.min(availableWidth/3168,availableHeight/1584)),z=base*zoom,maxX=Math.max(0,(3168*z-availableWidth)/2),maxY=Math.max(0,(1584*z-availableHeight)/2),x=Math.max(-maxX,Math.min(maxX,camera.x||0)),y=Math.max(-maxY,Math.min(maxY,camera.y||0));
 return{z,ox:width/2+x,oy:top+availableHeight/2-492*z,x,y,zoom,maxX,maxY};
}
