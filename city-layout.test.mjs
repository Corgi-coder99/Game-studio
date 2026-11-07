import test from 'node:test';
import assert from 'node:assert/strict';
import {cityCameraLayout} from './city-layout.mjs';

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
