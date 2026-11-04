import { characterRoster, characterById } from './characters.mjs';
import { getCharacterStats, normalizeProgression, defaultFormation } from './progression.mjs';

const tAlive=units=>units.filter(u=>u.hp>0);
const tWeak=units=>tAlive(units).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
const tRound=n=>Math.round(n*10)/10;
const tBad=['burn','stun','slow','manaLock','exposed','marked'];
function tEffect(u,key){return u.effects[key]?.remaining>0?u.effects[key]:null;}
function tSync(u){
 for(const k of ['burn','stun','slow','manaLock','exposed','marked','boost'])u[k]=tEffect(u,k)?.remaining||0;
 u.resourceLabel=u.resource==='mana'?'Mana':'Nộ';u.energy=Math.min(100,Math.floor(u[u.resource]/u.skillCost*100));
 u.canCast=u.hp>0&&u[u.resource]>=u.skillCost&&u.cooldown<=0&&!u.stun&&u.invincible<=0;
}
function tEvent(b,kind,actor,text,targets=[]){b.events.push({serial:++b.serial,at:b.clock,kind,actor:actor?.id||null,side:actor?.side||'ally',text,targets});b.events=b.events.slice(-72);if(text){b.log.push(text);b.log=b.log.slice(-40);}}
function tRandom(b){b.rng=(Math.imul(1664525,b.rng)+1013904223)>>>0;return b.rng/4294967296;}
function tUnit(state,id,side,slot){
 const h=characterById[id],s=getCharacterStats(state,id,slot),resource=h.resource;
 return {...s,id,name:h.name,side,slot,key:side+'-'+slot,element:h.element,roles:h.roles,resource,skillCost:Math.round(h.skill.cost*100),skillLevel:state.skillLevels?.[id]||1,hp:s.maxHp,atk:s.physicalAtk,mana:resource==='mana'?s.manaMax*.35:0,rage:resource==='rage'?s.rageMax*.35:0,shield:0,shieldTime:0,immune:0,invincible:0,revived:false,cooldown:0,attackTimer:.35+slot*.035,effects:{},damageDealt:0,healingDone:0,energy:0,canCast:false};
}
export function createTacticsBattle(source,node,bondIds=[],resonance={bonus:0}){
 const state=normalizeProgression(source),formation=state.formation;
 const allies=formation.map((id,i)=>id?tUnit(state,id,'ally',i):null).filter(Boolean);
 const enemyIds=node.enemies.slice(0,9),enemyFormation=defaultFormation(enemyIds);
 const foeState={...state,team:enemyIds,formation:enemyFormation,heroGear:{},overrides:{},heroLevels:Object.fromEntries(enemyIds.map(id=>[id,Math.max(1,node.level*2)])),skillLevels:Object.fromEntries(enemyIds.map(id=>[id,Math.min(5,node.level)]))};
 const enemies=enemyFormation.map((id,i)=>id?tUnit(foeState,id,'enemy',i):null).filter(Boolean);
 for(const u of allies){const army=1+(state.levels?.barracks||1)*.05;const hp=army*(1+(bondIds.includes('pilgrimage')?.15:0)+resonance.bonus+(bondIds.includes('sworn')?.1:0));const atk=army*(1+(bondIds.includes('shu')?.12:0)+resonance.bonus+(bondIds.includes('tigers')?.15:0));u.maxHp=Math.round(u.maxHp*hp);u.physicalAtk=Math.round(u.physicalAtk*atk);u.magicAtk=Math.round(u.magicAtk*atk);if(state.troopType==='shield')u.maxHp=Math.round(u.maxHp*1.12);if(state.troopType==='bow'||state.troopType==='spear')u.physicalAtk=Math.round(u.physicalAtk*(state.troopType==='bow'?1.1:1.05));if(state.troopType==='cavalry')u[u.resource]+=15;if(bondIds.includes('tigers'))u.crit=Math.min(.75,u.crit+.05);if(bondIds.includes('moon'))u.healPower+=.1;if(bondIds.includes('pilgrims')){u.resist=Math.round(u.resist*1.15);u.manaRegen*=1.1;}u.hp=u.maxHp;u.atk=u.physicalAtk;tSync(u);}
 for(const u of enemies){const factor=.65+node.level*.15;u.maxHp=Math.round(u.maxHp*factor);u.hp=u.maxHp;u.physicalAtk=Math.round(u.physicalAtk*factor);u.magicAtk=Math.round(u.magicAtk*factor);u.atk=u.physicalAtk;tSync(u);}
 return {rulesVersion:4,nodeId:node.id,troopType:state.troopType||'shield',enemyTroopType:['spear','cavalry','bow'][node.level-1],allies,enemies,bonds:bondIds,clock:0,accumulator:0,dragonEnergy:0,winner:null,rng:node.level*999+state.team.join('').split('').reduce((n,c)=>n+c.charCodeAt(0),0),damageStats:{physical:0,magic:0,pure:0,absorbed:0,blocked:0,reflected:0,healing:0,revives:0,executions:0,criticals:0},events:[],serial:0,log:['Giao chiến tại '+node.name+' · đội hình 3×3.']};
}
export function tacticsTarget(units,column=0,assassin=false){
 const alive=tAlive(units);if(!alive.length)return undefined;
 const row=assassin?Math.max(...alive.map(u=>Math.floor(u.slot/3))):Math.min(...alive.map(u=>Math.floor(u.slot/3)));
 const candidates=alive.filter(u=>Math.floor(u.slot/3)===row);
 return assassin?tWeak(candidates):candidates.find(u=>u.slot%3===column%3)||tWeak(candidates);
}
function tTargets(b,actor,target){
 const own=actor.side==='ally'?b.allies:b.enemies,foes=actor.side==='ally'?b.enemies:b.allies;
 if(target==='self')return actor.hp>0?[actor]:[];
 if(target==='allyAll')return tAlive(own);
 if(target==='weakAlly')return tWeak(own)?[tWeak(own)]:[];
 if(target==='enemyAll')return tAlive(foes);
 if(target==='enemyWeak')return tWeak(foes)?[tWeak(foes)]:[];
 const alive=tAlive(foes);if(!alive.length)return [];
 if(target==='enemyColumn'){const first=tacticsTarget(foes,actor.slot%3);return alive.filter(u=>u.slot%3===first.slot%3);}
 const row=target==='enemyBack'?Math.max(...alive.map(u=>Math.floor(u.slot/3))):Math.min(...alive.map(u=>Math.floor(u.slot/3)));
 return alive.filter(u=>Math.floor(u.slot/3)===row);
}
export function tacticsHeal(b,source,target,amount,raw=false){
 if(!target||target.hp<=0)return 0;
 const actual=Math.min(target.maxHp-target.hp,amount*(raw?1:1+(source?.healPower||0))*(tEffect(target,'burn')?.5:1));
 const before=target.hp;target.hp=Math.min(target.maxHp,tRound(target.hp+(raw?Math.floor(actual*10+1e-8)/10:actual)));const healed=tRound(target.hp-before);
 b.damageStats.healing=tRound(b.damageStats.healing+healed);if(source)source.healingDone=tRound((source.healingDone||0)+healed);return healed;
}
export function tacticsShield(b,source,target,amount,duration=6){
 if(!target||target.hp<=0)return 0;const cap=Math.floor(target.maxHp*(source?.key===target.key?.3:.15));
 const shield=Math.min(cap,Math.round(amount));if(shield>target.shield)target.shield=shield;target.shieldTime=Math.max(target.shieldTime,duration);return shield;
}
export function tacticsStatus(target,effect,duration=4,value=0,source=null){
 if(!target||target.hp<=0)return false;
 if(target.invincible>0&&tBad.includes(effect))return false;
 if(effect==='immune'){target.immune=Math.max(target.immune,duration);return true;}
 if(effect==='invincible'){for(const key of tBad)delete target.effects[key];target.invincible=Math.max(target.invincible,duration);tSync(target);return true;}
 target.effects[effect]={remaining:Math.max(target.effects[effect]?.remaining||0,duration),value,sourceKey:source?.key||null};tSync(target);return true;
}
function tRevive(b,u){if(u.hp<=0&&u.revive&&!u.revived){u.revived=true;u.hp=Math.round(u.maxHp*.3);u.effects={};u.shield=0;u.cooldown=1;u.rage=0;u.mana=Math.min(u.mana,u.manaMax*.2);b.damageStats.revives++;tEvent(b,'revive',u,u.name+' hồi sinh với 30% HP.');tSync(u);}}
export function tacticsHit(b,actor,target,power=1,type='physical',options={}){
 if(!target||target.hp<=0||!actor||actor.invincible>0||target.immune>0||target.invincible>0)return{damage:0,absorbed:0,blocked:0};
 const execute=!options.noProc&&actor.execute&&target.hp/target.maxHp<.1;
 let crit=false,amount;
 if(execute){amount=target.hp;target.shield=0;b.damageStats.executions++;tEvent(b,'execute',actor,actor.name+' kết liễu '+target.name+'!', [target.key]);}
 else if(options.raw!==undefined){const defense=type==='magic'?target.resist:type==='physical'?target.armor:0;amount=Math.max(0,Math.floor(options.raw*100/(100+Math.max(0,defense))*10+1e-8)/10);}
 else{
  crit=!options.noCrit&&tRandom(b)<actor.crit;
  const attack=type==='magic'?actor.magicAtk:actor.physicalAtk,defense=type==='magic'?target.resist:target.armor*(tEffect(target,'exposed')?.75:1);
  const elemental={Hỏa:'Mộc',Mộc:'Thủy',Thủy:'Hỏa'}[actor.element]===target.element?1.25:1;
  const a=actor.side==='ally'?b.troopType:b.enemyTroopType,d=actor.side==='ally'?b.enemyTroopType:b.troopType;
  const counter={shield:'spear',spear:'cavalry',cavalry:'bow',bow:'shield'}[a]===d?1.2:1;
  const strength=.6+.4*Math.max(0,actor.hp/actor.maxHp);
  amount=Math.max(1,Math.round(attack*power*100/(100+Math.max(0,defense))*elemental*counter*strength*(tEffect(actor,'boost')?1.2:1)*(tEffect(target,'marked')?1.25:1)*(target.side==='ally'&&b.bonds.includes('generals')?.9:1)*(crit?1.5:1)));
 }
 const blocked=execute||options.noProc?0:Math.floor(amount*Math.min(.7,target.block));amount-=blocked;
 const absorbed=execute?0:Math.min(target.shield,amount);target.shield-=absorbed;
 const damage=Math.min(target.hp,Math.max(0,amount-absorbed));target.hp=tRound(target.hp-damage);
 b.damageStats[type]=tRound((b.damageStats[type]||0)+damage);b.damageStats.absorbed=tRound(b.damageStats.absorbed+absorbed);b.damageStats.blocked+=blocked;if(crit)b.damageStats.criticals++;
 actor.damageDealt=tRound((actor.damageDealt||0)+damage);actor.lastHit={damage,critical:crit};
 if(damage>0&&target.resource==='rage'&&!options.noProc)target.rage=Math.min(target.rageMax,target.rage+target.rageMax*.07);
 tRevive(b,target);
 if(damage>0&&!options.noProc){
  if(actor.lifesteal>0&&actor.hp>0)tacticsHeal(b,actor,actor,damage*Math.min(.5,actor.lifesteal),true);
  const reflected=Math.min(damage*.5,damage*target.reflect);
  if(reflected>0&&actor.hp>0&&target.invincible<=0){const r=tacticsHit(b,target,actor,1,'pure',{raw:reflected,noProc:true,noCrit:true});b.damageStats.reflected=tRound(b.damageStats.reflected+r.damage);}
 }
 tSync(actor);tSync(target);return{damage,absorbed,blocked,critical:crit,execute};
}
function tFinish(b){if(!tAlive(b.enemies).length)b.winner='ally';else if(!tAlive(b.allies).length)b.winner='enemy';else if(b.clock>=180)b.winner='enemy';}
function tCombo(b,actor){
 if(actor.side!=='ally'||actor.hp<=0)return;
 const partner=id=>b.allies.find(u=>u.id===id&&u.hp>0&&!u.stun&&u.invincible<=0);
 if(actor.id==='wukong'&&b.bonds.includes('pilgrimage')&&partner('bajie')){for(const t of tAlive(b.enemies))tacticsHit(b,partner('bajie'),t,.5,'physical');tEvent(b,'combo',actor,'COMBO · Đồng Hành Thỉnh Kinh!');}
 if(actor.id==='zhugeliang'&&b.bonds.includes('shu')&&partner('zhaoyun')){tacticsHit(b,partner('zhaoyun'),tWeak(b.enemies),1.8,'physical');tEvent(b,'combo',actor,'COMBO · Long Đảm Ngọa Long!');}
 if(actor.id==='guanyu'&&b.bonds.includes('generals')&&partner('zhaoyun')){for(const t of tAlive(b.enemies))tacticsHit(b,actor,t,.7,'physical');tEvent(b,'combo',actor,'COMBO · Hổ Tướng Thục Hán!');}
 if(actor.id==='nezha'&&b.bonds.includes('investiture')&&partner('erlang')){const marked=tAlive(b.enemies).filter(u=>tEffect(u,'marked'));if(marked.length){for(const t of marked)tacticsHit(b,partner('erlang'),t,1.2,'magic');tEvent(b,'combo',actor,'COMBO · Song Thần Phạt Trụ!');}}
 if(actor.id==='liubei'&&b.bonds.includes('sworn')&&partner('guanyu')){for(const t of tAlive(b.enemies).filter(u=>Math.floor(u.slot/3)===0))tacticsHit(b,partner('guanyu'),t,1,'physical');tEvent(b,'combo',actor,'COMBO · Đào Viên Kết Nghĩa!');}
 if(actor.id==='houyi'&&b.bonds.includes('moon')&&partner('change')){for(const u of tAlive(b.allies))tacticsHeal(b,partner('change'),u,u.maxHp*.08);tEvent(b,'combo',actor,'COMBO · Nhật Nguyệt Tương Phùng!');}
}
function tCast(b,actor){
 tSync(actor);if(!actor.canCast||b.winner)return false;
 const h=characterById[actor.id];actor[actor.resource]-=actor.skillCost;actor.cooldown=h.skill.cooldown;const rank=actor.skillLevel-1,targets=new Set();
 for(const op of h.skill.operations){if(actor.hp<=0)break;for(const target of tTargets(b,actor,op.target)){
  targets.add(target.key);
  if(op.effect==='damage')tacticsHit(b,actor,target,op.scale*(1+.08*rank),op.damageType);
  else if(op.effect==='heal')tacticsHeal(b,actor,target,target.maxHp*op.value*(1+.04*rank));
  else if(op.effect==='shield')tacticsShield(b,actor,target,target.maxHp*op.value*(1+.04*rank),op.duration);
  else tacticsStatus(target,op.effect,op.duration+rank*.25,op.effect==='burn'?actor.magicAtk*op.value*(1+.08*rank):op.value,actor);
 }}
 tEvent(b,h.fx,actor,actor.name+': '+h.skill.name,[...targets]);tCombo(b,actor);tSync(actor);tFinish(b);return true;
}
export function castTactics(battle,key){const b=structuredClone(battle),u=[...b.allies,...b.enemies].find(u=>u.key===key);if(!u||!tCast(b,u))throw new Error('Chưa đủ mana/nộ, đang hồi chiêu, bị choáng hoặc đang vô địch.');return b;}
export function tickTactics(battle,delta,autoSkill=true,dragon='Hỏa',dragonLevel=1){
 const b=structuredClone(battle);if(b.winner)return b;b.accumulator+=Math.max(0,Math.min(5,delta));
 while(b.accumulator>=.099999&&!b.winner){b.accumulator=Math.max(0,b.accumulator-.1);b.clock=tRound(b.clock+.1);
  const all=[...b.allies,...b.enemies];
  for(const u of all){if(u.hp<=0)continue;
   u.immune=Math.max(0,u.immune-.1);u.invincible=Math.max(0,u.invincible-.1);u.cooldown=Math.max(0,u.cooldown-.1);u.shieldTime=Math.max(0,u.shieldTime-.1);if(u.shieldTime===0)u.shield=0;
   if(tEffect(u,'burn')){const burn=tEffect(u,'burn'),source=all.find(t=>t.key===burn.sourceKey);if(source)tacticsHit(b,source,u,1,'magic',{raw:burn.value*.1,noProc:true,noCrit:true});}
   if(u.hp<=0)continue;
   if(u.regen>0&&u.hp<u.maxHp*.5)tacticsHeal(b,u,u,u.maxHp*u.regen*.1,true);
   if(u.resource==='mana')u.mana=Math.min(u.manaMax,u.mana+u.manaRegen*.1*(tEffect(u,'manaLock')?.5:1));
   else u.rage=Math.min(u.rageMax,u.rage+u.rageRegen*.1);
   const stunned=Boolean(tEffect(u,'stun')),invincible=u.invincible>0;
   if(!stunned&&!invincible){
    u.attackTimer-=.1*(tEffect(u,'slow')?.65:1);
    if(u.attackTimer<=0){u.attackTimer+=1/u.attackSpeed;const foes=u.side==='ally'?b.enemies:b.allies,target=tacticsTarget(foes,u.slot%3,u.roles.includes('assassin'));if(target){const result=tacticsHit(b,u,target,.55,'physical');if(u.resource==='rage')u.rage=Math.min(u.rageMax,u.rage+u.rageMax*.18*(u.side==='ally'&&b.bonds.includes('investiture')?1.2:1));tEvent(b,'attack',u,'',[target.key]);b.events[b.events.length-1].critical=result.critical;}}
    tSync(u);if((u.side==='enemy'||autoSkill)&&u.canCast)tCast(b,u);
   }
   for(const [key,effect]of Object.entries(u.effects)){effect.remaining-=.1;if(effect.remaining<=.00001)delete u.effects[key];}tSync(u);
  }
  tFinish(b);if(b.winner)break;
  b.dragonEnergy+=1;
  if(b.dragonEnergy>=100){b.dragonEnergy=0;const avg=b.allies.reduce((n,u)=>n+u.level,0)/b.allies.length,power=25+dragonLevel*10+avg*5;const source={id:'dragon',key:'dragon',side:'ally',hp:1,maxHp:1,physicalAtk:power,magicAtk:power,armor:0,resist:0,crit:0,block:0,reflect:0,lifesteal:0,element:dragon,effects:{},immune:0,invincible:0,resource:'mana',mana:0,manaMax:100,rage:0,rageMax:100,skillCost:100,cooldown:0};if(dragon==='Hỏa')for(const u of tAlive(b.enemies))tacticsHit(b,source,u,1,'magic',{noProc:true});if(dragon==='Thủy')for(const u of tAlive(b.allies))tacticsHeal(b,source,u,power);if(dragon==='Mộc')for(const u of tAlive(b.allies))tacticsShield(b,null,u,power);tEvent(b,'dragon',null,'LINH LONG · '+dragon+' long hỗ trợ toàn trận!');tFinish(b);}
 }
 b.accumulator=Math.round(b.accumulator*1000000)/1000000;return b;
}
