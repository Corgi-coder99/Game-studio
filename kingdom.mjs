import {strongholdMarchSave} from './stronghold-data.mjs';
import {finishHealing,woundedTotal,recordCasualties} from './civic.mjs';
import {elementNames,canUseDragon,elementalMultiplier} from './elements.mjs';
import {deployments,deployedUnits} from './operations.mjs';
import {technologyBonus} from './technology.mjs';
import {buildingLevelMax, normalizeTraining, trainingJobs, validTraining, constructionSeconds} from './city-rules.mjs';
import {syncActiveSquad} from './squads.mjs';
import {recordBattleMail} from './mail.mjs';
import {troopStats} from './troops.mjs';
import {skinBonus} from './skins.mjs';
import {registerBattle,initChronicle} from './chronicle.mjs';
import { normalizeAccount, validAccount, awardPlayerXP, vipBonuses, petBonus } from './account.mjs';
import { heroes, validState } from './game.mjs';
import { normalizeProgression, validProgression, describeSkill, grantHeroXP } from './progression.mjs';
import { createTacticsBattle, tickTactics, castTactics, tacticsTarget } from './tactics.mjs';

export const skills = Object.fromEntries(heroes.map(h=>[h.id,{name:h.skill.name,text:describeSkill(h),fx:h.fx,role:h.roles.join(' / '),color:h.color}]));
export const bonds = [
  { id: 'pilgrimage', name: 'Đồng Hành Thỉnh Kinh', ids: ['wukong', 'bajie'], text: '+15% HP toàn đội. Ngộ Không xuất chiêu: Bát Giới trợ kích toàn bộ địch (50% ATK).', lore: 'Tôn Ngộ Không và Trư Bát Giới cùng hộ tống Đường Tăng trong Tây Du Ký.' },
  { id: 'shu', name: 'Long Đảm Ngọa Long', ids: ['zhugeliang', 'zhaoyun'], text: '+12% ATK toàn đội. Bát Trận Đồ kích hoạt một đòn thương của Triệu Vân (180% ATK).', lore: 'Gia Cát Lượng và Triệu Vân cùng phụng sự Thục Hán; combo là diễn giải cho gameplay.' },
  { id: 'generals', name: 'Hổ Tướng Thục Hán', ids: ['guanyu', 'zhaoyun'], text: 'Giảm 10% sát thương toàn đội. Quan Vũ xuất chiêu: thêm một đợt sóng đao 70% ATK toàn bộ địch.', lore: 'Quan Vũ và Triệu Vân thuộc Ngũ Hổ Tướng trong Tam Quốc diễn nghĩa.' },
  { id: 'investiture', name: 'Song Thần Phạt Trụ', ids: ['nezha', 'erlang'], text: '+20% nộ khí từ đòn đánh. Na Tra xuất chiêu: Thiên Nhãn gây thêm 120% ATK lên địch đã bị đánh dấu.', lore: 'Na Tra và Dương Tiễn cùng giúp nhà Chu trong Phong Thần diễn nghĩa.' },
];
bonds.push(
 {id:'sworn',name:'Đào Viên Kết Nghĩa',ids:['liubei','guanyu','zhangfei'],text:'+10% HP toàn đội; Lưu Bị dùng chiêu gọi Quan Vũ trợ kích tiền tuyến.',lore:'Ba anh em kết nghĩa trong Tam Quốc diễn nghĩa.'},
 {id:'tigers',name:'Ngũ Hổ Thượng Tướng',required:4,ids:['guanyu','zhangfei','zhaoyun','machao','huangzhong'],text:'Có 4 trong 5 Ngũ Hổ: +15% công vật lý/phép và +5% chí mạng toàn đội.',lore:'Ngũ Hổ Tướng của Thục Hán trong Tam Quốc diễn nghĩa.'},
 {id:'pilgrims',name:'Tây Hành Hộ Pháp',ids:['wukong','bajie','shawujing','tangsanzang'],text:'+15% kháng phép, +10% hồi mana toàn đội.',lore:'Bốn thầy trò trên đường thỉnh kinh trong Tây Du Ký.'},
 {id:'moon',name:'Nhật Nguyệt Tương Phùng',ids:['houyi','change'],text:'+10% hiệu quả hồi máu; Hậu Nghệ dùng chiêu gọi Hằng Nga hồi 8% HP cho toàn đội.',lore:'Hậu Nghệ và Hằng Nga trong thần thoại Trung Hoa.'}
);
export const structures = [
  { id: 'hall', name: 'Đại điện', icon: '♜', x: 8, y: 4, color: '#b7454e', text: 'Trung tâm thành trì. Mở giới hạn nâng cấp các công trình.' },
  { id: 'farm', name: 'Nông trang', icon: '♧', x: 4, y: 12, color: '#b99f45', text: 'Giao dân, cấp thức ăn và bắt đầu một mẻ trồng trọt. Thu hoạch thủ công.' },
  { id: 'wood', name: 'Xưởng gỗ', icon: '♠', x: 15, y: 11, color: '#628853', text: 'Điều dân và cấp thức ăn để bắt đầu khai thác gỗ. Không tự sản xuất.' },
  { id: 'stone', name: 'Mỏ đá', icon: '◆', x: 14, y: 5, color: '#768c9c', text: 'Cấp thức ăn, giao thợ khai thác rồi nhận đá khi xong mẻ.' },
  { id: 'barracks', name: 'Doanh trại', icon: '⚑', x: 4, y: 6, color: '#578aaa', text: 'Huấn luyện binh lính và tăng HP và ATK đội viễn chinh thêm 5% mỗi cấp.' },
  { id: 'dragon', name: 'Điện linh long', icon: '✧', x: 12, y: 15, color: '#a478be', text: 'Linh long hồi nộ để hỗ trợ toàn đội. Nâng cấp tăng sức mạnh long tức.' },
  {id:'infirmary',name:'Linh Dược Viện',icon:'✚',x:2,y:4,color:'#63b18a',text:'Tiếp nhận thương binh và dùng thức ăn, gỗ để cứu chữa, trả quân về dự bị.'},
];
export const worldNodes = [
  { id: 'home', name: 'Thiên Mệnh Thành', x: 10, y: 10, type: 'home', level: 1 },
  { id: 'camp1', name: 'Trại Hoàng Cân', x: 3, y: 8, type: 'camp', level: 1, enemies: ['zhoucang','liaohua','jingwei','huangyueying'] },
  { id: 'camp2', name: 'Bến Xích Bích', x: 15, y: 7, type: 'camp', level: 2, enemies: ['zhangfei','xuchu','zhenji','ganning','lusu','pangtong'] },
  { id: 'camp3', name: 'Hổ Lao Quan', x: 13, y: 16, type: 'camp', level: 3, enemies: ['guanyu','lubu','erlang','bajie','nezha','zhouyu','zhugeliang','diaochan','huatuo'] },
  { id: 'grain', name: 'Đồng lúa phía Tây', x: 5, y: 13, type: 'food', level: 1 },
  { id: 'grove', name: 'Rừng trúc Thanh Vân', x: 16, y: 12, type: 'wood', level: 1 },
  { id: 'quarry', name: 'Mỏ đá Bạch Sơn', x: 8, y: 17, type: 'stone', level: 1 },
];
export const troopTypes = {
  shield: { name: 'Thuẫn binh', icon: '▣', color: '#79c2d1', beats: 'spear', text: '+12% HP · khắc Thương binh' },
  spear: { name: 'Thương binh', icon: '⚑', color: '#b5d58a', beats: 'cavalry', text: '+5% ATK · khắc Kỵ binh' },
  bow: { name: 'Cung binh', icon: '➶', color: '#d9b580', beats: 'shield', text: '+10% ATK · khắc Thuẫn binh' },
  cavalry: { name: 'Kỵ binh', icon: '♞', color: '#baa8e5', beats: 'bow', text: '+15 nộ ban đầu · khắc Cung binh' },
};
export const combatProfiles = Object.fromEntries(heroes.map(h=>[h.id,{kind:h.skill.operations.find(o=>o.effect==='damage')?.damageType||'magic',armor:h.roles.includes('tank')?42:28,resist:h.roles.includes('mage')?35:25,crit:.05}]));
export function calculateDamage(actor, target, factor, options = {}) {
  const type = options.type || 'physical';
  const attack = type === 'magic' ? actor.magicAtk ?? actor.atk : actor.physicalAtk ?? actor.atk;
  const rawDefense = type === 'magic' ? target.resist || 0 : (target.armor || 0) * (target.exposed > 0 ? .75 : 1);
  const mitigation = 100 / (100 + Math.max(0, rawDefense));
  const elemental=elementalMultiplier(actor.element,target.element);
  const strength = actor.maxHp ? .6 + .4 * Math.max(0, Math.min(1, actor.hp / actor.maxHp)) : 1;
  const amount = Math.max(1, Math.round(attack * factor * mitigation * elemental * strength * (actor.boost > 0 ? 1.2 : 1) * (target.marked > 0 ? 1.25 : 1) * (options.armyBonus || 1) * (options.reduction || 1) * (options.critical ? 1.5 : 1)));
  return { amount, type, mitigation, elemental, strength, defense: rawDefense, critical: Boolean(options.critical) };
}
function addReserves(s, type, amount) {
  if (!s.regiments) s.regiments = { shield: s.troops, spear: 0, bow: 0, cavalry: 0 };
  const count = Math.min(amount, 1000 - s.troops);
  s.regiments[type] += count; s.troops += count;
}
export function kingdomInitial(now = Date.now()) {
  return normalizeAccount({ version: 2, coins: 1800, pity: 0, pulls: 0, wins: 0, owned: ['zhaoyun','bajie','diaochan','nezha','zhugeliang','liubei','huangzhong','liaohua','lusu'], team: ['zhaoyun', 'bajie', 'nezha', 'zhugeliang'], overrides: {}, resources: { food: 1800, wood: 1600, stone: 1000 }, levels: Object.fromEntries(structures.map(b => [b.id, 1])), troops: 180, regiments: { shield: 80, spear: 40, bow: 40, cavalry: 20 }, troopType: 'shield', construction: null, training: null, march: null, battle: null, cleared: [], dragon: 'Hỏa', lastTick: now, autoSkill: true, paused: false });
}
export function activeBonds(team) { return bonds.filter(b => b.ids.filter(id=>team.includes(id)).length >= (b.required||b.ids.length)); }
export function elementalResonance(team) {
  const counts = Object.fromEntries(elementNames.map(e => [e, team.filter(id => heroes.find(h => h.id === id)?.element === e).length]));
  const element = Object.keys(counts).find(e => counts[e] >= 3);
  return { element: element || null, bonus: element ? counts[element] >= 4 ? Math.min(.28,.18+(counts[element]-4)*.02) : .1 : 0 };
}
export function upgradePrice(state, id) {
  if (!structures.some(b => b.id === id)) throw new Error('Công trình không hợp lệ.');
  const level = state.levels[id];
  return { food: Math.ceil(100*level*(1+(level-1)*.1)), wood: Math.ceil(160*level*(1+(level-1)*.1)), stone: Math.ceil(90*level*(1+(level-1)*.1)) };
}
export function upgradeStructure(state, id) {
  const price = upgradePrice(state, id), level = state.levels[id];
  if (level >= buildingLevelMax) throw new Error('Công trình đã đạt cấp tối đa (100).');
  if (id !== 'hall' && level >= state.levels.hall) throw new Error('Nâng Đại điện trước để mở giới hạn cấp.');
  if (Object.keys(price).some(k => state.resources[k] < price[k])) throw new Error('Chưa đủ tài nguyên.');
  const next = structuredClone(state);
  for (const k of Object.keys(price)) next.resources[k] -= price[k];
  next.levels[id]++;
  return next;
}
export function startConstruction(state, id, now = Date.now()) {
  if (state.construction) throw new Error('Một công trình đang nâng cấp. Chờ hoàn tất hoặc tăng tốc.');
  const next = upgradeStructure(state, id);
  const target = next.levels[id]; next.levels[id]--;
  next.construction = { id, target, endsAt: now + Math.max(.5,constructionSeconds(state.levels[id])/(1+vipBonuses(state).construction+(skinBonus(state).construction||0))-vipBonuses(state).freeBuildSeconds)*1000 };
  return next;
}
export function accelerateConstruction(state) {
  if (!state.construction) throw new Error('Không có công trình đang xây dựng.');
  if (state.coins < 50) throw new Error('Cần 50 linh ngọc để hoàn tất ngay.');
  const next = structuredClone(state); next.coins -= 50;
  initChronicle(next);next.chronicle.stats.builds++;awardPlayerXP(next,100*next.construction.target); next.levels[next.construction.id] = next.construction.target; next.construction = null;
  return next;
}
export function trainTroops(state,now=Date.now(),type=state.troopType||'shield'){
 if(!Object.hasOwn(troopTypes,type))throw new Error('Binh chủng không hợp lệ.');
 const next=normalizeTraining(structuredClone(state));if(next.trainingQueues[type])throw new Error('Binh chủng này đang huấn luyện. Các doanh trại khác vẫn hoạt động riêng.');
 const incoming=trainingJobs(next).reduce((n,j)=>n+j.amount,0),deployed=deployedUnits(next);
 if(next.troops+incoming+deployed+woundedTotal(next)+20>1000)throw new Error('Kho quân đã đủ chỗ cho 1.000 quân kể cả quân đang luyện/hành quân.');
 if(next.resources.food<160||next.resources.wood<80)throw new Error('Cần 160 lương thực và 80 gỗ.');
 next.resources.food-=160;next.resources.wood-=80;next.trainingQueues[type]={amount:20,type,endsAt:now+Math.max(4000,14000-next.levels.barracks*2000)/(1+vipBonuses(next).training+(skinBonus(next).training||0))};return normalizeTraining(next);
}
export function economyTick(state, now = Date.now()) {
  const next = normalizeTraining(structuredClone(state));
  next.lastTick = Math.max(state.lastTick, now);
  // Only player-started production exists; completed batches wait for collection.
  finishHealing(next,now);
  for(const [type,job] of Object.entries(next.trainingQueues))if(job&&now>=job.endsAt){initChronicle(next);next.chronicle.stats.trainings++;awardPlayerXP(next,30);addReserves(next,type,job.amount);next.trainingQueues[type]=null;}normalizeTraining(next);
  if (next.construction && now >= next.construction.endsAt) { initChronicle(next);next.chronicle.stats.builds++;awardPlayerXP(next,100*next.construction.target); next.levels[next.construction.id] = next.construction.target; next.construction = null; }
  return next;
}
export function dispatchMarch(state, nodeId) {
  const node = worldNodes.find(n => n.id === nodeId);
  if (!node || node.type === 'home') throw new Error('Chọn trại địch hoặc điểm tài nguyên.');
  if(state.worldAI?.expedition)throw new Error('Đội khu vực đang hoạt động.');
  if(state.battle&&!state.battle.winner)throw new Error('Hoàn tất trận đang chạy trước.');
  if (state.march) throw new Error('Một đội đang hành quân. Chờ đội trở về.');
  if (!state.team.length || state.team.length > 5) throw new Error('Xếp từ 1 đến 5 anh hùng vào đội hình.');
  if (state.troops < 60) throw new Error('Cần 60 quân để xuất chinh. Hãy huấn luyện thêm.');
  const type = state.troopType || 'shield';
  if (!Object.hasOwn(troopTypes, type)) throw new Error('Binh chủng không hợp lệ.');
  if ((state.regiments?.[type] ?? state.troops) < 60) throw new Error(`Cần 60 ${troopTypes[type].name}. Chọn binh chủng khác hoặc huấn luyện thêm.`);
  const next = structuredClone(state);
  if (!next.regiments) next.regiments = { shield: state.troops, spear: 0, bow: 0, cavalry: 0 };
  next.regiments[type] -= 60;
  next.troops -= 60; next.battle = null;
  next.march = { nodeId, type, units: 60, stage: 'marching', progress: 0, duration: (6 + node.level * 2)/(1+vipBonuses(state).march+troopStats(state).march+(skinBonus(state).march||0)+(['shield','spear'].includes(state.troopType)?technologyBonus(state,'infantry','march'):0)), rewarded: false };
  return next;
}
export function createSkirmish(state,nodeId){const node=worldNodes.find(n=>n.id===nodeId&&n.type==='camp');if(!node||!state.team.length||state.team.length>5)throw new Error('Đội hình hoặc mục tiêu không hợp lệ.');return createTacticsBattle(state,node,activeBonds(state.team).map(b=>b.id),elementalResonance(state.team));}
export function castCommander(battle,key,skillIndex=0){return castTactics(battle,key,skillIndex);}
export function combatTick(battle,delta,autoSkill=true,dragon='Hỏa',dragonLevel=1){return tickTactics(battle,delta,autoSkill,dragon,dragonLevel);}
export function formationTarget(units,column=0){return tacticsTarget(units,column);}
export function worldTick(state, delta) {
  const next = structuredClone(state), m = next.march;
  if (!m || next.paused) return next;
  const dt = Math.max(0, Math.min(5, delta));
  const node = worldNodes.find(n => n.id === m.nodeId);
  if (m.stage === 'combat') {
    next.battle = combatTick(next.battle, dt, next.autoSkill, next.dragon, next.levels.dragon);
    if (next.battle.winner) {
      const startedUnits=m.units;
      registerBattle(next,next.battle.winner==='ally');
      if (next.battle.winner === 'ally') {
        const first = !next.cleared.includes(node.id);
        const coins = Math.round((first ? 200 * node.level : 60 * node.level)*(1+(petBonus(next).loot||0)));
        next.battle.reward = { coins, food: 150 * node.level, wood: 100 * node.level };
        next.coins += coins;
        next.resources.food = Math.min(9999999,next.resources.food+150*node.level); next.resources.wood = Math.min(9999999,next.resources.wood+100*node.level);
        if (first) next.cleared.push(node.id);
        grantHeroXP(next,40*node.level); awardPlayerXP(next,120*node.level); next.wins++; m.units = Math.max(15, Math.round(m.units * .8));
      } else m.units = Math.round(m.units * .5);
      next.battle.casualties=recordCasualties(next,m.type||next.troopType,startedUnits-m.units);recordBattleMail(next,next.battle,{target:node.name,mode:'world'});m.rewarded = true; m.stage = 'returning'; m.progress = 0; m.duration = 6/(1+vipBonuses(next).march+troopStats(next).march+(skinBonus(next).march||0)+(['shield','spear'].includes(next.troopType)?technologyBonus(next,'infantry','march'):0));
    }
  } else {
    m.progress += dt;
    if (m.progress >= m.duration) {
      m.progress = 0;
      if (m.stage === 'marching') {
        if (node.type === 'camp') { m.stage = 'combat'; next.battle = createSkirmish(next, node.id); }
        else { m.stage = 'gathering'; m.duration = 20/(1+vipBonuses(next).gather+(skinBonus(next).gather||0)+(petBonus(next).gather||0)); }
      } else if (m.stage === 'gathering') { initChronicle(next);next.chronicle.stats.gathers++;awardPlayerXP(next,70); next.resources[node.type] = Math.min(9999999, next.resources[node.type] + Math.round(500*(1+(petBonus(next).gatherYield||0)))); m.rewarded = true; m.stage = 'returning'; m.duration = 6/(1+vipBonuses(next).march+troopStats(next).march+(skinBonus(next).march||0)+(['shield','spear'].includes(next.troopType)?technologyBonus(next,'infantry','march'):0)); }
      else if (m.stage === 'returning') { addReserves(next, m.type || 'shield', m.units); next.march = null; }
    }
  }
  return next;
}
export function recallMarch(state) {
  if (!state.march) throw new Error('Không có đội hành quân.');
  const next = structuredClone(state);
  if (next.march.stage === 'returning') return next;
  if (next.march.stage === 'combat') { const beforeUnits=next.march.units; next.march.units = Math.floor(next.march.units * .9); next.battle.casualties=recordCasualties(next,next.march.type||'shield',beforeUnits-next.march.units); next.battle.winner = 'retreat';recordBattleMail(next,next.battle,{target:worldNodes.find(n=>n.id===next.march.nodeId).name,mode:'world'}); }
  next.march.stage = 'returning'; next.march.progress = 0; next.march.duration = 6;
  return next;
}

