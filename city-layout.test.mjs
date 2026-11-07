import test from 'node:test';
import assert from 'node:assert/strict';
import {cityCameraLayout,regionCameraLayout} from './city-layout.mjs';

test('minimum city zoom fits the complete enclosure and ignores accumulated drag',()=>{
 for(const [w,h,touch]of [[1920,1080,false],[1280,592,true],[1280,504,true],[1280,719,true]]){
  const c=cityCameraLayout(w,h,{zoom:-99,x:1e9,y:-1e9},touch),top=touch?105:145,bottom=touch?85:125;
  assert.equal(c.zoom,1);assert.ok(Math.abs(c.x)<1e-9);assert.ok(Math.abs(c.y)<1e-9);
  assert.ok(c.ox-1584*c.z>=44.99);assert.ok(c.ox+1584*c.z<=w-44.99);
  assert.ok(c.oy-300*c.z>=top-.01);assert.ok(c.oy+1284*c.z<=h-bottom+.01);
 }
});
test('enlarged city pans to all bounds while the view cannot escape the enclosure',()=>{
 for(const touch of [false,true])for(const zoom of [1.1,1.8,3,10])for(const sign of [-1,1]){
  const w=touch?1280:1920,h=touch?592:1080,c=cityCameraLayout(w,h,{zoom,x:sign*1e8,y:sign*1e8},touch),top=touch?105:145,bottom=touch?85:125;
  assert.ok(c.zoom<=3);assert.equal(c.x,sign*c.maxX);assert.equal(c.y,sign*c.maxY);
  if(c.maxX>0){assert.ok(c.ox-1584*c.z<=45+.001);assert.ok(c.ox+1584*c.z>=w-45-.001);}
  if(c.maxY>0){assert.ok(c.oy-300*c.z<=top+.001);assert.ok(c.oy+1284*c.z>=h-bottom-.001);}
 }
});
test('reset and viewport resizing discard stale pan offsets at overview scale',()=>{
 const detailed=cityCameraLayout(1920,1080,{zoom:3,x:400,y:-300});assert.ok(detailed.x!==0);
 const overview=cityCameraLayout(1280,592,{zoom:1,x:detailed.x,y:detailed.y},true);
 assert.ok(Math.abs(overview.x)<1e-9);assert.ok(Math.abs(overview.y)<1e-9);assert.equal(overview.zoom,1);
});

test('city terrain shares the camera and covers the canvas at every zoom and pan bound',()=>{
 for(const [w,h,touch]of [[1920,1080,false],[1280,592,true],[1280,504,true],[1280,719,true]])for(const zoom of [1,1.1,1.8,3])for(const x of [-1e8,0,1e8])for(const y of [-1e8,0,1e8]){
  const c=cityCameraLayout(w,h,{zoom,x,y},touch),b=c.terrain;
  assert.ok(b.x*c.z+c.ox<=1e-6);assert.ok(b.y*c.z+c.oy<=1e-6);
  assert.ok((b.x+b.width)*c.z+c.ox>=w-1e-6);assert.ok((b.y+b.height)*c.z+c.oy>=h-1e-6);
 }
});

test('regional terrain never exposes an edge at minimum zoom or after extreme panning',()=>{
 for(const [w,h]of [[1920,1080],[1280,592],[1280,504],[1280,719],[2560,1080]])for(const zoom of [-10,1,1.1,1.8,3,20])for(const x of [-1e9,0,1e9])for(const y of [-1e9,0,1e9]){
  const c=regionCameraLayout(w,h,{zoom,x,y}),b=c.terrain;
  assert.ok(c.zoom>=1&&c.zoom<=3);assert.ok(b.x*c.z+c.ox<=1e-6);assert.ok(b.y*c.z+c.oy<=1e-6);
  assert.ok((b.x+b.width)*c.z+c.ox>=w-1e-6);assert.ok((b.y+b.height)*c.z+c.oy>=h-1e-6);
 }
});
test('regional reset and resizing restore a legal terrain viewport',()=>{
 const panned=regionCameraLayout(1920,1080,{zoom:3,x:1e8,y:-1e8});
 const reset=regionCameraLayout(1280,592,{zoom:1,x:panned.x,y:panned.y}),b=reset.terrain;
 assert.ok(Math.abs(reset.x)<1e-6);assert.ok(b.y*reset.z+reset.oy<=1e-6);assert.ok((b.y+b.height)*reset.z+reset.oy>=592-1e-6);
});
