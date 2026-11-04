import { heroes, validState } from './game.mjs';

export const skills = {
  wukong: { name: 'Đại Náo Thiên Cung', text: 'Gậy Như Ý đánh toàn bộ địch (130% ATK), tạo phân thân đánh thêm mục tiêu chính (100%).', fx: 'monkey', role: 'Đột kích', color: '#ffca65' },
  guanyu: { name: 'Thanh Long Yển Nguyệt', text: 'Chém hàng trước (230% ATK), giảm 25% giáp mục tiêu trong 4 giây.', fx: 'crescent', role: 'Tiền phong', color: '#72e09a' },
  nezha: { name: 'Hỏa Luân Liên Kích', text: 'Vòng lửa đánh toàn bộ địch (110% ATK), thiêu đốt 15 sát thương/giây trong 3 giây.', fx: 'flame', role: 'Pháp công', color: '#ff7653' },
  zhugeliang: { name: 'Bát Trận Đồ', text: 'Hồi 24% HP tối đa cho toàn đội, dựng khiên 30 HP và tăng 20% ATK trong 4 giây.', fx: 'formation', role: 'Quân sư', color: '#7fcfff' },
  erlang: { name: 'Thiên Nhãn Khai Quang', text: 'Tia thiên nhãn đánh địch thấp máu nhất (280% ATK), đánh dấu khiến địch chịu thêm 25% sát thương trong 4 giây.', fx: 'beam', role: 'Sát thủ', color: '#b79cff' },
  zhaoyun: { name: 'Thất Tiến Thất Xuất', text: 'Ba nhát thương vào địch thấp máu nhất (mỗi nhát 95% ATK), nhận khiên 45 HP.', fx: 'spear', role: 'Kỵ tướng', color: '#7ee8e5' },
  bajie: { name: 'Thiên Bồng Hộ Trận', text: 'Đập cào toàn bộ địch (80% ATK), tạo khiên 55 HP cho toàn đội; tự hồi 30% HP.', fx: 'quake', role: 'Hộ vệ', color: '#dfb278' },
  diaochan: { name: 'Bế Nguyệt Liên Hoàn', text: 'Vũ khúc đánh toàn bộ địch (90% ATK), mê hoặc khiến chúng mất đòn đánh kế tiếp, hồi 35 HP cho đồng minh yếu nhất.', fx: 'petal', role: 'Khống chế', color: '#f9a6d6' },
};
export const bonds = [
  { id: 'pilgrimage', name: 'Đồng Hành Thỉnh Kinh', ids: ['wukong', 'bajie'], text: '+15% HP toàn đội. Ngộ Không xuất chiêu: Bát Giới trợ kích toàn bộ địch (50% ATK).', lore: 'Tôn Ngộ Không và Trư Bát Giới cùng hộ tống Đường Tăng trong Tây Du Ký.' },
  { id: 'shu', name: 'Long Đảm Ngọa Long', ids: ['zhugeliang', 'zhaoyun'], text: '+12% ATK toàn đội. Bát Trận Đồ kích hoạt một đòn thương của Triệu Vân (180% ATK).', lore: 'Gia Cát Lượng và Triệu Vân cùng phụng sự Thục Hán; combo là diễn giải cho gameplay.' },
  { id: 'generals', name: 'Hổ Tướng Thục Hán', ids: ['guanyu', 'zhaoyun'], text: 'Giảm 10% sát thương toàn đội. Quan Vũ xuất chiêu: thêm một đợt sóng đao 70% ATK toàn bộ địch.', lore: 'Quan Vũ và Triệu Vân thuộc Ngũ Hổ Tướng trong Tam Quốc diễn nghĩa.' },
  { id: 'investiture', name: 'Song Thần Phạt Trụ', ids: ['nezha', 'erlang'], text: '+20% nộ khí từ đòn đánh. Na Tra xuất chiêu: Thiên Nhãn gây thêm 120% ATK lên địch đã bị đánh dấu.', lore: 'Na Tra và Dương Tiễn cùng giúp nhà Chu trong Phong Thần diễn nghĩa.' },
];
export const structures = [
  { id: 'hall', name: 'Đại điện', icon: '♜', x: 8, y: 4, color: '#b7454e', text: 'Trung tâm thành trì. Mở giới hạn nâng cấp các công trình.' },
  { id: 'farm', name: 'Nông trang', icon: '♧', x: 4, y: 12, color: '#b99f45', text: 'Sản xuất lương thực: 2 × cấp mỗi giây.' },
  { id: 'wood', name: 'Xưởng gỗ', icon: '♠', x: 15, y: 11, color: '#628853', text: 'Sản xuất gỗ: 2 × cấp mỗi giây.' },
  { id: 'stone', name: 'Mỏ đá', icon: '◆', x: 14, y: 5, color: '#768c9c', text: 'Sản xuất đá: 1 × cấp mỗi giây.' },
  { id: 'barracks', name: 'Doanh trại', icon: '⚑', x: 4, y: 6, color: '#578aaa', text: 'Huấn luyện binh lính và tăng HP và ATK đội viễn chinh thêm 5% mỗi cấp.' },
  { id: 'dragon', name: 'Điện linh long', icon: '✧', x: 12, y: 15, color: '#a478be', text: 'Linh long hồi nộ để hỗ trợ toàn đội. Nâng cấp tăng sức mạnh long tức.' },
];
export const worldNodes = [
  { id: 'home', name: 'Thiên Mệnh Thành', x: 10, y: 10, type: 'home', level: 1 },
  { id: 'camp1', name: 'Trại Hoàng Cân', x: 3, y: 8, type: 'camp', level: 1, enemies: ['bajie', 'zhaoyun', 'nezha'] },
  { id: 'camp2', name: 'Bến Xích Bích', x: 15, y: 7, type: 'camp', level: 2, enemies: ['guanyu', 'zhugeliang', 'diaochan', 'zhaoyun'] },
  { id: 'camp3', name: 'Hổ Lao Quan', x: 13, y: 16, type: 'camp', level: 3, enemies: ['wukong', 'erlang', 'guanyu', 'nezha'] },
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
export const combatProfiles = {
  wukong: { kind: 'physical', armor: 28, resist: 20, crit: .12 },
  guanyu: { kind: 'physical', armor: 35, resist: 24, crit: .08 },
  nezha: { kind: 'magic', armor: 18, resist: 28, crit: .08 },
  zhugeliang: { kind: 'magic', armor: 18, resist: 34, crit: .05 },
  erlang: { kind: 'magic', armor: 26, resist: 30, crit: .1 },
  zhaoyun: { kind: 'physical', armor: 30, resist: 22, crit: .1 },
  bajie: { kind: 'physical', armor: 40, resist: 28, crit: .05 },
  diaochan: { kind: 'magic', armor: 18, resist: 32, crit: .05 },
};
export function calculateDamage(actor, target, factor, options = {}) {
  const type = options.type || 'physical';
  const attack = type === 'magic' ? actor.magicAtk ?? actor.atk : actor.physicalAtk ?? actor.atk;
  const rawDefense = type === 'magic' ? target.resist || 0 : (target.armor || 0) * (target.exposed > 0 ? .75 : 1);
  const mitigation = 100 / (100 + Math.max(0, rawDefense));
  const elemental = { Hỏa: 'Mộc', Mộc: 'Thủy', Thủy: 'Hỏa' }[actor.element] === target.element ? 1.25 : 1;
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
  return { version: 2, coins: 1800, pity: 0, pulls: 0, wins: 0, owned: ['zhaoyun', 'bajie', 'diaochan', 'nezha', 'zhugeliang'], team: ['zhaoyun', 'bajie', 'nezha', 'zhugeliang'], overrides: {}, resources: { food: 1800, wood: 1600, stone: 1000 }, levels: Object.fromEntries(structures.map(b => [b.id, 1])), troops: 180, regiments: { shield: 80, spear: 40, bow: 40, cavalry: 20 }, troopType: 'shield', construction: null, training: null, march: null, battle: null, cleared: [], dragon: 'Hỏa', lastTick: now, autoSkill: true, paused: false };
}
export function activeBonds(team) { return bonds.filter(b => b.ids.every(id => team.includes(id))); }
export function elementalResonance(team) {
  const counts = Object.fromEntries(['Hỏa', 'Mộc', 'Thủy'].map(e => [e, team.filter(id => heroes.find(h => h.id === id)?.element === e).length]));
  const element = Object.keys(counts).find(e => counts[e] >= 3);
  return { element: element || null, bonus: element ? counts[element] === 4 ? .18 : .1 : 0 };
}
export function upgradePrice(state, id) {
  if (!structures.some(b => b.id === id)) throw new Error('Công trình không hợp lệ.');
  const level = state.levels[id];
  return { food: 100 * level, wood: 160 * level, stone: 90 * level };
}
export function upgradeStructure(state, id) {
  const price = upgradePrice(state, id), level = state.levels[id];
  if (level >= 5) throw new Error('Công trình đã đạt cấp tối đa (5).');
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
  next.construction = { id, target, endsAt: now + (8 + state.levels[id] * 4) * 1000 };
  return next;
}
export function accelerateConstruction(state) {
  if (!state.construction) throw new Error('Không có công trình đang xây dựng.');
  if (state.coins < 50) throw new Error('Cần 50 linh ngọc để hoàn tất ngay.');
  const next = structuredClone(state); next.coins -= 50;
  next.levels[next.construction.id] = next.construction.target; next.construction = null;
  return next;
}
export function trainTroops(state, now = Date.now(), type = state.troopType || 'shield') {
  if (!Object.hasOwn(troopTypes, type)) throw new Error('Binh chủng không hợp lệ.');
  if (state.training) throw new Error('Doanh trại đang huấn luyện.');
  if (state.troops > 980) throw new Error('Giới hạn 1.000 quân trong thành.');
  if (state.resources.food < 160 || state.resources.wood < 80) throw new Error('Cần 160 lương thực và 80 gỗ.');
  const next = structuredClone(state);
  next.resources.food -= 160; next.resources.wood -= 80;
  next.training = { amount: 20, type, endsAt: now + Math.max(4000, 14000 - state.levels.barracks * 2000) };
  return next;
}
export function economyTick(state, now = Date.now()) {
  const next = structuredClone(state);
  const elapsed = Math.max(0, Math.min(28800, (now - state.lastTick) / 1000));
  next.lastTick = Math.max(state.lastTick, now);
  for (const [resource, building, rate] of [['food', 'farm', 2], ['wood', 'wood', 2], ['stone', 'stone', 1]]) next.resources[resource] = Math.min(999999, next.resources[resource] + elapsed * state.levels[building] * rate);
  if (next.training && now >= next.training.endsAt) { addReserves(next, next.training.type || 'shield', next.training.amount); next.training = null; }
  if (next.construction && now >= next.construction.endsAt) { next.levels[next.construction.id] = next.construction.target; next.construction = null; }
  return next;
}
export function dispatchMarch(state, nodeId) {
  const node = worldNodes.find(n => n.id === nodeId);
  if (!node || node.type === 'home') throw new Error('Chọn trại địch hoặc điểm tài nguyên.');
  if (state.march) throw new Error('Một đội đang hành quân. Chờ đội trở về.');
  if (state.team.length !== 4) throw new Error('Chọn đúng 4 anh hùng trong đội viễn chinh.');
  if (state.troops < 60) throw new Error('Cần 60 quân để xuất chinh. Hãy huấn luyện thêm.');
  const type = state.troopType || 'shield';
  if (!Object.hasOwn(troopTypes, type)) throw new Error('Binh chủng không hợp lệ.');
  if ((state.regiments?.[type] ?? state.troops) < 60) throw new Error(`Cần 60 ${troopTypes[type].name}. Chọn binh chủng khác hoặc huấn luyện thêm.`);
  const next = structuredClone(state);
  if (!next.regiments) next.regiments = { shield: state.troops, spear: 0, bow: 0, cavalry: 0 };
  next.regiments[type] -= 60;
  next.troops -= 60; next.battle = null;
  next.march = { nodeId, type, units: 60, stage: 'marching', progress: 0, duration: 6 + node.level * 2, rewarded: false };
  return next;
}
function makeUnit(id, side, index, scale, state) {
  const h = heroes.find(hero => hero.id === id);
  const data = { ...h, ...(side === 'ally' ? state.overrides[id] : {}) };
  const maxHp = Math.round(data.hp * 2 * scale);
  return { id, key: `${side}-${index}`, side, name: h.name, element: h.element, maxHp, hp: maxHp, atk: Math.round(data.atk * scale), armor: combatProfiles[id].armor, resist: combatProfiles[id].resist, energy: 40, shield: 0, burn: 0, exposed: 0, marked: 0, stun: 0, boost: 0, damageDealt: 0 };
}
export function createSkirmish(state, nodeId) {
  const node = worldNodes.find(n => n.id === nodeId && n.type === 'camp');
  if (!node || state.team.length !== 4) throw new Error('Đội hình hoặc mục tiêu không hợp lệ.');
  const bondIds = activeBonds(state.team).map(b => b.id);
  const resonance = elementalResonance(state.team);
  const allies = state.team.map((id, i) => makeUnit(id, 'ally', i, 1 + state.levels.barracks * .05, state));
  for (const unit of allies) {
    unit.atk = Math.round(unit.atk * (1 + (bondIds.includes('shu') ? .12 : 0) + resonance.bonus));
    unit.maxHp = Math.round(unit.maxHp * (1 + (bondIds.includes('pilgrimage') ? .15 : 0) + resonance.bonus)); unit.hp = unit.maxHp;
    if (state.troopType === 'shield') { unit.maxHp = Math.round(unit.maxHp * 1.12); unit.hp = unit.maxHp; }
    if (state.troopType === 'bow' || state.troopType === 'spear') unit.atk = Math.round(unit.atk * (state.troopType === 'bow' ? 1.1 : 1.05));
    if (state.troopType === 'cavalry') unit.energy += 15;
  }
  const enemies = node.enemies.map((id, i) => makeUnit(id, 'enemy', i, .6 + node.level * .25, state));
  for (const unit of [...allies, ...enemies]) { unit.physicalAtk = unit.atk; unit.magicAtk = Math.round(unit.atk * (combatProfiles[unit.id].kind === 'magic' ? 1.12 : .8)); }
  return { nodeId, troopType: state.troopType || 'shield', enemyTroopType: ['spear', 'cavalry', 'bow'][node.level - 1], allies, enemies, bonds: bondIds, clock: 0, accumulator: 0, dragonEnergy: 0, winner: null, rng: node.level * 999 + state.team.join('').split('').reduce((n, c) => n + c.charCodeAt(0), 0), damageStats: { physical: 0, magic: 0, pure: 0, absorbed: 0, criticals: 0 }, events: [], serial: 0, log: [`Đã giao chiến tại ${node.name}.`] };
}
function emit(b, kind, actor, text, targets = []) {
  b.events.push({ serial: ++b.serial, at: b.clock, kind, actor: actor?.id || null, side: actor?.side || 'ally', text, targets });
  b.events = b.events.slice(-16); b.log.push(text); b.log = b.log.slice(-30);
}
const living = units => units.filter(u => u.hp > 0);
const weakest = units => living(units).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
function hurt(b, actor, target, factor, type = combatProfiles[actor.id]?.kind || 'magic') {
  if (!target || target.hp <= 0) return;
  const defense = target.side === 'ally' && b.bonds.includes('generals') ? .9 : 1;
  const armyType = actor.side === 'ally' ? b.troopType : b.enemyTroopType, foeType = actor.side === 'ally' ? b.enemyTroopType : b.troopType;
  const armyBonus = actor.side && troopTypes[armyType]?.beats === foeType ? 1.2 : 1;
  b.rng = (Math.imul(1664525, b.rng) + 1013904223) >>> 0;
  const critical = b.rng / 4294967296 < (combatProfiles[actor.id]?.crit || 0);
  const damage = calculateDamage(actor, target, factor, { type, armyBonus, reduction: defense, critical }).amount;
  const absorbed = Math.min(target.shield, damage); target.shield -= absorbed;
  const actual = Math.min(target.hp, damage - absorbed);
  target.hp = Math.max(0, target.hp - damage + absorbed);
  actor.damageDealt = (actor.damageDealt || 0) + actual;
  b.damageStats[type] += actual; b.damageStats.absorbed += absorbed; if (critical) b.damageStats.criticals++;
}
function heal(target, amount) { if (target && target.hp > 0) target.hp = Math.min(target.maxHp, target.hp + Math.round(amount)); }
function checkWinner(b) {
  if (!living(b.enemies).length) b.winner = 'ally';
  else if (!living(b.allies).length) b.winner = 'enemy';
  else if (b.clock >= 180) b.winner = 'enemy';
}
function castInPlace(b, key) {
  const actor = [...b.allies, ...b.enemies].find(u => u.key === key);
  if (!actor || actor.hp <= 0 || actor.energy < 100 || actor.stun > 0 || b.winner) return false;
  const own = actor.side === 'ally' ? b.allies : b.enemies, foes = actor.side === 'ally' ? b.enemies : b.allies;
  const target = weakest(foes); if (!target) return false;
  actor.energy = 0;
  switch (actor.id) {
    case 'wukong': living(foes).forEach(t => hurt(b, actor, t, 1.3)); hurt(b, actor, target, 1); break;
    case 'guanyu': { const front = living(foes)[0]; hurt(b, actor, front, 2.3); if (front.hp > 0) front.exposed = 4; break; }
    case 'nezha': living(foes).forEach(t => { hurt(b, actor, t, 1.1); if (t.hp > 0) t.burn = 3; }); break;
    case 'zhugeliang': living(own).forEach(t => { heal(t, t.maxHp * .24); t.shield = Math.max(t.shield, 30); t.boost = 4; }); break;
    case 'erlang': hurt(b, actor, target, 2.8); if (target.hp > 0) target.marked = 4; break;
    case 'zhaoyun': for (let i = 0; i < 3; i++) hurt(b, actor, weakest(foes), .95); actor.shield = Math.max(actor.shield, 45); break;
    case 'bajie': living(foes).forEach(t => hurt(b, actor, t, .8)); living(own).forEach(t => { t.shield = Math.max(t.shield, 55); }); heal(actor, actor.maxHp * .3); break;
    case 'diaochan': living(foes).forEach(t => { hurt(b, actor, t, .9); if (t.hp > 0) t.stun = 1; }); heal(weakest(own), 35); break;
  }
  emit(b, skills[actor.id].fx, actor, `${actor.name}: ${skills[actor.id].name}`, foes.filter(t => t.hp > 0).map(t => t.key));
  if (actor.side === 'ally') {
    const partner = id => own.find(u => u.id === id && u.hp > 0);
    if (actor.id === 'wukong' && b.bonds.includes('pilgrimage') && partner('bajie')) { living(foes).forEach(t => hurt(b, partner('bajie'), t, .5)); emit(b, 'combo', actor, 'COMBO · Đồng Hành Thỉnh Kinh — Thiên Bồng trợ kích!'); }
    if (actor.id === 'zhugeliang' && b.bonds.includes('shu') && partner('zhaoyun')) { hurt(b, partner('zhaoyun'), weakest(foes), 1.8); emit(b, 'combo', actor, 'COMBO · Long Đảm Ngọa Long — Long thương phá trận!'); }
    if (actor.id === 'guanyu' && b.bonds.includes('generals') && partner('zhaoyun')) { living(foes).forEach(t => hurt(b, actor, t, .7)); emit(b, 'combo', actor, 'COMBO · Hổ Tướng Thục Hán — Sóng đao liên hoàn!'); }
    if (actor.id === 'nezha' && b.bonds.includes('investiture') && partner('erlang') && living(foes).some(t => t.marked > 0)) { living(foes).filter(t => t.marked > 0).forEach(t => hurt(b, partner('erlang'), t, 1.2)); emit(b, 'combo', actor, 'COMBO · Song Thần Phạt Trụ — Thiên nhãn dẫn hỏa!'); }
  }
  checkWinner(b); return true;
}
export function castCommander(battle, key) { const b = structuredClone(battle); if (!castInPlace(b, key)) throw new Error('Kỹ năng cần 100 nộ; tướng phải còn sống và không bị mê hoặc.'); return b; }
export function formationTarget(units, column) {
  const order = [column % 2, 1 - column % 2, 2 + column % 2, 3 - column % 2];
  return order.map(i => units[i]).find(u => u && u.hp > 0);
}
export function combatTick(battle, delta, autoSkill = true, dragon = 'Hỏa', dragonLevel = 1) {
  const b = structuredClone(battle); if (b.winner) return b;
  b.accumulator += Math.max(0, Math.min(5, delta));
  while (b.accumulator >= 1 && !b.winner) {
    b.accumulator--; b.clock++;
    for (const u of [...b.allies, ...b.enemies]) {
      if (u.hp <= 0) continue;
      if (u.burn > 0) { b.damageStats.pure += Math.min(15, u.hp); u.hp = Math.max(0, u.hp - 15); }
      for (const status of ['burn', 'exposed', 'marked', 'boost']) if (u[status] > 0) u[status]--;
    }
    checkWinner(b); if (b.winner) break;
    for (const u of [...b.allies, ...b.enemies]) {
      if (b.winner) break; if (u.hp <= 0) continue;
      if (u.stun > 0) { u.stun--; continue; }
      const foes = u.side === 'ally' ? b.enemies : b.allies;
      const own = u.side === 'ally' ? b.allies : b.enemies;
      const victim = formationTarget(foes, own.indexOf(u) % 2);
      hurt(b, u, victim, .55, 'physical');
      if (victim) { b.events.push({ serial: ++b.serial, at: b.clock, kind: 'attack', actor: u.id, side: u.side, targets: [victim.key], text: '' }); b.events = b.events.slice(-32); }
      u.energy = Math.min(100, u.energy + (u.side === 'ally' && b.bonds.includes('investiture') ? 24 : 20));
      checkWinner(b);
      if (!b.winner && (u.side === 'enemy' || autoSkill) && u.energy >= 100) castInPlace(b, u.key);
    }
    if (b.winner) break;
    b.dragonEnergy = Math.min(100, b.dragonEnergy + 10);
    if (b.dragonEnergy >= 100) {
      b.dragonEnergy = 0; const power = 25 + dragonLevel * 10;
      if (dragon === 'Hỏa') living(b.enemies).forEach(t => hurt(b, { atk: power, element: dragon }, t, 1));
      if (dragon === 'Thủy') living(b.allies).forEach(t => heal(t, power));
      if (dragon === 'Mộc') living(b.allies).forEach(t => { t.shield = Math.max(t.shield, power); });
      emit(b, 'dragon', null, `LINH LONG · ${dragon === 'Hỏa' ? 'Hỏa long phun lửa' : dragon === 'Thủy' ? 'Thủy long hồi sinh lực' : 'Mộc long dựng khiên'} toàn trận!`);
      checkWinner(b);
    }
  }
  return b;
}
export function worldTick(state, delta) {
  const next = structuredClone(state), m = next.march;
  if (!m || next.paused) return next;
  const dt = Math.max(0, Math.min(5, delta));
  const node = worldNodes.find(n => n.id === m.nodeId);
  if (m.stage === 'combat') {
    next.battle = combatTick(next.battle, dt, next.autoSkill, next.dragon, next.levels.dragon);
    if (next.battle.winner) {
      if (next.battle.winner === 'ally') {
        const first = !next.cleared.includes(node.id);
        const coins = first ? 200 * node.level : 60 * node.level;
        next.battle.reward = { coins, food: 150 * node.level, wood: 100 * node.level };
        next.coins += coins;
        next.resources.food += 150 * node.level; next.resources.wood += 100 * node.level;
        if (first) next.cleared.push(node.id);
        next.wins++; m.units = Math.max(15, Math.round(m.units * .8));
      } else m.units = Math.round(m.units * .5);
      m.rewarded = true; m.stage = 'returning'; m.progress = 0; m.duration = 6;
    }
  } else {
    m.progress += dt;
    if (m.progress >= m.duration) {
      m.progress = 0;
      if (m.stage === 'marching') {
        if (node.type === 'camp') { m.stage = 'combat'; next.battle = createSkirmish(next, node.id); }
        else { m.stage = 'gathering'; m.duration = 20; }
      } else if (m.stage === 'gathering') { next.resources[node.type] = Math.min(999999, next.resources[node.type] + 500); m.rewarded = true; m.stage = 'returning'; m.duration = 6; }
      else if (m.stage === 'returning') { addReserves(next, m.type || 'shield', m.units); next.march = null; }
    }
  }
  return next;
}
export function recallMarch(state) {
  if (!state.march) throw new Error('Không có đội hành quân.');
  const next = structuredClone(state);
  if (next.march.stage === 'returning') return next;
  if (next.march.stage === 'combat') { next.march.units = Math.floor(next.march.units * .9); next.battle.winner = 'retreat'; }
  next.march.stage = 'returning'; next.march.progress = 0; next.march.duration = 6;
  return next;
}

// Saves store durable progression only. In-flight combat is intentionally not imported.
export function durableSave(state) {
  const s = structuredClone(state);
  if (s.march) addReserves(s, s.march.type || 'shield', s.march.units);
  s.march = null; s.battle = null;
  return s;
}
export function validKingdomState(s) {
  if (!s || s.version !== 2 || !validState({ ...s, version: 1 }) || s.team.length > 4) return false;
  const finite = v => typeof v === 'number' && Number.isFinite(v) && v >= 0 && v <= 999999;
  if (s.troopType !== undefined && !Object.hasOwn(troopTypes, s.troopType)) return false;
  if (s.regiments !== undefined && (!s.regiments || !Object.keys(troopTypes).every(type => Number.isInteger(s.regiments[type]) && s.regiments[type] >= 0 && s.regiments[type] <= 1000) || Object.values(s.regiments).reduce((n, v) => n + v, 0) !== s.troops)) return false;
  if (s.training?.type !== undefined && !Object.hasOwn(troopTypes, s.training.type)) return false;
  if (s.construction !== undefined && s.construction !== null && (!s.construction || !structures.some(b => b.id === s.construction.id) || s.construction.target !== s.levels?.[s.construction.id] + 1 || s.construction.target > 5 || (s.construction.id !== 'hall' && s.construction.target > s.levels.hall) || !Number.isFinite(s.construction.endsAt) || s.construction.endsAt < 0 || s.construction.endsAt > Date.now() + 86400000)) return false;
  return s.resources && ['food', 'wood', 'stone'].every(k => finite(s.resources[k])) && s.levels && structures.every(b => Number.isInteger(s.levels[b.id]) && s.levels[b.id] >= 1 && s.levels[b.id] <= 5) && structures.every(b => b.id === 'hall' || s.levels[b.id] <= s.levels.hall) && Number.isInteger(s.troops) && s.troops >= 0 && s.troops <= 1000 && Number.isFinite(s.lastTick) && s.lastTick >= 0 && s.lastTick <= Date.now() + 86400000 && ['Hỏa', 'Thủy', 'Mộc'].includes(s.dragon) && typeof s.autoSkill === 'boolean' && typeof s.paused === 'boolean' && Array.isArray(s.cleared) && s.cleared.length <= 3 && new Set(s.cleared).size === s.cleared.length && s.cleared.every(id => worldNodes.some(n => n.id === id && n.type === 'camp')) && s.march === null && s.battle === null && (s.training === null || s.training && s.training.amount === 20 && Number.isFinite(s.training.endsAt) && s.training.endsAt >= 0 && s.training.endsAt <= Date.now() + 86400000);
}
export function migrateKingdom(s, now = Date.now()) {
  if (validKingdomState(s)) return economyTick({ ...s, troopType: s.troopType || 'shield', regiments: s.regiments || { shield: s.troops, spear: 0, bow: 0, cavalry: 0 }, construction: s.construction || null }, now);
  if (validState(s)) return { ...kingdomInitial(now), coins: s.coins, pity: s.pity, pulls: s.pulls, wins: s.wins, owned: [...s.owned], team: s.team.slice(0, 4), overrides: structuredClone(s.overrides) };
  throw new Error('Bản lưu không hợp lệ hoặc không hỗ trợ.');
}
