import test from 'node:test';
import assert from 'node:assert/strict';
import { characterRoster, characterById, gradeOrder, archetypeLabels } from './characters.mjs';
import { kingdomInitial, createSkirmish, dispatchMarch, worldTick, migrateKingdom, validKingdomState, durableSave } from './kingdom.mjs';
import { normalizeProgression, validProgression, getCharacterStats, defaultFormation, assignFormation, toggleFormation, levelUpHero, levelUpSkill, forgeItem, equipItem, enhanceItem, itemTemplates, pullCharacters } from './progression.mjs';
import { createTacticsBattle, castTactics, tickTactics, tacticsHit, tacticsHeal, tacticsShield, tacticsStatus, tacticsTarget } from './tactics.mjs';

const ids=characterRoster.map(h=>h.id);
function rich(team=['wukong','bajie','zhugeliang','zhaoyun']){const s=kingdomInitial();s.owned=[...ids];s.team=team;s.formation=defaultFormation(team);s.coins=100000;s.resources.food=100000;const n=normalizeProgression(s);for(const id of ids)n.heroXP[id]=10000;n.essence=10000;return n;}
function arena(team=['wukong','bajie','zhugeliang','zhaoyun']){const s=rich(team),b=createTacticsBattle(s,{id:'test',name:'Thử hiệu ứng',level:1,enemies:ids.slice(8,17)},[],{bonus:0});for(const u of [...b.allies,...b.enemies]){u.effects={};u.immune=0;u.invincible=0;u.shield=0;u.reflect=0;u.block=0;u.lifesteal=0;u.regen=0;u.revive=false;u.execute=false;u.crit=0;u.armor=0;u.resist=0;u.hp=u.maxHp=10000;u.attackTimer=999;u.manaRegen=0;u.rageRegen=0;u.mana=0;u.rage=0;}return b;}
function ready(b,id){const u=b.allies.find(u=>u.id===id);u[u.resource]=u.skillCost;u.cooldown=0;return u;}

