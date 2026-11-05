import { characterRoster } from './characters.mjs';

export const heroes = characterRoster;

export function initialState() {
  return { version: 1, coins: 1800, pity: 0, pulls: 0, wins: 0, owned: ['zhaoyun', 'bajie', 'diaochan', 'nezha', 'zhugeliang'], team: ['zhaoyun', 'bajie', 'diaochan', 'nezha', 'zhugeliang'], overrides: {} };
}

export function validState(s) {
  const ids = new Set(heroes.map(h => h.id));
  return s?.version === 1 && Number.isSafeInteger(s.coins) && s.coins >= 0 && Number.isInteger(s.pity) && s.pity >= 0 && s.pity < 30 && Number.isSafeInteger(s.pulls) && s.pulls >= 0 && Number.isSafeInteger(s.wins) && s.wins >= 0 && Array.isArray(s.owned) && s.owned.length <= heroes.length && new Set(s.owned).size === s.owned.length && s.owned.every(id => ids.has(id)) && Array.isArray(s.team) && s.team.length <= 5 && new Set(s.team).size === s.team.length && s.team.every(id => s.owned.includes(id)) && s.overrides && typeof s.overrides === 'object' && !Array.isArray(s.overrides) && Object.entries(s.overrides).every(([id, o]) => ids.has(id) && o && typeof o === 'object' && !Array.isArray(o) && Object.keys(o).every(key => key === 'hp' || key === 'atk') && Number.isInteger(o.hp) && o.hp >= 50 && o.hp <= 300 && Number.isInteger(o.atk) && o.atk >= 10 && o.atk <= 80);
}

export function summon(state, count = 1, random = Math.random) {
  if (![1, 10].includes(count) || state.coins < count * 100) throw new Error('Không đủ linh ngọc để chiêu mộ.');
  const next = structuredClone(state);
  const results = [];
  next.coins -= count * 100;
  for (let i = 0; i < count; i++) {
    const roll = random();
    const rarity = next.pity === 29 || roll < 0.05 ? 'SSR' : roll < 0.3 ? 'SR' : 'R';
    const pool = heroes.filter(h => h.rarity === rarity && !h.vipExclusive);
    const hero = pool[Math.min(pool.length - 1, Math.floor(random() * pool.length))];
    const duplicate = next.owned.includes(hero.id);
    if (duplicate) next.coins += 25;
    else next.owned.push(hero.id);
    next.pity = rarity === 'SSR' ? 0 : next.pity + 1;
    next.pulls++;
    results.push({ ...hero, duplicate });
  }
  return { state: next, results };
}

export function multiplier(attacker, defender) {
  return { Hỏa: 'Mộc', Mộc: 'Thủy', Thủy: 'Hỏa' }[attacker] === defender ? 1.35 : 1;
}

export function createBattle(state) {
  if (state.team.length !== 5) throw new Error('Cần đủ 5 nhân vật để xuất trận.');
  const make = (id, side, index) => {
    const base = heroes.find(h => h.id === id);
    const h = { ...base, ...(side === 'ally' ? state.overrides[id] : {}) };
    return { ...h, key: `${side}-${index}`, side, maxHp: h.hp };
  };
  return { allies: state.team.map((id, i) => make(id, 'ally', i)), enemies: ['zhaoyun', 'nezha', 'bajie', 'erlang', 'diaochan'].map((id, i) => make(id, 'enemy', i)), turn: 1, active: 0, winner: null, log: ['Ải 01 · Hổ Lao Quan. Chọn mục tiêu để tấn công.'] };
}

export function attack(battle, targetKey, skill = false) {
  if (battle.winner) return battle;
  const next = structuredClone(battle);
  const actor = next.allies[next.active];
  const target = next.enemies.find(h => h.key === targetKey && h.hp > 0);
  if (!actor || actor.hp <= 0 || !target) throw new Error('Mục tiêu không hợp lệ.');
  const hit = (a, t, boosted = false) => {
    const damage = Math.round(a.atk * multiplier(a.element, t.element) * (boosted ? 1.6 : 1));
    t.hp = Math.max(0, t.hp - damage);
    next.log.push(`${a.name}${boosted ? ' tung tuyệt kỹ' : ' tấn công'} → ${t.name}: −${damage} HP.`);
  };
  if (skill && next.turn % 3 !== 0) throw new Error('Tuyệt kỹ mở ở vòng 3, 6, 9…');
  hit(actor, target, skill);
  if (next.enemies.every(h => h.hp === 0)) { next.winner = 'ally'; return next; }
  const following = next.allies.findIndex((h, i) => i > next.active && h.hp > 0);
  if (following !== -1) { next.active = following; return next; }
  for (const enemy of next.enemies.filter(h => h.hp > 0)) {
    const victim = next.allies.find(h => h.hp > 0);
    if (!victim) break;
    hit(enemy, victim);
  }
  if (next.allies.every(h => h.hp === 0)) next.winner = 'enemy';
  else { next.turn++; next.active = next.allies.findIndex(h => h.hp > 0); }
  return next;
}