// Saves store durable progression only. In-flight combat is intentionally not imported.
export function durableSave(state) {
  const s = syncActiveSquad(structuredClone(state));
  if (s.march) addReserves(s, s.march.type || 'shield', s.march.units);
  if(s.worldAI){s.strongholds.marches=[...(s.strongholds.marches||[]),...deployments(s).filter(e=>e.kind==='stronghold').map(e=>strongholdMarchSave(e))];for(const e of deployments(s))if(e.kind!=='stronghold')addReserves(s,e.type,e.units);s.worldAI.expedition=null;s.worldAI.expeditions=[];for(const stock of Object.values(s.worldAI.wild||{}))stock.reserved=0;}s.campaignBattle=null;delete s.cityCelebration;
  s.march = null; s.battle = null;if(s.campaign){s.campaign.autoAdvance=false;s.campaign.autoReplay=false;s.campaign.paused=false;}
  return s;
}
export function validKingdomState(s) {
  if (!s || s.version !== 2 || !Array.isArray(s.team) || s.team.length > 9 || new Set(s.team).size !== s.team.length || !s.team.every(id=>s.owned?.includes(id)) || !validState({ ...s, version: 1, team:s.team.slice(0,5) }) || !validProgression(s) || !validAccount(s)) return false;
  const finite = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 9999999;
  if (s.troopType !== undefined && !Object.hasOwn(troopTypes, s.troopType)) return false;
  if (s.regiments !== undefined && (!s.regiments || !Object.keys(troopTypes).every(type => Number.isInteger(s.regiments[type]) && s.regiments[type] >= 0 && s.regiments[type] <= 1000) || Object.values(s.regiments).reduce((n, v) => n + v, 0) !== s.troops)) return false;
  if (s.training?.type !== undefined && !Object.hasOwn(troopTypes, s.training.type)) return false;
  if (s.construction !== undefined && s.construction !== null && (!s.construction || !structures.some(b => b.id === s.construction.id) || s.construction.target !== s.levels?.[s.construction.id] + 1 || s.construction.target > buildingLevelMax || (s.construction.id !== 'hall' && s.construction.target > s.levels.hall) || !Number.isFinite(s.construction.endsAt) || s.construction.endsAt < 0 || s.construction.endsAt > Date.now() + 86400000)) return false;
  return s.resources && ['food', 'wood', 'stone'].every(k => finite(s.resources[k])) && s.levels && structures.every(b => b.id==='infirmary'&&s.levels[b.id]===undefined||Number.isInteger(s.levels[b.id]) && s.levels[b.id] >= 1 && s.levels[b.id] <= buildingLevelMax) && structures.every(b => b.id === 'hall' || b.id==='infirmary'&&s.levels[b.id]===undefined || s.levels[b.id] <= s.levels.hall) && Number.isInteger(s.troops) && s.troops >= 0 && s.troops <= 1000 && Number.isFinite(s.lastTick) && s.lastTick >= 0 && s.lastTick <= Date.now() + 86400000 && canUseDragon(s,s.dragon) && typeof s.autoSkill === 'boolean' && typeof s.paused === 'boolean' && Array.isArray(s.cleared) && s.cleared.length <= 3 && new Set(s.cleared).size === s.cleared.length && s.cleared.every(id => worldNodes.some(n => n.id === id && n.type === 'camp')) && s.march === null && s.battle === null && (s.campaignBattle===undefined||s.campaignBattle===null) && validTraining(s);
}
export function migrateKingdom(s, now = Date.now()) {
  if (validKingdomState(s)) return economyTick(normalizeAccount({ ...s, troopType: s.troopType || 'shield', regiments: s.regiments || { shield: s.troops, spear: 0, bow: 0, cavalry: 0 }, construction: s.construction || null }), now);
  if (validState(s)) return normalizeAccount({ ...kingdomInitial(now), formation:undefined, account:undefined, coins: s.coins, pity: s.pity, pulls: s.pulls, wins: s.wins, owned: [...s.owned], team: s.team.slice(0, 9), overrides: structuredClone(s.overrides) });
  throw new Error('Bản lưu không hợp lệ hoặc không hỗ trợ.');
}