test('56 distinct characters cover all eight grades, six roles, unique signature weapons and skills',()=>{
 assert.equal(characterRoster.length,56);assert.equal(new Set(ids).size,56);assert.equal(new Set(characterRoster.map(h=>h.name)).size,56);
 assert.equal(new Set(characterRoster.map(h=>h.skill.name)).size,56);assert.ok(new Set(characterRoster.map(h=>h.weapon)).size>=50);
 for(const grade of gradeOrder)assert.ok(characterRoster.some(h=>h.grade===grade));
 for(const role of Object.keys(archetypeLabels))assert.ok(characterRoster.some(h=>h.roles.includes(role)));
 for(const h of characterRoster){assert.ok(h.skill.operations.length>=2);assert.ok(h.preferredRows.every(r=>r>=0&&r<=2));assert.ok(['mana','rage'].includes(h.resource));}
});
test('all requested base stats grow with levels for every character',()=>{
 const s=rich();for(const h of characterRoster){s.heroLevels[h.id]=1;const low=getCharacterStats(s,h.id);s.heroLevels[h.id]=20;const high=getCharacterStats(s,h.id);for(const stat of ['maxHp','physicalAtk','magicAtk','armor','resist','crit','attackSpeed','manaMax','rageMax','manaRegen','rageRegen'])assert.ok(high[stat]>low[stat],h.id+': '+stat);}
});
test('level and skill upgrade consume exact costs, persist changes and reject missing resources',()=>{
 const s=rich(),next=levelUpHero(s,'wukong');assert.equal(next.heroLevels.wukong,2);assert.equal(s.heroLevels.wukong,1);assert.equal(next.coins,s.coins-50);assert.equal(next.heroXP.wukong,s.heroXP.wukong-45);
 assert.throws(()=>levelUpHero({...s,coins:0},'wukong'));assert.throws(()=>levelUpHero({...s,heroLevels:{...s.heroLevels,wukong:60}},'wukong'));
 const skill=levelUpSkill(s,'wukong');assert.equal(skill.skillLevels.wukong,2);assert.equal(skill.essence,s.essence-20);assert.throws(()=>levelUpSkill({...s,essence:0},'wukong'));
});
test('equipment adds stats, enhancement improves bonuses, slots and unique ownership are enforced',()=>{
 let s=rich();const naked=getCharacterStats(s,'zhaoyun');const sword=s.inventory.find(i=>i.templateId==='bronze-sword');s=equipItem(s,'zhaoyun','weapon',sword.id);const equipped=getCharacterStats(s,'zhaoyun');assert.ok(equipped.physicalAtk>naked.physicalAtk);
 s=enhanceItem(s,sword.id);assert.ok(getCharacterStats(s,'zhaoyun').physicalAtk>equipped.physicalAtk);assert.throws(()=>equipItem(s,'bajie','weapon',sword.id));assert.throws(()=>equipItem(s,'zhaoyun','helmet',sword.id));
 s=equipItem(s,'zhaoyun','weapon','');s=equipItem(s,'bajie','weapon',sword.id);assert.ok(validProgression(s));
 s=forgeItem(s,'signature-wukong');const personal=s.inventory.at(-1);assert.throws(()=>equipItem(s,'bajie','weapon',personal.id));s=equipItem(s,'wukong','weapon',personal.id);assert.ok(getCharacterStats(s,'wukong').physicalAtk>getCharacterStats(rich(),'wukong').physicalAtk);
});
test('stat caps hold even when high-level equipment stacks with strong passives',()=>{
 let s=rich(['pangu','wukong']);for(const template of ['stone-shell','mirror','blood-pearl','tiger-fang']){s=forgeItem(s,template);s.inventory.at(-1).level=10;}
 const find=t=>s.inventory.findLast(i=>i.templateId===t).id;
 s=equipItem(s,'pangu','relic',find('stone-shell'));assert.equal(getCharacterStats(s,'pangu').block,.7);
 s=equipItem(s,'pangu','relic',find('mirror'));assert.equal(getCharacterStats(s,'pangu').reflect,.5);
 s=equipItem(s,'wukong','relic',find('blood-pearl'));s=equipItem(s,'wukong','jewelry',find('tiger-fang'));assert.equal(getCharacterStats(s,'wukong').lifesteal,.5);
});
test('3×3 formation moves and replaces characters without duplicates; supports all nine cells',()=>{
 let s=rich(ids.slice(0,9));assert.equal(s.team.length,9);for(let i=0;i<9;i++)s=assignFormation(s,ids[i],i);assert.deepEqual(s.formation,ids.slice(0,9));
 s=assignFormation(s,ids[0],8);assert.equal(s.formation[8],ids[0]);assert.equal(s.formation[0],ids[8]);assert.equal(new Set(s.team).size,9);
 s=assignFormation(s,ids[9],4);assert.equal(s.formation[4],ids[9]);assert.ok(!s.team.includes(ids[4]));assert.ok(validKingdomState(s));
 s=toggleFormation(s,ids[9]);assert.equal(s.formation[4],null);assert.equal(s.team.length,8);assert.throws(()=>assignFormation(s,ids[10],9));
});
test('imports reject invalid levels, duplicate equipment and malformed formation; v3 progress migrates',()=>{
 const s=rich();assert.ok(validKingdomState(s));const bad=structuredClone(s);bad.inventory[1].id=bad.inventory[0].id;assert.equal(validKingdomState(bad),false);
 assert.equal(validKingdomState({...s,heroLevels:{wukong:61}}),false);assert.equal(validKingdomState({...s,heroLevels:{__invalid:3}}),false);
 const dup=structuredClone(s);dup.formation[8]=dup.formation[0];assert.equal(validKingdomState(dup),false);
 const old=structuredClone(s);for(const k of ['revision','formation','heroLevels','heroXP','skillLevels','heroGear','inventory','nextItemId','essence'])delete old[k];const migrated=migrateKingdom(old);assert.ok(validKingdomState(migrated));assert.deepEqual(new Set(migrated.team),new Set(old.team));assert.equal(migrated.heroLevels.wukong,1);
});
test('new gacha selects all grades and highest-grade pity still guarantees SSR at 30',()=>{
 const mids=[.005,.025,.07,.15,.3,.52,.75,.94];for(let i=0;i<gradeOrder.length;i++){const pull=pullCharacters(rich(),1,()=>mids[i]);assert.equal(pull.results[0].grade,gradeOrder[i]);}
 const s=rich();s.pity=29;const forced=pullCharacters(s,1,()=>.99);assert.equal(forced.results[0].grade,'SSR');assert.equal(forced.state.pity,0);assert.equal(forced.state.essence,s.essence+10);
});

