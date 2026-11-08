import {worldBossDefinitions} from './world-boss-config.mjs';
import {worldBossSchedule} from './world-boss-data.mjs';
import {warfareRules} from './warfare-config.mjs';
export function sanctuaryAppearance(now=Date.now()){const active=worldBossDefinitions.map(b=>worldBossSchedule(b,now)).find(s=>s.status==='active'||s.status==='lobby');return active?{id:'sanctuary:'+active.startsAt,endsAt:active.endsAt}:null;}
export function sanctuaryBlocked(s,x,y,now=Date.now()){const a=sanctuaryAppearance(now),zone=warfareRules.bossSanctuary;if(!a||Math.hypot(x-zone.x,y-zone.y)>zone.radius)return false;return s.worldBoss?.guardEvent!==a.id||(s.worldBoss.guardsDefeated||[]).length<zone.guards;}
