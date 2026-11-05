import {technologyBonus} from './technology.mjs';
import {activeAbilities} from './inheritance-data.mjs';
import {inheritanceCast,inheritanceTick,inheritanceSnapshot} from './inheritance-combat.mjs';
import {runeBonuses} from './runes.mjs';
import {troopStats,troopStatsAtLevel,applyTroopGrowth} from './troops.mjs';
import {skinBonus} from './skins.mjs';
import { realmBonus } from './realms.mjs';
import { vipBonuses, petBonus } from './account.mjs';
import { characterRoster, characterById } from './characters.mjs';
import { getCharacterStats, getSkillRank, normalizeProgression, defaultFormation } from './progression.mjs';

const tAlive=units=>units.filter(u=>u.hp>0);
const tWeak=units=>tAlive(units).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp)[0];
const tRound=n=>Math.round(n*10)/10;
const tBad=['void','burn','stun','slow','manaLock','exposed','marked'];
function tEffect(u,key){return u.effects[key]?.remaining>0?u.effects[key]:null;}
function tSync(u){
 for(const k of ['void','burn','stun','slow','manaLock','exposed','marked','boost'])u[k]=tEffect(u,k)?.remaining||0;
 u.skillCooldowns??=(u.abilities||characterById[u.id]?.skills)?.map(()=>0)||[0];u.skillCooldowns[0]=u.cooldown||0;u.skillCosts??=(u.abilities||characterById[u.id]?.skills)?.map(s=>Math.round(s.cost*100))||[u.skillCost];u.readySkills=u.skillCosts.map((cost,i)=>u.hp>0&&u[u.resource]>=cost&&(u.skillCooldowns[i]||0)<=0&&!u.stun&&u.invincible<=0);
 u.resourceLabel=u.resource==='mana'?'Mana':'Nộ';u.energy=Math.min(100,Math.floor(u[u.resource]/u.skillCost*100));
 u.canCast=u.hp>0&&u[u.resource]>=u.skillCost&&u.cooldown<=0&&!u.stun&&u.invincible<=0;
}
function tEvent(b,kind,actor,text,targets=[]){b.events.push({serial:++b.serial,at:b.clock,kind,actor:actor?.id||null,side:actor?.side||'ally',text,targets});b.events=b.events.slice(-72);if(text){b.log.push(text);b.log=b.log.slice(-40);}}
function tRandom(b){b.rng=(Math.imul(1664525,b.rng)+1013904223)>>>0;return b.rng/4294967296;}
function tUnit(state,id,side,slot){
 const h=characterById[id],s=getCharacterStats(state,id,slot),resource=h.resource,abilities=activeAbilities(state,id);
 return {...s,abilities,id,name:h.name,side,slot,key:side+'-'+slot,element:h.element,roles:h.roles,resource,skillCost:Math.round(h.skill.cost*100),skillLevel:state.skillLevels?.[id]||1,skillRanks:abilities.map((_,i)=>i<h.skills.length?getSkillRank(state,id,i):1),skillCosts:abilities.map(s=>Math.round(s.cost*100)),skillCooldowns:abilities.map(()=>0),hp:s.maxHp,atk:s.physicalAtk,mana:resource==='mana'?s.manaMax*.35:0,rage:resource==='rage'?s.rageMax*.35:0,shield:0,shieldTime:0,immune:0,invincible:0,casts:0,divineActivations:0,divineRegen:0,darkEmpower:0,divinePath:h.divine.path,revived:false,cooldown:0,attackTimer:.35+slot*.035,effects:{},damageDealt:0,healingDone:0,damageTaken:0,absorbedDamage:0,blockedDamage:0,shieldCreated:0,criticalHits:0,reviveCount:0,deaths:0,controlApplications:0,activeSeconds:0,resourceSpent:0,abilityCasts:abilities.map(()=>0),damageByType:{physical:0,magic:0,pure:0},energy:0,canCast:false};
}
export function createTacticsBattle(source,node,bondIds=[],resonance={bonus:0}){
 const state=normalizeProgression(source),formation=state.formation;
 const allies=formation.map((id,i)=>id?tUnit(state,id,'ally',i):null).filter(Boolean);
 const enemyIds=node.enemies.slice(0,9),enemyFormation=defaultFormation(enemyIds);
 const foeState={...state,team:enemyIds,formation:enemyFormation,heroGear:{},heroSkillRanks:Object.fromEntries(enemyIds.map(id=>[id,{1:node.skillRank||1,2:node.skillRank||1,3:node.skillRank||1}])),account:{stars:{}},inheritance:{equipped:{},manuals:[]},overrides:{},heroLevels:Object.fromEntries(enemyIds.map(id=>[id,node.heroLevel??Math.max(1,node.level*2)])),skillLevels:Object.fromEntries(enemyIds.map(id=>[id,node.skillRank??Math.min(5,node.level)]))};
 const enemies=enemyFormation.map((id,i)=>id?tUnit(foeState,id,'enemy',i):null).filter(Boolean);
 for(const u of allies){const rune=runeBonuses(state),skin=skinBonus(state),realm=1+realmBonus(state),pet=petBonus(state),vip=vipBonuses(state);u.maxHp=Math.round(u.maxHp*realm*(1+(pet.health||0)+(skin.health||0)+(rune.health||0)));u.physicalAtk=Math.round(u.physicalAtk*realm*(1+(pet.physical||0)+(skin.physical||0)+(rune.physical||0)));u.magicAtk=Math.round(u.magicAtk*(1+(pet.magic||0)+(skin.magic||0)+(rune.magic||0)));u.armor*=1+vip.defense+(skin.armor||0)+(rune.armor||0);u.resist*=1+vip.defense+(skin.resist||0)+(rune.resist||0);if(pet.awakened==='phoenix'){u.regen=Math.min(.08,u.regen+.005);}if(pet.awakened==='tiger'){u.crit=Math.min(.75,u.crit+.05);u.critDamage+=.3;}if(pet.awakened==='tortoise')u.block=Math.min(.7,u.block+.05);u.physicalReduction=Math.min(.5,rune.physicalReduction||0);u.magicReduction=Math.min(.5,rune.magicReduction||0);u.block=Math.min(.7,u.block+(rune.block||0));u.reflect=Math.min(.5,u.reflect+(rune.reflect||0));u.lifesteal=Math.min(.5,u.lifesteal+(rune.lifesteal||0));u.regen=Math.min(.08,u.regen+(rune.regen||0));u.crit=Math.min(.75,u.crit+(rune.crit||0));u.attackSpeed=Math.min(3.5,u.attackSpeed*(1+(rune.attackSpeed||0)));u.manaRegen*=1+(rune.manaRegen||0);u.rageRegen*=1+(rune.rageRegen||0);u.healPower+=rune.healPower||0;u.shieldPower=rune.shieldPower||0;u.tenacity=Math.min(.7,u.tenacity+(rune.tenacity||0));u.revive=u.revive||Boolean(rune.revive);u.execute=u.execute||Boolean(rune.execute);u.immune=Math.max(u.immune,rune.immuneStart||0);u.invincible=Math.max(u.invincible,rune.invincibleStart||0);for(const key of ['burnChance','slowChance','stunChance','manaLockChance'])u[key]=rune[key]||0;const army=1+(state.levels?.barracks||1)*.05;const hp=army*(1+(bondIds.includes('pilgrimage')?.15:0)+resonance.bonus+(bondIds.includes('sworn')?.1:0));const atk=army*(1+(bondIds.includes('shu')?.12:0)+resonance.bonus+(bondIds.includes('tigers')?.15:0));u.maxHp=Math.round(u.maxHp*hp);u.physicalAtk=Math.round(u.physicalAtk*atk);u.magicAtk=Math.round(u.magicAtk*atk);if(state.troopType==='shield')u.maxHp=Math.round(u.maxHp*1.12);if(state.troopType==='bow'||state.troopType==='spear')u.physicalAtk=Math.round(u.physicalAtk*(state.troopType==='bow'?1.1:1.05));if(state.troopType==='cavalry')u[u.resource]+=15;if(bondIds.includes('tigers'))u.crit=Math.min(.75,u.crit+.05);if(bondIds.includes('moon'))u.healPower+=.1;if(bondIds.includes('pilgrims')){u.resist=Math.round(u.resist*1.15);u.manaRegen*=1.1;}applyTroopGrowth(u,troopStats(state));const inf=['shield','spear'].includes(state.troopType),ta=(inf?technologyBonus(state,'infantry','attack'):0)+(node.siege?technologyBonus(state,'city','attack'):0),td=(inf?technologyBonus(state,'infantry','defense'):0)+(node.siege?technologyBonus(state,'city','defense'):0);u.physicalAtk=Math.round(u.physicalAtk*(1+ta));u.magicAtk=Math.round(u.magicAtk*(1+ta));u.armor*=1+td;u.resist*=1+td;if(node.siege)u.maxHp=Math.round(u.maxHp*(1+technologyBonus(state,'city','health')));u.hp=u.maxHp;u.atk=u.physicalAtk;tSync(u);}
 const awakened=petBonus(state).awakened;if(awakened==='phoenix'&&allies.length)allies.slice().sort((a,b)=>a.maxHp-b.maxHp)[0].revive=true;if(awakened==='tortoise')for(const u of allies){u.shield=Math.floor(u.maxHp*.15);u.shieldTime=6;}
 for(const u of enemies){const factor=node.enemyScale??(.65+node.level*.15);u.maxHp=Math.round(u.maxHp*factor);u.hp=u.maxHp;u.physicalAtk=Math.round(u.physicalAtk*factor);u.magicAtk=Math.round(u.magicAtk*factor);applyTroopGrowth(u,troopStatsAtLevel(Math.min(100,node.enemyTroopLevel||node.heroLevel||node.level),['spear','cavalry','bow'][node.level-1]||'shield'));u.hp=u.maxHp;u.atk=u.physicalAtk;tSync(u);}
 return {rulesVersion:5,armyLevel:troopStats(state).level,nodeId:node.id,troopType:state.troopType||'shield',enemyTroopType:['spear','cavalry','bow'][node.level-1],allies,enemies,bonds:bondIds,clock:0,accumulator:0,temporalHistory:[],dragonEnergy:0,dragonStats:{damage:0,healing:0,shield:0,triggers:0},winner:null,rng:node.level*999+state.team.join('').split('').reduce((n,c)=>n+c.charCodeAt(0),0),damageStats:{physical:0,magic:0,pure:0,absorbed:0,blocked:0,reflected:0,healing:0,revives:0,executions:0,criticals:0,divine:0,dispelled:0},events:[],serial:0,log:['Giao chiến tại '+node.name+' · đội hình tối đa 4 tướng.']};
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
 const shield=Math.min(cap,Math.round(amount*(1+(source?.shieldPower||0))));if(source)source.shieldCreated=(source.shieldCreated||0)+Math.max(0,shield-target.shield);if(shield>target.shield)target.shield=shield;target.shieldTime=Math.max(target.shieldTime,duration);return shield;
}
export function tacticsStatus(target,effect,duration=4,value=0,source=null){
 if(!target||target.hp<=0)return false;
 if(target.invincible>0&&tBad.includes(effect))return false;
 if(effect==='immune'){target.immune=Math.max(target.immune,duration);return true;}
 const potency=source?.darkEmpower>0?1.5:1;if(tBad.includes(effect)){duration=Math.min(12,duration*potency*(1-(target.tenacity||0)));if(effect==='burn')value*=potency;}
 if(effect==='invincible'){for(const key of tBad)delete target.effects[key];target.invincible=Math.max(target.invincible,duration);tSync(target);return true;}
 if(source&&tBad.includes(effect))source.controlApplications=(source.controlApplications||0)+1;
 target.effects[effect]={remaining:Math.max(target.effects[effect]?.remaining||0,duration),value,potency,sourceKey:source?.key||null};tSync(target);return true;
}
function tRevive(b,u){if(u.hp<=0&&u.revive&&!u.revived){u.revived=true;u.reviveCount=(u.reviveCount||0)+1;u.hp=Math.round(u.maxHp*.3);u.effects={};u.shield=0;u.cooldown=1;u.rage=0;u.mana=Math.min(u.mana,u.manaMax*.2);b.damageStats.revives++;tEvent(b,'revive',u,u.name+' hồi sinh với 30% HP.');tSync(u);}}
export function tacticsHit(b,actor,target,power=1,type='physical',options={}){
 if(!target||target.hp<=0||!actor||actor.invincible>0||target.immune>0||target.invincible>0)return{damage:0,absorbed:0,blocked:0};
 if(!options.noProc&&!options.noDodge&&(target.dodge||0)>0&&tRandom(b)<target.dodge){tEvent(b,'miss',target,target.name+' né tránh!',[target.key]);return{damage:0,absorbed:0,blocked:0,dodged:true};}
 const execute=!options.noProc&&actor.execute&&target.hp/target.maxHp<.1;
 let crit=false,amount;
 if(execute){amount=target.hp;target.shield=0;b.damageStats.executions++;tEvent(b,'execute',actor,actor.name+' kết liễu '+target.name+'!', [target.key]);}
 else if(options.raw!==undefined){const defense=type==='magic'?target.resist:type==='physical'?target.armor:0;amount=Math.max(0,Math.floor(options.raw*100/(100+Math.max(0,defense))*10+1e-8)/10);}
 else{
  crit=!options.noCrit&&tRandom(b)<actor.crit;
  const attack=type==='magic'?actor.magicAtk:actor.physicalAtk,defense=type==='magic'?target.resist*(1-(actor.magicPen||0)):target.armor*(1-(actor.armorPen||0))*(1-(tEffect(target,'exposed')?Math.min(.7,.25*(tEffect(target,'exposed').potency||1)):0));
  const elemental={Hỏa:'Mộc',Mộc:'Thủy',Thủy:'Hỏa'}[actor.element]===target.element?1.25:1;
  const a=actor.side==='ally'?b.troopType:b.enemyTroopType,d=actor.side==='ally'?b.enemyTroopType:b.troopType;
  const counter={shield:'spear',spear:'cavalry',cavalry:'bow',bow:'shield'}[a]===d?1.2:1;
  const strength=.6+.4*Math.max(0,actor.hp/actor.maxHp);
  amount=Math.max(1,Math.round(attack*power*100/(100+Math.max(0,defense))*elemental*counter*strength*(tEffect(actor,'boost')?1.2:1)*(1+(tEffect(target,'marked')?Math.min(.75,.25*(tEffect(target,'marked').potency||1)):0))*(target.side==='ally'&&b.bonds.includes('generals')?.9:1)*(crit?(actor.critDamage||1.5):1)));
 }
 if(!execute&&type!=='pure')amount*=1-Math.min(.5,type==='magic'?target.magicReduction||0:target.physicalReduction||0);
 const blocked=execute||options.noProc?0:Math.floor(amount*Math.min(.7,target.block));amount-=blocked;
 if(!execute&&!options.noShare&&target.soulLinked>0){const friends=(target.side==='ally'?b.allies:b.enemies).filter(u=>u.key!==target.key&&u.hp>0).sort((a,b)=>b.hp-a.hp),ally=friends[0];if(ally){const share=Math.floor(amount*.15*10)/10;amount-=share;tacticsHit(b,actor,ally,1,'pure',{raw:share,noProc:true,noCrit:true,noShare:true});}}
 const absorbed=execute?0:Math.min(target.shield,amount);target.shield-=absorbed;
 const damage=Math.min(target.hp,Math.max(0,amount-absorbed));target.hp=tRound(target.hp-damage);
 b.damageStats[type]=tRound((b.damageStats[type]||0)+damage);b.damageStats.absorbed=tRound(b.damageStats.absorbed+absorbed);b.damageStats.blocked+=blocked;if(crit)b.damageStats.criticals++;
 target.damageTaken=tRound((target.damageTaken||0)+damage);target.absorbedDamage=tRound((target.absorbedDamage||0)+absorbed);target.blockedDamage=tRound((target.blockedDamage||0)+blocked);if(target.hp<=0)target.deaths=(target.deaths||0)+1;if(crit)actor.criticalHits=(actor.criticalHits||0)+1;actor.damageByType??={physical:0,magic:0,pure:0};actor.damageByType[type]=tRound((actor.damageByType[type]||0)+damage);actor.damageDealt=tRound((actor.damageDealt||0)+damage);actor.lastHit={damage,critical:crit};
 if(damage>0&&target.resource==='rage'&&!options.noProc)target.rage=Math.min(target.rageMax,target.rage+target.rageMax*.07);
 tRevive(b,target);
 if(damage>0&&!options.noProc){
  if(options.basic){if(actor.burnChance>0&&tRandom(b)<actor.burnChance)tacticsStatus(target,'burn',2,actor.magicAtk*.08,actor);if(actor.slowChance>0&&tRandom(b)<actor.slowChance)tacticsStatus(target,'slow',1.5,0,actor);if(actor.stunChance>0&&tRandom(b)<actor.stunChance)tacticsStatus(target,'stun',1,0,actor);if(actor.manaLockChance>0&&tRandom(b)<actor.manaLockChance)tacticsStatus(target,'manaLock',2,0,actor);}
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
function tDivine(b,actor){
 if(!actor.divineSet||actor.casts%3!==0)return;
 actor.divineActivations++;b.damageStats.divine=(b.damageStats.divine||0)+1;
 const divine=characterById[actor.id].divine;
 if(divine.path==='light'){actor.immune=Math.max(actor.immune,1);actor.divineRegen=1;tEvent(b,'divineLight',actor,'THẦN ÁNH SÁNG · '+divine.name+' · Miễn sát thương 1s, hồi 30% HP trong 1s.',[actor.key]);}
 else{actor.darkEmpower=6;const foes=actor.side==='ally'?b.enemies:b.allies;for(const target of tAlive(foes)){
  let removed=0;for(const key of ['boost'])if(target.effects[key]){delete target.effects[key];removed++;}
  for(const key of ['immune','invincible','shield','divineRegen','darkEmpower'])if(target[key]>0){target[key]=0;removed++;}target.shieldTime=0;
  b.damageStats.dispelled=(b.damageStats.dispelled||0)+removed;
  for(const [key,e]of Object.entries(target.effects))if(tBad.includes(key)){e.remaining=Math.min(12,e.remaining*1.5);e.potency=Math.min(2,(e.potency||1)*1.5);if(key==='burn')e.value*=1.5;}
  tacticsStatus(target,'void',4,actor.magicAtk*.4,actor);tSync(target);
 }tEvent(b,'divineDark',actor,'THẦN BÓNG TỐI · '+divine.name+' · Xóa buff, hư không sát thương 6s; tăng 50% thời gian và cường độ debuff trong 6s.',foes.filter(u=>u.hp>0).map(u=>u.key));}
}
function tCast(b,actor,skillIndex=0){
 tSync(actor);if(!Number.isInteger(skillIndex)||!actor.readySkills[skillIndex]||b.winner)return false;
 const h=characterById[actor.id],ability=(actor.abilities||h.skills)[skillIndex];actor[actor.resource]-=actor.skillCosts[skillIndex];actor.skillCooldowns[skillIndex]=ability.cooldown;if(skillIndex===0)actor.cooldown=ability.cooldown;const rank=(skillIndex===0?actor.skillLevel:actor.skillRanks?.[skillIndex]||1)-1,targets=new Set();actor.resourceSpent=(actor.resourceSpent||0)+actor.skillCosts[skillIndex];actor.abilityCasts??=(actor.abilities||h.skills).map(()=>0);actor.abilityCasts[skillIndex]++;actor.casts++;tDivine(b,actor);
 if(ability.manualEffect)inheritanceCast(b,actor,ability,{event:(kind,u,text,keys=[])=>tEvent(b,kind,u,text,keys),heal:(src,target,n,raw)=>tacticsHeal(b,src,target,n,raw),hit:(src,target,f,type,opt)=>tacticsHit(b,src,target,f,type,opt)});
 for(const op of ability.operations){if(actor.hp<=0)break;for(const target of tTargets(b,actor,op.target)){
  targets.add(target.key);
  if(op.effect==='damage')tacticsHit(b,actor,target,op.scale*(1+.08*rank),op.damageType);
  else if(op.effect==='heal')tacticsHeal(b,actor,target,target.maxHp*op.value*(1+.04*rank));
  else if(op.effect==='shield')tacticsShield(b,actor,target,target.maxHp*op.value*(1+.04*rank),op.duration);
  else tacticsStatus(target,op.effect,op.duration+rank*.25,op.effect==='burn'?actor.magicAtk*op.value*(1+.08*rank):op.value,actor);
 }}
 if(!ability.manualEffect&&actor.echoCharges>0&&actor.hp>0){actor.echoCharges--;for(const op of ability.operations)for(const target of tTargets(b,actor,op.target)){if(op.effect==='damage')tacticsHit(b,actor,target,op.scale*(1+.08*rank)*.4,op.damageType);else if(op.effect==='heal')tacticsHeal(b,actor,target,target.maxHp*op.value*(1+.04*rank)*.4);else if(op.effect==='shield')tacticsShield(b,actor,target,target.maxHp*op.value*.4,op.duration);else tacticsStatus(target,op.effect,op.duration*.4,op.effect==='burn'?actor.magicAtk*op.value*(1+.08*rank)*.4:op.value*.4,actor);}actor.echoes=(actor.echoes||0)+1;tEvent(b,'echo',actor,'Hóa thân lặp lại '+ability.name+' ở 40% sức mạnh.');}
 tEvent(b,ability.fx,actor,actor.name+': '+ability.name,[...targets]);if(skillIndex===0)tCombo(b,actor);tSync(actor);tFinish(b);return true;
}
export function castTactics(battle,key,skillIndex=0){const b=structuredClone(battle),u=[...b.allies,...b.enemies].find(u=>u.key===key);if(!u||!tCast(b,u,skillIndex))throw new Error('Chưa đủ mana/nộ, đang hồi chiêu, bị choáng hoặc đang vô địch.');return b;}
export function tickTactics(battle,delta,autoSkill=true,dragon='Hỏa',dragonLevel=1){
 const b=structuredClone(battle);if(b.winner)return b;b.accumulator+=Math.max(0,Math.min(5,delta));
 while(b.accumulator>=.099999&&!b.winner){b.accumulator=Math.max(0,b.accumulator-.1);b.clock=tRound(b.clock+.1);
  const all=[...b.allies,...b.enemies];
  for(const u of all){inheritanceTick(b,u,.1,{hit:(a,t,p,type,options)=>tacticsHit(b,a,t,p,type,options),event:(kind,a,text,keys=[])=>tEvent(b,kind,a,text,keys)});if(u.hp<=0)continue;u.activeSeconds=tRound((u.activeSeconds||0)+.1);
   if(u.divineRegen>0){tacticsHeal(b,u,u,u.maxHp*.3*Math.min(.1,u.divineRegen));u.divineRegen=Math.max(0,u.divineRegen-.1);}u.darkEmpower=Math.max(0,(u.darkEmpower||0)-.1);u.immune=Math.max(0,u.immune-.1);u.invincible=Math.max(0,u.invincible-.1);u.cooldown=Math.max(0,u.cooldown-.1);for(let i=1;i<(u.skillCooldowns?.length||0);i++)u.skillCooldowns[i]=Math.max(0,u.skillCooldowns[i]-.1);u.shieldTime=Math.max(0,u.shieldTime-.1);if(u.shieldTime===0)u.shield=0;
   if(tEffect(u,'burn')){const burn=tEffect(u,'burn'),source=all.find(t=>t.key===burn.sourceKey);if(source)tacticsHit(b,source,u,1,'magic',{raw:burn.value*.1,noProc:true,noCrit:true});}
   if(tEffect(u,'void')){const effect=tEffect(u,'void'),source=all.find(t=>t.key===effect.sourceKey);if(source)tacticsHit(b,source,u,1,'magic',{raw:effect.value*.1,noProc:true,noCrit:true});}
   if(u.hp<=0)continue;
   if(u.regen>0&&u.hp<u.maxHp*.5)tacticsHeal(b,u,u,u.maxHp*u.regen*.1,true);
   if(u.resource==='mana')u.mana=Math.min(u.manaMax,u.mana+u.manaRegen*.1*(1-(tEffect(u,'manaLock')?Math.min(.8,.5*(tEffect(u,'manaLock').potency||1)):0)));
   else u.rage=Math.min(u.rageMax,u.rage+u.rageRegen*.1);
   const stunned=Boolean(tEffect(u,'stun')),invincible=u.invincible>0;
   if(!stunned&&!invincible){
    u.attackTimer-=.1*(1-(tEffect(u,'slow')?Math.min(.7,.35*(tEffect(u,'slow').potency||1)):0));
    if(u.attackTimer<=0){u.attackTimer+=1/u.attackSpeed;const foes=u.side==='ally'?b.enemies:b.allies,target=tacticsTarget(foes,u.slot%3,u.roles.includes('assassin'));if(target){const result=tacticsHit(b,u,target,.55,'physical',{basic:true});if(u.resource==='rage')u.rage=Math.min(u.rageMax,u.rage+u.rageMax*.18*(u.side==='ally'&&b.bonds.includes('investiture')?1.2:1));tEvent(b,'attack',u,'',[target.key]);b.events[b.events.length-1].critical=result.critical;}}
    tSync(u);if(u.side==='enemy'||autoSkill){const index=u.readySkills.findIndex(Boolean);if(index>=0)tCast(b,u,index);}
   }
   for(const [key,effect]of Object.entries(u.effects)){effect.remaining-=.1;if(effect.remaining<=.00001)delete u.effects[key];}tSync(u);
  }
  inheritanceSnapshot(b);tFinish(b);if(b.winner)break;
  b.dragonEnergy+=1;
  if(b.dragonEnergy>=100){b.dragonEnergy=0;const avg=b.allies.reduce((n,u)=>n+u.level,0)/b.allies.length,power=25+dragonLevel*10+avg*5;const source={id:'dragon',key:'dragon',side:'ally',hp:1,maxHp:1,physicalAtk:power,magicAtk:power,armor:0,resist:0,crit:0,block:0,reflect:0,lifesteal:0,element:dragon,effects:{},immune:0,invincible:0,resource:'mana',mana:0,manaMax:100,rage:0,rageMax:100,skillCost:100,cooldown:0};if(dragon==='Hỏa')for(const u of tAlive(b.enemies))tacticsHit(b,source,u,1,'magic',{noProc:true});if(dragon==='Thủy')for(const u of tAlive(b.allies))tacticsHeal(b,source,u,power);if(dragon==='Mộc')for(const u of tAlive(b.allies))tacticsShield(b,source,u,power);b.dragonStats??={damage:0,healing:0,shield:0,triggers:0};b.dragonStats.damage=tRound(b.dragonStats.damage+(source.damageDealt||0));b.dragonStats.healing=tRound(b.dragonStats.healing+(source.healingDone||0));b.dragonStats.shield=tRound(b.dragonStats.shield+(source.shieldCreated||0));b.dragonStats.triggers++;tEvent(b,'dragon',null,'LINH LONG · '+dragon+' long hỗ trợ toàn trận!');tFinish(b);}
 }
 b.accumulator=Math.round(b.accumulator*1000000)/1000000;return b;
}
