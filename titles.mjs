import {titleDefinitions,titleFrames} from './title-config.mjs';
export const titleById=Object.fromEntries(titleDefinitions.map(t=>[t.id,t]));
export function initTitles(s){s.titles??={version:1,unlocked:{},equippedTitleId:null,equippedFrameId:null,display:[],counters:{},opponents:{},defeatedBy:[],firstBosses:[],processed:[],pending:[],lastPvpAt:0};return s;}
export function validTitles(s){const t=s.titles;if(t===undefined)return true;const obj=x=>x&&typeof x==='object'&&!Array.isArray(x),int=n=>Number.isSafeInteger(n)&&n>=0,ids=a=>Array.isArray(a)&&new Set(a).size===a.length;return obj(t)&&t.version===1&&obj(t.unlocked)&&Object.entries(t.unlocked).every(([id,v])=>Object.hasOwn(titleById,id)&&obj(v)&&int(v.at)&&(v.expiresAt==null||int(v.expiresAt)))&&(t.equippedTitleId===null||Object.hasOwn(t.unlocked,t.equippedTitleId))&&(t.equippedFrameId===null||Object.keys(t.unlocked).some(id=>titleById[id].frameId===t.equippedFrameId))&&ids(t.display)&&t.display.length<=10&&t.display.every(id=>Object.hasOwn(t.unlocked,id))&&obj(t.counters)&&Object.values(t.counters).every(int)&&obj(t.opponents)&&Object.values(t.opponents).every(v=>obj(v)&&typeof v.day==='string'&&int(v.count)&&v.count<=3)&&ids(t.defeatedBy)&&t.defeatedBy.every(v=>typeof v==='string')&&ids(t.firstBosses)&&t.firstBosses.every(v=>typeof v==='string')&&ids(t.processed)&&t.processed.length<=500&&t.processed.every(v=>typeof v==='string')&&ids(t.pending)&&t.pending.every(id=>Object.hasOwn(t.unlocked,id))&&int(t.lastPvpAt);}
export function titleBonuses(s,now=Date.now()){const t=s.titles,d=titleById[t?.equippedTitleId];if(!d||!Object.hasOwn(t.unlocked,d.id))return {};const expires=t.unlocked[d.id].expiresAt??d.expiresAt,m=expires&&now>=expires?d.expiredMultiplier:1,out={};for(const key of ['health','attack','defense','speed','crit','critDamage','armorPen','dodge'])out[key]=Math.min(.1,((d.stats[key]||0)+(d.stats.all||0))*m);return out;}
export class TitleManager{
 constructor(onUnlock=()=>{}){this.onUnlock=onUnlock;}
 emit(s,event,now=Date.now()){
  initTitles(s);const t=s.titles,c=t.counters,inc=(key,n=1)=>c[key]=(c[key]||0)+n;
  if(event.id&&t.processed.includes(event.id))return [];
  let eligible=false;
  if(event.event==='world_boss_killed'){
   const player=(event.participants||[]).find(p=>p.playerId===(event.playerId||'player')),pct=player&&(event.totalHp>0?player.damage/event.totalHp:player.damagePercent);
   if(player&&Number.isFinite(pct)&&pct>=.01&&pct<=1){eligible=true;inc('worldBossParticipation');if(player.isFinalBlow)inc('worldBossFinalBlows');if(player.rank===1){inc('bossTopDamage');inc('bossTopStreak');}else c.bossTopStreak=0;if(player.deaths===0)inc('bossDeathless');if(event.participants.length>=5)inc('bossFullParty');if(!t.firstBosses.includes(event.bossId)){t.firstBosses.push(event.bossId);inc('bossFirstKills');}}
  }else if(event.event==='merit_gained'&&Number.isSafeInteger(event.total)&&event.total>=0){eligible=true;c.merit=Math.max(c.merit||0,event.total);}else if(event.event==='stronghold_cleared'&&event.victory){eligible=true;if(event.typeId==='yeu_ma_doanh')inc('yeuMaDefeated');else if(event.typeId==='man_toc_thanh'){inc('manTocDefeated');if(event.level===10)inc('manTocLevel10Defeated');if(event.lossRatio<.05)inc('strongholdFlawless');}}else if(event.event==='pvp_match_ended'){
   const me=event.playerId||'player',won=event.winnerId===me,opponent=won?event.loserId:event.winnerId;
   if(now-t.lastPvpAt>=86400000)c.pvpWinStreak=0;
   if(!won){c.pvpWinStreak=0;if(typeof opponent==='string'&&!t.defeatedBy.includes(opponent))t.defeatedBy.push(opponent);t.lastPvpAt=now;}
   else if(typeof opponent==='string'&&opponent!==me&&!['__proto__','constructor','prototype'].includes(opponent)&&!event.isDummy&&Number.isFinite(event.powerRatio)&&event.powerRatio>=.5){
    const day=new Date(now).toLocaleDateString('en-CA');const tally=Object.hasOwn(t.opponents,opponent)?t.opponents[opponent]:null;const count=tally?.day===day?tally.count:0;
    if(count<3){eligible=true;t.opponents[opponent]={day,count:count+1};inc('pvpKills');inc('pvpWinStreak');c.bestWinStreak=Math.max(c.bestWinStreak||0,c.pvpWinStreak);if(event.powerRatio>=1.3)inc('pvpUpsets');if(t.defeatedBy.includes(opponent))inc('pvpRevenge');if(event.winStreakBroken>=10)inc('pvpStreakBreaks');t.lastPvpAt=now;}
   }
  }else if(event.event==='pvp_season_ended'&&event.rank===1){eligible=true;inc('seasonWins');}
  if(event.id){t.processed.push(event.id);t.processed=t.processed.slice(-500);}
  if(!eligible)return [];
  const unlocked=[];for(const d of titleDefinitions)if(d.condition.event===event.event&&!Object.hasOwn(t.unlocked,d.id)&&(c[d.condition.metric]||0)>=d.condition.count){t.unlocked[d.id]={at:now,...(event.expiresAt&&d.category==='pvp'&&event.event==='pvp_season_ended'?{expiresAt:event.expiresAt}:{})};t.pending.push(d.id);if(t.display.length<10)t.display.push(d.id);unlocked.push(d.id);this.onUnlock({event:'title_unlocked',titleId:d.id});}return unlocked;
 }
 equip(s,id){initTitles(s);if(!Object.hasOwn(s.titles.unlocked,id))return false;s.titles.equippedTitleId=id;s.titles.equippedFrameId=titleById[id].frameId;return true;}
 frame(s,id){initTitles(s);if(!Object.keys(s.titles.unlocked).some(k=>titleById[k].frameId===id))return false;s.titles.equippedFrameId=id;return true;}
 display(s,ids){initTitles(s);if(!Array.isArray(ids)||ids.length>10||new Set(ids).size!==ids.length||!ids.every(id=>Object.hasOwn(s.titles.unlocked,id)))return false;s.titles.display=ids.slice();return true;}
}
export function titleStack(s){return (s.titles?.display||[]).slice(0,10).map(id=>titleById[id]).filter(Boolean);}

export function titleFrameClass(s){const frame=titleFrames.find(f=>f.id===s.titles?.equippedFrameId);return frame?'earned-title-frame title-rarity-'+frame.rarity:'';}