for(const h of characterRoster)test(h.id+': signature skill executes and consumes the correct resource',()=>{
 const team=[h.id,...ids.filter(id=>id!==h.id).slice(0,8)],b=arena(team),u=ready(b,h.id);for(const ally of b.allies)ally.hp=ally.maxHp*.4;
 const beforeResource=u[u.resource],next=castTactics(b,u.key),actor=next.allies.find(t=>t.key===u.key);
 assert.equal(actor[u.resource],beforeResource-u.skillCost);assert.ok(actor.cooldown>0);assert.ok(next.events.some(e=>e.actor===h.id&&e.kind===h.fx));assert.equal(u[u.resource],beforeResource);
 if(h.skill.operations.some(o=>o.effect==='damage'))assert.ok(next.damageStats.physical+next.damageStats.magic>0,h.id);
 if(h.skill.operations.some(o=>o.effect==='heal'))assert.ok(next.damageStats.healing>0,h.id);
});
test('block, reflection and lifesteal enforce caps on actual damage without feedback loops',()=>{
 let b=arena(),a=b.allies[0],d=b.enemies[0];d.block=.99;let r=tacticsHit(b,a,d,1,'pure',{raw:100});assert.equal(r.blocked,70);assert.equal(r.damage,30);
 b=arena();a=b.allies[0];d=b.enemies[0];a.hp=a.maxHp=1000;d.reflect=.99;a.reflect=.99;tacticsHit(b,a,d,1,'pure',{raw:100});assert.equal(a.hp,950);assert.equal(b.damageStats.reflected,50);assert.equal(d.hp,9900);
 b=arena();a=b.allies[0];d=b.enemies[0];a.hp=20;a.maxHp=100;a.lifesteal=.99;r=tacticsHit(b,a,d,1,'pure',{raw:100});assert.equal(r.damage,100);assert.equal(a.hp,70);assert.equal(b.damageStats.healing,50);
});
test('shields cap at 30% for self and 15% for allies and do not stack',()=>{
 const b=arena(),a=b.allies[0],d=b.allies[1];a.maxHp=d.maxHp=1000;
 tacticsShield(b,a,a,99999);assert.equal(a.shield,300);tacticsShield(b,a,a,99999);assert.equal(a.shield,300);
 tacticsShield(b,a,d,99999);assert.equal(d.shield,150);tacticsShield(b,a,d,99999);assert.equal(d.shield,150);
 const before=d.hp;const hit=tacticsHit(b,b.enemies[0],d,1,'pure',{raw:100,noProc:true});assert.equal(hit.absorbed,100);assert.equal(d.hp,before);
});
test('damage immunity still accepts debuffs; invincibility cleanses, prevents debuffs and all outgoing damage',()=>{
 const b=arena(),a=b.allies[0],d=b.enemies[0];tacticsStatus(d,'immune',3);assert.equal(tacticsHit(b,a,d,1,'pure',{raw:100}).damage,0);assert.ok(tacticsStatus(d,'stun',2));assert.ok(tacticsStatus(d,'burn',3,50,a));assert.ok(d.effects.burn);
 tacticsStatus(d,'boost',4);tacticsStatus(d,'invincible',3);assert.equal(d.effects.burn,undefined);assert.equal(d.effects.stun,undefined);assert.ok(d.effects.boost);assert.equal(tacticsStatus(d,'slow',3),false);assert.equal(tacticsHit(b,d,a,1,'pure',{raw:100}).damage,0);
 tacticsStatus(a,'invincible',3);tacticsStatus(b.enemies[1],'burn',5,100,a);const hp=b.enemies[1].hp;const next=tickTactics(b,.5,false);assert.equal(next.enemies[1].hp,hp);
});
test('regeneration triggers only below half HP and burning halves all incoming healing',()=>{
 const b=arena(),u=b.allies[0];u.hp=400;u.maxHp=1000;u.regen=.025;const next=tickTactics(b,1,false);assert.equal(next.allies[0].hp,425);
 u.hp=600;assert.equal(tickTactics(b,1,false).allies[0].hp,600);
 u.hp=400;tacticsStatus(u,'burn',4,0,b.enemies[0]);assert.equal(tacticsHeal(b,u,u,100,true),50);assert.equal(u.hp,450);
});
test('revival happens once with 30% HP; execute is strict below 10% and respects immunity',()=>{
 const b=arena(),a=b.allies[0],d=b.enemies[0];d.hp=50;d.maxHp=1000;d.revive=true;tacticsHit(b,a,d,1,'pure',{raw:5000,noProc:true});assert.equal(d.hp,300);assert.ok(d.revived);tacticsHit(b,a,d,1,'pure',{raw:5000,noProc:true});assert.equal(d.hp,0);assert.equal(b.damageStats.revives,1);
 const e=b.enemies[1];e.hp=99;e.maxHp=1000;e.shield=999;a.execute=true;let r=tacticsHit(b,a,e,1,'physical',{raw:1});assert.ok(r.execute);assert.equal(e.hp,0);
 const f=b.enemies[2];f.hp=100;f.maxHp=1000;r=tacticsHit(b,a,f,1,'pure',{raw:1});assert.equal(Boolean(r.execute),false);f.hp=1;f.immune=2;assert.equal(tacticsHit(b,a,f).damage,0);assert.equal(f.hp,1);
});
test('slow affects attack cadence, stun prevents actions and mana fatigue halves only mana recovery',()=>{
 const b=arena(['zhugeliang','zhaoyun']),a=b.allies[0];a.resource='mana';a.mana=0;a.manaMax=1000;a.manaRegen=20;a.skillCost=9999;
 assert.equal(tickTactics(b,1,false).allies[0].mana,20);tacticsStatus(a,'manaLock',3);assert.equal(tickTactics(b,1,false).allies[0].mana,10);
 delete a.effects.manaLock;a.attackTimer=0;a.attackSpeed=1;const count=next=>next.events.filter(e=>e.kind==='attack'&&e.actor===a.id&&e.side==='ally').length;
 const normal=count(tickTactics(b,4,false));tacticsStatus(a,'slow',5);assert.ok(count(tickTactics(b,4,false))<normal);tacticsStatus(a,'stun',5);assert.equal(count(tickTactics(b,4,false)),0);
});
test('front/middle/back targeting protects lines, while assassins prioritize weak back-line targets',()=>{
 const units=Array.from({length:9},(_,slot)=>({slot,hp:100,maxHp:100}));assert.equal(tacticsTarget(units,2).slot,2);units[2].hp=0;assert.ok(tacticsTarget(units,2).slot<3);for(let i=0;i<3;i++)units[i].hp=0;assert.ok(tacticsTarget(units,0).slot>=3&&tacticsTarget(units,0).slot<6);units[7].hp=10;assert.equal(tacticsTarget(units,0,true).slot,7);
});
test('skill rank increases real damage and all-target skills cover a nine-unit formation',()=>{
 const b=arena(['lubu',...ids.filter(id=>id!=='lubu').slice(0,8)]),u=ready(b,'lubu');const one=castTactics(b,u.key);u.skillLevel=5;const five=castTactics(b,u.key);assert.ok(five.damageStats.physical>one.damageStats.physical);assert.equal(five.enemies.length,9);assert.ok(five.enemies.every(u=>u.hp<10000));
});
test('new combat and progression settle once and survive durable save/import',()=>{
 let s=kingdomInitial();s=dispatchMarch(s,'camp1');for(let i=0;i<200&&s.march;i++)s=worldTick(s,1);
 assert.equal(s.battle.winner,'ally');assert.equal(s.wins,1);assert.equal(s.coins,2000);assert.ok(s.essence>100);for(const id of s.team)assert.equal(s.heroXP[id],120);
 const save=durableSave(s);assert.ok(validKingdomState(save));const restored=migrateKingdom(JSON.parse(JSON.stringify(save)));assert.deepEqual(restored.heroLevels,save.heroLevels);assert.deepEqual(restored.inventory,save.inventory);assert.deepEqual(restored.formation,save.formation);
});
for(const [bond,team,caster]of [
 ['pilgrimage',['wukong','bajie'],'wukong'],['shu',['zhugeliang','zhaoyun'],'zhugeliang'],['generals',['guanyu','zhaoyun'],'guanyu'],['investiture',['nezha','erlang'],'nezha'],['sworn',['liubei','guanyu','zhangfei'],'liubei'],['moon',['houyi','change'],'houyi'],
])test(bond+': partners trigger a real extra attack or heal, not only a label',()=>{
 const b=arena(team);b.bonds=[bond];for(const u of b.allies)u.hp=4000;if(bond==='investiture')tacticsStatus(b.enemies[0],'marked',5,0,b.allies.find(u=>u.id==='erlang'));const u=ready(b,caster);const plain=structuredClone(b);plain.bonds=[];
 const linked=castTactics(b,u.key),base=castTactics(plain,u.key);assert.ok(linked.events.some(e=>e.kind==='combo'));
 if(bond==='moon')assert.ok(linked.damageStats.healing>base.damageStats.healing);else assert.ok(linked.damageStats.physical+linked.damageStats.magic>base.damageStats.physical+base.damageStats.magic);
});
test('tigers and pilgrims grant actual team-wide passive stat bonuses',()=>{
 const team=['guanyu','zhangfei','zhaoyun','machao','huangzhong','wukong','bajie','shawujing','tangsanzang'],s=rich(team),node={id:'stats',name:'Thử buff',level:1,enemies:['lusu']};
 const base=createTacticsBattle(s,node,[],{bonus:0}),buff=createTacticsBattle(s,node,['tigers','pilgrims'],{bonus:0});for(const u of buff.allies){const old=base.allies.find(t=>t.id===u.id);assert.ok(u.physicalAtk>old.physicalAtk);assert.ok(u.resist>old.resist);assert.ok(u.manaRegen>old.manaRegen);}
});
test('simulation duration is independent of small frame delta partitioning',()=>{
 const b=arena();const one=tickTactics(b,1,false);let parts=b;for(let i=0;i<20;i++)parts=tickTactics(parts,.05,false);assert.equal(one.clock,1);assert.equal(parts.clock,1);assert.deepEqual(parts.allies,one.allies);assert.equal(parts.accumulator,one.accumulator);
});
