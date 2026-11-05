// Each world squad owns an immutable deployment snapshot and its own battle.
export function deployments(s){return s.worldAI?.expeditions??(s.worldAI?.expedition?[s.worldAI.expedition]:[]);}
export function activeDeployment(s,index=s.squads?.active||0){return deployments(s).find(e=>(e.squadId??0)===index)||null;}
export function syncDeploymentAlias(s){s.worldAI.expedition=activeDeployment(s)||deployments(s)[0]||null;return s;}
export function initDeployments(s){if(s.worldAI){s.worldAI.expeditions??=s.worldAI.expedition?[{...s.worldAI.expedition,squadId:s.squads?.active||0,formation:[...s.formation],dragon:s.dragon,battle:['bot','hunt'].includes(s.battle?.mode)?s.battle:null}]:[];syncDeploymentAlias(s);}return s;}
export function deployedUnits(s){return deployments(s).reduce((n,e)=>n+e.units,0)+(s.march?.units||0);}
export function selectedSquadBusy(s){return Boolean(s.march||activeDeployment(s));}
export function persistForeground(s){if(s.battle?.mode==='campaign')s.campaignBattle=s.battle;else if(['bot','hunt'].includes(s.battle?.mode)){const e=deployments(s).find(e=>e.squadId===s.battle.squadId);if(e)e.battle=s.battle;}return s;}
