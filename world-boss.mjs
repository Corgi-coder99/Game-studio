import {battleFeedbackEvent} from './feedback-data.mjs';
import {assignEnemyElements} from './team-synergy.mjs';
import {worldBossDefinitions,worldBossRules} from './world-boss-config.mjs';
import {worldBossById,initWorldBoss,worldBossSchedule,worldBossPhase,bossHpScale} from './world-boss-data.mjs';
import {createTacticsBattle,tickTactics,tacticsHit,tacticsStatus} from './tactics.mjs';
import {itemTemplates} from './progression.mjs';
import {exclusiveItems} from './auction-config.mjs';
import {initAuction} from './auction-data.mjs';
export function worldBossPower(s){const b=createTacticsBattle(s,{id:'power',name:'Raid readiness',level:1,enemies:['zhaoyun']});return Math.round(b.allies.reduce((n,u)=>n+u.maxHp+5*(u.physicalAtk+u.magicAtk)+3*(u.armor+u.resist),0));}
export class WorldBossBackend{start(){throw new Error('Implement raid entry.');}tick(){throw new Error('Implement raid simulation.');}}
export class LocalWorldBossBackend extends WorldBossBackend{
 constructor(random=Math.random,onEvent=()=>{}){super();this.random=random;this.onEvent=onEvent;}
 start(s,id,{practice=false,now=Date.now()}={}){
  const boss=worldBossById[id];if(!boss)throw new Error('Unknown world boss.');initWorldBoss(s);initAuction(s);
  const schedule=worldBossSchedule(boss,now),power=worldBossPower(s);if(!s.team.length)throw new Error('Prepare at least one hero.');if(!practice&&schedule.status!=='active')throw new Error(schedule.status==='lobby'?'The raid is gathering. Wait for the scheduled start.':'The boss has withdrawn. Practice is always available.');
  if(!practice&&power<boss.recommendedPower*worldBossRules.minPowerRatio)throw new Error('At least 40% of recommended power is required.');
  const recordId=practice?'practice:'+id+':'+now:schedule.id;if(!practice&&s.worldBoss.history.some(r=>r.id===recordId))throw new Error('This appearance has already been attempted.');
  const count=worldBossRules.npcMin+Math.floor(this.random()*(worldBossRules.npcMax-worldBossRules.npcMin+1)),npcs=Array.from({length:count},(_,i)=>({playerId:'npc_'+i,name:['Cloud Wanderer','Jade Pilgrim','Moonblade','Azure Sage','Crimson Lotus'][i%5]+' '+(i+1),power:boss.recommendedPower*(.65+this.random()*.7),damage:0,deaths:0,reviveAt:0})),average=(power+npcs.reduce((n,p)=>n+p.power,0))/(count+1),maxHp=Math.round(boss.baseHp*bossHpScale(average,boss.recommendedPower));
  const battle=createTacticsBattle(s,{id,name:boss.name,level:1,heroLevel:Math.max(1,s.heroLevels[s.team[0]]||1),enemies:['zhaoyun'],boss:true,enemyScale:1});battle.mode='worldBoss';battle.timeLimit=boss.fightDurationSec;battle.turn=null;const enemy=battle.enemies[0];enemy.name=boss.name;enemy.maxHp=maxHp;enemy.hp=maxHp;enemy.armor=100;enemy.resist=100;enemy.regen=0;enemy.revive=false;enemy.reflect=0;enemy.lifesteal=0;enemy.abilities=[];enemy.skillCosts=[];enemy.skillCooldowns=[];enemy.manaRegen=0;enemy.rageRegen=0;enemy.mana=0;enemy.rage=0;enemy.attackTimer=1e9;enemy.divinePath=null;enemy.element=boss.phases[0].element||'none';
  for(const npc of npcs)npc.dps=maxHp/(boss.fightDurationSec*count)*(worldBossRules.npcDpsMin+this.random()*(worldBossRules.npcDpsMax-worldBossRules.npcDpsMin));
  if(!practice){s.worldBoss.history.push({id:recordId,bossId:id,startedAt:now,result:'retreat',playerDamage:0,deaths:0});s.worldBoss.history=s.worldBoss.history.slice(-100);}
  return {id:recordId,bossId:id,practice,startedAt:now,deadline:practice?now+boss.fightDurationSec*1000:schedule.endsAt,elapsed:0,maxHp,battle,npcs,playerDamage:0,deaths:0,revives:0,reviveAt:0,phase:0,nextSkill:4,warning:null,dodgeUntil:0,dodgeReadyAt:0,result:null,rewards:[],settled:false,isFinalBlow:false};
 }
 dodge(raid){if(raid.result||raid.elapsed<raid.dodgeReadyAt)return false;raid.dodgeUntil=raid.elapsed+2;raid.dodgeReadyAt=raid.elapsed+worldBossRules.dodgeCooldownSec;return true;}
 tick(s,raid,delta,now=Date.now()){
  if(delta>.5){let remaining=Math.min(5,delta);while(remaining>0&&!raid.result){this.tick(s,raid,Math.min(.5,remaining),now);remaining-=.5;}return raid;}
  if(!raid||raid.result)return raid;const boss=worldBossById[raid.bossId],dt=Math.max(0,Math.min(.5,delta));raid.elapsed+=dt;
  if(now>=raid.deadline||raid.elapsed>=boss.fightDurationSec){raid.result='defeat';return this.finish(s,raid,now);}
  const phase=boss.phases[raid.phase],before=raid.battle.enemies[0].hp;raid.battle.enemies[0].bossReduction=phase.damageReduction||0;raid.battle.enemies[0].armor=raid.battle.enemies[0].resist=100*(phase.defenseMultiplier||1);
  if(!raid.reviveAt){raid.battle.winner=null;raid.battle=tickTactics(raid.battle,dt,true);const enemy=raid.battle.enemies[0],raw=Math.max(0,before-enemy.hp),actual=raw;enemy.hp=Math.max(0,before-actual);raid.playerDamage+=before-enemy.hp;raid.battle.winner=null;if(enemy.hp<=0){raid.isFinalBlow=true;raid.result='victory';return this.finish(s,raid,now);}}
  for(const npc of raid.npcs){if(npc.reviveAt>raid.elapsed)continue;const enemy=raid.battle.enemies[0],hit=Math.min(enemy.hp,npc.dps*dt*(1-(phase.damageReduction||0)));npc.damage+=hit;enemy.hp-=hit;if(enemy.hp<=0){npc.isFinalBlow=true;raid.result='victory';return this.finish(s,raid,now);}}
  const previousPhase=raid.phase;raid.phase=worldBossPhase(boss,raid.battle.enemies[0].hp,raid.maxHp);if(previousPhase!==raid.phase)battleFeedbackEvent(raid.battle,'boss_phase_change',{label:boss.name+' · Phase '+(raid.phase+1),element:boss.phases[raid.phase].element});raid.battle.enemies[0].element=boss.phases[raid.phase].element||'none';
  if(raid.warning&&raid.elapsed>=raid.warning.endsAt){const warning=raid.warning;raid.warning=null;for(const u of raid.battle.allies.filter(u=>u.hp>0))if(raid.elapsed>raid.dodgeUntil&&warning.slots.includes(u.slot)){tacticsHit(raid.battle,raid.battle.enemies[0],u,1,'magic',{raw:u.maxHp*worldBossRules.damageHpRatio*(1+raid.phase*.12),noCrit:true,noProc:true,noDodge:true});if(/roar|charm/.test(warning.skill))tacticsStatus(u,'stun',1);if(/poison|twin_fury|phantom_fire|fox_inferno|last_tail/.test(warning.skill))tacticsStatus(u,'burn',4,u.maxHp*.015,raid.battle.enemies[0]);if(/frozen/.test(warning.skill))tacticsStatus(u,'slow',4);if(/drain/.test(warning.skill))u.mana=Math.max(0,u.mana-u.manaMax*.4);}
   for(const npc of raid.npcs)if(npc.reviveAt<=raid.elapsed&&this.random()>worldBossRules.npcDodge&&this.random()<.2){npc.deaths++;npc.reviveAt=raid.elapsed+15;}raid.nextSkill=raid.elapsed+worldBossRules.skillIntervalSec/(1+(boss.phases[raid.phase].speedBonus||0));
  }
  if(!raid.warning&&raid.elapsed>=raid.nextSkill){const p=boss.phases[raid.phase],skill=p.skills[Math.floor(this.random()*p.skills.length)],all=/rain|world|fury|inferno/.test(skill),row=Math.floor(this.random()*3);battleFeedbackEvent(raid.battle,'boss_warning',{target:'enemy-0',label:'DODGE · '+skill.replaceAll('_',' ')});raid.warning={skill,startsAt:raid.elapsed,endsAt:raid.elapsed+worldBossRules.telegraphSec,slots:raid.battle.allies.filter(u=>all||Math.floor(u.slot/3)===row).map(u=>u.slot)};}
  if(!raid.reviveAt&&raid.battle.allies.every(u=>u.hp<=0)){raid.deaths++;if(raid.revives>=worldBossRules.maxRevives){raid.reviveAt=Infinity;}else{raid.revives++;raid.reviveAt=raid.elapsed+worldBossRules.reviveDelaySec;}}
  if(raid.reviveAt&&raid.elapsed>=raid.reviveAt){raid.reviveAt=0;for(const u of raid.battle.allies){u.hp=u.maxHp;u.effects={};u.mana=u.manaMax*.35;u.rage=u.rageMax*.35;}raid.battle.winner=null;}
  return raid;
 }
 finish(s,raid,now=Date.now()){
  if(raid.settled)return raid;raid.settled=true;battleFeedbackEvent(raid.battle,raid.result==='victory'?'boss_killed':'defeat',{label:raid.result==='victory'?'WORLD BOSS DEFEATED':'RAID '+raid.result.toUpperCase()});initWorldBoss(s);initAuction(s);const boss=worldBossById[raid.bossId],player={playerId:'player',name:s.account.name,damage:raid.playerDamage,deaths:raid.deaths,isFinalBlow:raid.isFinalBlow},ranked=[player,...raid.npcs].sort((a,b)=>b.damage-a.damage);ranked.forEach((p,i)=>p.rank=i+1);raid.rank=player.rank;raid.ranking=ranked;
  if(raid.practice)return raid;const record=s.worldBoss.history.find(r=>r.id===raid.id);if(!record)return raid;Object.assign(record,{result:raid.result,playerDamage:raid.playerDamage,deaths:raid.deaths,rank:raid.rank});
  if(raid.result!=='victory'||raid.playerDamage/raid.maxHp<worldBossRules.minContribution)return raid;
  const parcel=data=>{const p={id:s.auction.nextId++,claimed:false,title:boss.name+' raid reward',...data};s.auction.inbox.push(p);raid.rewards.push(p);},factor=raid.rank===1?2:raid.rank<=3?1.5:raid.rank<=10?1:.6,rolls=Math.round(worldBossRules.baseRolls*factor)+(raid.isFinalBlow?1:0);let rare=false;
  for(let i=0;i<rolls;i++)for(const drop of boss.drops)if(this.random()<drop.chance){const item=exclusiveItems.find(i=>i.id===drop.itemId);if(item.rarity>=4)rare=true;parcel({asset:{kind:'bag',id:item.id,amount:drop.min+Math.floor(this.random()*(drop.max-drop.min+1))}});}
  if(!rare&&s.auction.pity>=worldBossRules.pity){const pool=exclusiveItems.filter(i=>i.rarity>=4&&i.sources.includes('world_boss')),item=pool[Math.floor(this.random()*pool.length)];parcel({asset:{kind:'bag',id:item.id,amount:1}});rare=true;}
  s.auction.pity=rare?0:Math.min(worldBossRules.pity,s.auction.pity+1);s.worldBoss.pity=s.auction.pity;parcel({currency:'gold',amount:Math.round(worldBossRules.gold*factor)});parcel({asset:{kind:'bag',id:'xpTome',amount:Math.max(1,Math.round(factor))}});parcel({currency:'essence',amount:Math.round(worldBossRules.essence*factor)});if(this.random()<worldBossRules.ssrChance){const pool=itemTemplates.filter(t=>t.grade==='SSR'&&!t.heroId),item=pool[Math.floor(this.random()*pool.length)];parcel({asset:{kind:'gear',id:'boss-gear',amount:1,item:{templateId:item.id,level:1}}});}s.worldBoss.merit+=Math.round(worldBossRules.merit*factor);
  const first=!s.worldBoss.firstKills.includes(boss.id);if(first)s.worldBoss.firstKills.push(boss.id);this.onEvent(s,{event:'world_boss_killed',id:raid.id,bossId:boss.id,totalHp:raid.maxHp,isFirstKillEver:first,participants:ranked.map(p=>({...p,damagePercent:p.damage/raid.maxHp}))},now);return raid;
 }
 retreat(s,raid,now=Date.now()){if(raid&&!raid.result){raid.result='retreat';this.finish(s,raid,now);}return raid;}
}
