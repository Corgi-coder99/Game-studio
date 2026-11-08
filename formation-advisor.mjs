import {initFormationSaves} from './formation-save.mjs';
import {elementRules} from './element-config.mjs';
import {TeamSynergyCalculator,overcomes,heavenlyTiming} from './team-synergy.mjs';
import {characterById} from './characters.mjs';
import {getCharacterStats,heroAssignedElsewhere} from './progression.mjs';
import {deployments} from './operations.mjs';
import {createTacticsBattle} from './tactics.mjs';
import {elementalMultiplier} from './elements.mjs';
export function availableAdvisorHeroes(s){const busy=new Set(deployments(s).flatMap(e=>e.formation.filter(Boolean)));return s.owned.filter(id=>heroAssignedElsewhere(s,id)<0&&!busy.has(id));}
export function effectiveFormationPower(s,formation,waves=[{element:'none'}],now=Date.now()){
 const b=createTacticsBattle({...s,formation,team:formation.filter(Boolean)},{id:'advisor-preview',name:'Formation preview',level:1,enemies:[],now});const powers=waves.map(w=>b.allies.reduce((n,u)=>n+u.maxHp+5*(u.physicalAtk+u.magicAtk)*elementalMultiplier(u.element,w.element)*(w.guard?.element===u.element?1-w.guard.reduction:1)+3*(u.armor+u.resist),0));return{effectivePower:Math.round(powers.reduce((a,b)=>a+b,0)/Math.max(1,powers.length)),wavePowers:powers.map(Math.round),synergy:b.teamSynergy};
}
export class FormationAdvisor{
 suggest(s,target={waves:[{element:'none',power:1}]},{now=Date.now(),clock=()=>performance.now()}={}){
  const start=clock(),allowed=availableAdvisorHeroes(s),stats=Object.fromEntries(allowed.map(id=>[id,getCharacterStats(s,id)])),waves=target.waves?.length?target.waves:[{element:'none',power:target.power||1}],slots=[0,2,6,7,8],width=elementRules.advisor.beamWidth,limit=elementRules.advisor.budgetMs,calc=new TeamSynergyCalculator(),results=[];
  const heroPower=id=>{const u=stats[id];return u.maxHp+5*(u.physicalAtk+u.magicAtk)+3*(u.armor+u.resist);};
  for(const strategy of ['Counter Advantage','Safe','Balanced']){
   let beam=[{ids:[],formation:Array(9).fill(null),score:0}];for(let depth=0;depth<Math.min(5,allowed.length);depth++){const next=[];for(const partial of beam){for(const id of allowed){if(partial.ids.includes(id))continue;const formation=[...partial.formation];formation[slots[depth]]=id;const units=formation.flatMap((id,slot)=>id?[{id,slot,element:characterById[id].element}]:[]),synergy=calc.calculate(units,{now});let score=0,worst=Infinity;for(const wave of waves){let value=0;for(const u of synergy.units){const st=stats[u.id],attack=(st.physicalAtk+st.magicAtk)*5*(1+u.attack)*elementalMultiplier(u.element,wave.element)*(wave.guard?.element===u.element?1-wave.guard.reduction:1),hp=st.maxHp*(1+u.health);value+=strategy==='Safe'?hp*1.6+attack*.8:strategy==='Counter Advantage'?attack*1.5+hp*.7:hp+attack;}score+=value;worst=Math.min(worst,value/Math.max(1,wave.power||target.power||1));}score/=waves.length;if(worst<elementRules.advisor.badWaveRatio)score*=.8;next.push({ids:[...partial.ids,id],formation,score});}if(clock()-start>=limit*.7&&next.length)break;}next.sort((a,b)=>b.score-a.score);beam=next.slice(0,width);if(!beam.length)break;}
   const complete=beam.filter(c=>c.ids.length===Math.min(5,allowed.length)),candidate=complete.find(c=>results.every(r=>c.ids.filter(id=>!r.ids.includes(id)).length>=Math.min(2,Math.max(0,allowed.length-5))))||complete[0];if(candidate&&!results.some(r=>r.ids.slice().sort().join()===candidate.ids.slice().sort().join())){const actual=effectiveFormationPower(s,candidate.formation,waves,now),ratio=actual.effectivePower/Math.max(1,target.power||waves.reduce((n,w)=>n+(w.power||1),0)/waves.length);results.push({...candidate,...actual,label:strategy,difficulty:ratio>=1.2?'Easy':ratio>=.9?'Moderate':'Hard',winChance:ratio>=1.2?'High':ratio>=.9?'Medium':'Low',reasons:waves.slice(0,3).map((w,i)=>'Wave '+(i+1)+': '+w.element+' · '+candidate.ids.filter(id=>overcomes(characterById[id].element,w.element)).length+' counter heroes')});}
  }return results.slice(0,3);
 }
}
export function saveFormationTemplate(state,name){const s=structuredClone(state);initFormationSaves(s);if(!s.team.length||s.savedFormations.entries.length>=5||typeof name!=='string'||!name.trim()||name.length>24||/[<>\x00-\x1f]/.test(name))throw new Error('Use a name of 1–24 characters; keep at most five templates.');s.savedFormations.entries.push({name:name.trim(),slots:[...s.formation]});return s;}
export function applyFormationTemplate(state,slots){const allowed=new Set(availableAdvisorHeroes(state));if(!Array.isArray(slots)||slots.length!==9||slots.some(id=>id&&!allowed.has(id))||slots.filter(Boolean).length>5||new Set(slots.filter(Boolean)).size!==slots.filter(Boolean).length)throw new Error('Some heroes belong to another squad or are deployed.');const s=structuredClone(state);s.formation=[...slots];s.team=slots.filter(Boolean);return s;}
