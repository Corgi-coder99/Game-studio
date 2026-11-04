import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState } from './game.mjs';
import { kingdomInitial, validKingdomState, migrateKingdom, upgradeStructure, startConstruction, accelerateConstruction, trainTroops, economyTick, dispatchMarch, worldTick, recallMarch, durableSave, activeBonds } from './kingdom.mjs';

test('initial and migrated city saves are valid and reject malformed resources',()=>{
 const s=kingdomInitial();assert.ok(validKingdomState(s));const old=initialState(),migrated=migrateKingdom(old);assert.ok(validKingdomState(migrated));assert.equal(migrated.coins,old.coins);assert.deepEqual(migrated.owned,old.owned);
 assert.equal(validKingdomState({...s,resources:{food:NaN,wood:1,stone:1}}),false);assert.equal(validKingdomState({...s,levels:{...s.levels,farm:5}}),false);assert.equal(validKingdomState({...s,battle:{winner:'ally'}}),false);
});
test('upgrade prerequisites, costs and maximum level are enforced',()=>{
 const s=kingdomInitial();assert.throws(()=>upgradeStructure(s,'farm'));const hall=upgradeStructure(s,'hall');assert.equal(hall.levels.hall,2);assert.equal(hall.resources.wood,s.resources.wood-160);assert.equal(s.levels.hall,1);assert.equal(upgradeStructure(hall,'farm').levels.farm,2);
 assert.throws(()=>upgradeStructure({...s,resources:{food:0,wood:0,stone:0}},'hall'));assert.throws(()=>upgradeStructure({...s,levels:{...s.levels,hall:5}},'hall'));
});
test('construction deducts once, completes on schedule and supports 50-gem acceleration',()=>{
 const s=kingdomInitial(100000),started=startConstruction(s,'hall',100000);assert.equal(started.levels.hall,1);assert.equal(started.resources.wood,s.resources.wood-160);assert.throws(()=>startConstruction(started,'hall'));
 assert.equal(economyTick(started,111000).levels.hall,1);const done=economyTick(started,112000);assert.equal(done.levels.hall,2);assert.equal(done.construction,null);assert.equal(economyTick(done,120000).levels.hall,2);
 const fast=accelerateConstruction(started);assert.equal(fast.levels.hall,2);assert.equal(fast.coins,s.coins-50);assert.throws(()=>accelerateConstruction({...started,coins:49}));
});
test('economy caps offline income at eight hours and does not accrue negative elapsed time',()=>{
 const s=kingdomInitial(100000);assert.equal(economyTick(s,110000).resources.food,s.resources.food+20);assert.equal(economyTick(s,0).resources.food,s.resources.food);assert.equal(economyTick(s,100000+48*3600000).resources.food,s.resources.food+28800*2);
});
test('typed training spends resources and completes exactly once',()=>{
 const s=kingdomInitial(100000),job=trainTroops(s,100000,'bow');assert.equal(job.training.endsAt,112000);assert.throws(()=>trainTroops(job));const done=economyTick(job,112000);assert.equal(done.regiments.bow,60);assert.equal(done.troops,200);assert.equal(done.resources.food,s.resources.food-160+24);assert.equal(economyTick(done,112000).troops,200);
});
test('marches reserve the selected regiment, reject concurrent missions and return gathered resources once',()=>{
 const s=kingdomInitial();let next=dispatchMarch(s,'grain');assert.equal(next.regiments.shield,20);assert.equal(next.troops,120);assert.throws(()=>dispatchMarch(next,'camp1'));assert.throws(()=>dispatchMarch({...s,team:[]},'camp1'));assert.throws(()=>dispatchMarch({...s,troopType:'cavalry'},'camp1'));
 for(let i=0;i<60;i++)next=worldTick(next,1);assert.equal(next.resources.food,s.resources.food+500);assert.equal(next.troops,180);assert.equal(next.regiments.shield,80);assert.equal(next.march,null);assert.equal(worldTick(next,5).resources.food,next.resources.food);
});
test('pause, recall and durable save preserve troop totals',()=>{
 const next=dispatchMarch(kingdomInitial(),'camp1'),paused={...next,paused:true};assert.deepEqual(worldTick(paused,5),paused);const recalled=recallMarch(next);assert.equal(recalled.march.stage,'returning');const saved=durableSave(next);assert.equal(saved.troops,180);assert.equal(saved.regiments.shield,80);assert.ok(validKingdomState(saved));assert.equal(next.troops,120);
});
test('old v3 regiment defaults and invalid jobs are handled during migration',()=>{
 const s=kingdomInitial();delete s.regiments;delete s.troopType;delete s.construction;const migrated=migrateKingdom(s);assert.equal(migrated.regiments.shield,180);assert.equal(migrated.troopType,'shield');assert.equal(validKingdomState({...migrated,troopType:'__proto__'}),false);assert.equal(validKingdomState({...migrated,construction:{id:'farm',target:2,endsAt:Date.now()+10000}}),false);
});
test('historical bonds require the actual named partners and cover larger formations',()=>{
 assert.deepEqual(activeBonds(['zhaoyun','zhugeliang']).map(b=>b.id),['shu']);assert.deepEqual(activeBonds(['zhaoyun']),[]);assert.ok(activeBonds(['liubei','guanyu','zhangfei']).some(b=>b.id==='sworn'));assert.ok(activeBonds(['houyi','change']).some(b=>b.id==='moon'));
});
