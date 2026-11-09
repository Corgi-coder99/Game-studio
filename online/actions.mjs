import {claimDailyReward} from '../daily-rewards.mjs';
import {chooseRealm} from '../realms.mjs';
import {startConstruction,trainTroops,economyTick} from '../kingdom.mjs';
import {assignFormation,levelUpHero,pullCharacters,enhanceItem,equipItem,levelUpSkill} from '../progression.mjs';
import {activateSquad,syncActiveSquad,saveSquad} from '../squads.mjs';
import {FormationAdvisor,applyFormationTemplate} from '../formation-advisor.mjs';
import {startProduction,claimProduction,cancelProduction,startHealing} from '../civic.mjs';
import {startCampaign,campaignTick,setTowerFormation,stopCampaign} from '../campaign.mjs';
import {gatherRegional,attackBot,huntWildlife,recallRegional} from '../world-sim.mjs';
import {buyReturnCommand,buySpiritSupply,buyShardBox,openShardBox} from '../shop.mjs';
import {selectLong,upgradeLong} from '../elements.mjs';
import {researchTechnology} from '../technology.mjs';
import {claimStoryObjective,acknowledgeStoryScene} from '../story.mjs';
import {claimMilestone,claimVipGift} from '../account.mjs';
export function onlineGameAction(source,c,now=Date.now(),events={}){
 let s=structuredClone(source);const n=Number(c.amount),squad=Number(c.squad);
 switch(c.action){
 case 'daily':s=claimDailyReward(s,now,'Europe/Paris');break;
 case 'realm':s=chooseRealm(s,c.faction,c.city);break;
 case 'build':s=startConstruction(s,c.building,now);break;
 case 'train':s=trainTroops(s,now,c.troop);break;
 case 'activate':s=activateSquad(s,squad);break;
 case 'save-squad':s=saveSquad(s,squad);break;
 case 'assign':s=assignFormation(s,c.hero,Number(c.slot));break;
 case 'recommend':{const suggestion=new FormationAdvisor().suggest(s,{power:1,waves:[{element:'none',power:1}]}).find(x=>x.label===(c.strategy||'Balanced'))||new FormationAdvisor().suggest(s,{power:1,waves:[{element:'none',power:1}]}).at(-1);if(!suggestion)throw new Error('No available heroes.');s=applyFormationTemplate(s,suggestion.formation);break;}
 case 'hero-level':s=levelUpHero(s,c.hero);break;
 case 'skill-level':s=levelUpSkill(s,c.hero,Number(c.skill));break;
 case 'equip':s=equipItem(s,c.hero,c.slot,c.item);break;
 case 'enhance':s=enhanceItem(s,c.item);break;
 case 'summon':{if(![1,10,100].includes(n))throw new Error('Choose 1, 10 or 100 draws.');const r=pullCharacters(s,n,Math.random,c.ticket?'tickets':'coins');s=r.state;events.summonResults=r.results.map(h=>({id:h.id,duplicate:h.duplicate}));break;}
 case 'produce':s=startProduction(s,c.building,n,now);break;
 case 'collect':s=claimProduction(s,c.building,now).state;break;
 case 'cancel-production':s=cancelProduction(s,c.building);break;
 case 'heal':s=startHealing(s,c.troop,n,now);break;
 case 'research':s=researchTechnology(s,c.technology);break;
 case 'gather':s=gatherRegional(s,c.target);break;
 case 'attack-bot':s=attackBot(s,c.target);break;
 case 'hunt':s=huntWildlife(s,c.target);break;
 case 'recall':s=recallRegional(s,squad);break;
 case 'tower-team':s=setTowerFormation(s);break;
 case 'tower':s=startCampaign(s,Number(c.floor));break;
 case 'tower-stop':s=stopCampaign(s);break;
 case 'command':s=buyReturnCommand(s);break;
 case 'supply':s=buySpiritSupply(s,c.kind);break;
 case 'buy-box':s=buyShardBox(s,c.grade);break;
 case 'open-box':s=openShardBox(s,c.grade).state;break;
 case 'dragon':s=selectLong(s,c.element);break;
 case 'dragon-level':s=upgradeLong(s,c.element);break;
 case 'story-claim':s=claimStoryObjective(s,c.objective);break;
 case 'story-ack':s=acknowledgeStoryScene(s,c.scene);break;
 case 'level-gift':s=claimMilestone(s,n).state;break;
 case 'legacy-gift':s=claimVipGift(s,n).state;break;
 default:throw new Error('Unknown game action.');
 }
 syncActiveSquad(s);return s;
}
export function onlinePersonalTick(s,dt,now){return campaignTick(economyTick(s,now),dt);}
