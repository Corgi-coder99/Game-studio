import test from 'node:test';
import assert from 'node:assert/strict';
import { heroes, initialState } from './game.mjs';
import { skills, kingdomInitial, activeBonds, elementalResonance, upgradeStructure, trainTroops, economyTick, dispatchMarch, createSkirmish, castCommander, combatTick, worldTick, recallMarch, durableSave, validKingdomState, migrateKingdom } from './kingdom.mjs';

const allHeroes = heroes.map(h => h.id);
function fixture(team = ['zhaoyun', 'bajie', 'nezha', 'zhugeliang']) {
  const s = kingdomInitial(); s.owned = [...allHeroes]; s.team = team; return s;
}
function skillBattle(id, team) {
  const s = fixture(team || [id, ...allHeroes.filter(h => h !== id).slice(0, 3)]);
  const b = createSkirmish(s, 'camp3');
  for (const u of b.enemies) { u.hp = 2000; u.maxHp = 2000; }
  for (const u of b.allies) { u.hp = Math.round(u.maxHp / 2); u.energy = 100; }
  return b;
}

test('kingdom save validation, v1 migration and hostile save rejection', () => {
  const s = kingdomInitial(); assert.ok(validKingdomState(s));
  const v1 = initialState(); const migrated = migrateKingdom(v1);
  assert.equal(migrated.team.length, 4); assert.equal(migrated.coins, v1.coins); assert.deepEqual(migrated.owned, v1.owned);
  assert.ok(validKingdomState(migrated));
  assert.equal(validKingdomState({ ...s, resources: { food: NaN, wood: 1, stone: 1 } }), false);
  assert.equal(validKingdomState({ ...s, levels: { ...s.levels, farm: 5 } }), false);
  assert.equal(validKingdomState({ ...s, battle: { winner: 'ally' } }), false);
  assert.throws(() => migrateKingdom({ ...s, dragon: '<script>alert(1)</script>' }));
  assert.throws(() => migrateKingdom({ ...s, overrides: { bajie: { hp: 100, atk: 20, name: '<img src=x>' } } }));
});
test('upgrades deduct resources, require hall capacity and cap at five', () => {
  const s = kingdomInitial(); assert.throws(() => upgradeStructure(s, 'farm'));
  const next = upgradeStructure(s, 'hall');
  assert.equal(next.levels.hall, 2); assert.equal(next.resources.wood, s.resources.wood - 160); assert.equal(s.levels.hall, 1);
  assert.equal(upgradeStructure(next, 'farm').levels.farm, 2);
  assert.throws(() => upgradeStructure({ ...s, resources: { food: 0, wood: 0, stone: 0 } }, 'hall'));
  assert.throws(() => upgradeStructure({ ...s, levels: { ...s.levels, hall: 5 } }, 'hall'));
});
test('economy accrues only capped elapsed time and training completes once', () => {
  const s = kingdomInitial(100000); const trained = trainTroops(s, 100000);
  assert.equal(trained.training.endsAt, 112000); assert.throws(() => trainTroops(trained));
  const finished = economyTick(trained, 112000);
  assert.equal(finished.troops, s.troops + 20); assert.equal(finished.training, null);
  assert.equal(finished.resources.food, s.resources.food - 160 + 24);
  assert.equal(economyTick(finished, 112000).troops, finished.troops);
  assert.equal(economyTick(s, 100000 + 48 * 3600000).resources.food, s.resources.food + 28800 * 2);
  assert.equal(economyTick(s, 0).resources.food, s.resources.food);
});
test('march reserves troops, rejects parallel dispatch and returns gather reward once', () => {
  const s = kingdomInitial(); let next = dispatchMarch(s, 'grain');
  assert.equal(next.troops, s.troops - 60); assert.throws(() => dispatchMarch(next, 'camp1'));
  assert.throws(() => dispatchMarch({ ...s, team: [] }, 'camp1'));
  assert.throws(() => dispatchMarch({ ...s, troops: 59 }, 'camp1'));
  for (let i = 0; i < 60; i++) next = worldTick(next, 1);
  assert.equal(next.resources.food, s.resources.food + 500); assert.equal(next.troops, s.troops); assert.equal(next.march, null);
  assert.equal(worldTick(next, 5).resources.food, next.resources.food);
});
test('pause and recall preserve invariants and in-flight saves recall units', () => {
  const marching = dispatchMarch(kingdomInitial(), 'camp1');
  const paused = { ...marching, paused: true }; assert.deepEqual(worldTick(paused, 5), paused);
  const recalled = recallMarch(marching); assert.equal(recalled.march.stage, 'returning');
  const saved = durableSave(marching); assert.ok(validKingdomState(saved)); assert.equal(saved.troops, 180); assert.equal(saved.march, null);
  assert.equal(marching.troops, 120); assert.equal(marching.march.stage, 'marching');
});
test('bonds require exact partners and elemental resonance requires three or four', () => {
  assert.deepEqual(activeBonds(['zhaoyun', 'zhugeliang']).map(b => b.id), ['shu']);
  assert.deepEqual(activeBonds(['zhaoyun']).map(b => b.id), []);
  assert.equal(elementalResonance(['guanyu', 'zhaoyun', 'diaochan', 'nezha']).bonus, .1);
  assert.equal(elementalResonance(['guanyu', 'zhaoyun', 'diaochan', 'zhugeliang']).element, 'Mộc');
  const base = createSkirmish(fixture(['wukong', 'zhaoyun', 'erlang', 'guanyu']), 'camp1');
  const bonded = createSkirmish(fixture(['wukong', 'bajie', 'erlang', 'guanyu']), 'camp1');
  assert.ok(bonded.allies[0].maxHp > base.allies[0].maxHp);
});
for (const id of allHeroes) test(`${id}: unique skill changes combat state, consumes energy and emits its own VFX`, () => {
  const before = skillBattle(id), actor = before.allies.find(u => u.id === id);
  const next = castCommander(before, actor.key);
  assert.equal(next.allies.find(u => u.id === id).energy, 0); assert.equal(actor.energy, 100);
  assert.ok(next.events.some(e => e.kind === skills[id].fx));
  if (id === 'zhugeliang') { assert.ok(next.allies.every(u => u.hp > before.allies.find(a => a.id === u.id).hp)); assert.ok(next.allies.every(u => u.boost === 4)); }
  else assert.ok(next.enemies.some((u, i) => u.hp < before.enemies[i].hp));
  if (id === 'nezha') assert.ok(next.enemies.every(u => u.burn === 3));
  if (id === 'erlang') assert.ok(next.enemies.some(u => u.marked === 4));
  if (id === 'guanyu') assert.equal(next.enemies[0].exposed, 4);
  if (id === 'diaochan') assert.ok(next.enemies.every(u => u.stun === 1));
  if (id === 'bajie') assert.ok(next.allies.every(u => u.shield >= 55));
  if (id === 'zhaoyun') assert.equal(next.allies.find(u => u.id === id).shield, 45);
});
for (const [id, team, caster] of [
  ['pilgrimage', ['wukong', 'bajie', 'nezha', 'erlang'], 'wukong'],
  ['shu', ['zhugeliang', 'zhaoyun', 'guanyu', 'diaochan'], 'zhugeliang'],
  ['generals', ['guanyu', 'zhaoyun', 'nezha', 'bajie'], 'guanyu'],
  ['investiture', ['nezha', 'erlang', 'bajie', 'diaochan'], 'nezha'],
]) test(`${id}: historical bond triggers an actual follow-up effect`, () => {
  const b = skillBattle(caster, team); b.enemies[0].marked = 4;
  const actor = b.allies.find(u => u.id === caster);
  const without = structuredClone(b); without.bonds = without.bonds.filter(b => b !== id);
  const linked = castCommander(b, actor.key), plain = castCommander(without, actor.key);
  assert.ok(linked.events.some(e => e.kind === 'combo'));
  assert.ok(linked.enemies.reduce((n, u) => n + u.hp, 0) < plain.enemies.reduce((n, u) => n + u.hp, 0));
});
test('manual mode holds skills; invalid cast, death and combat completion are guarded', () => {
  const b = createSkirmish(kingdomInitial(), 'camp3');
  assert.throws(() => castCommander(b, b.allies[0].key));
  const next = combatTick(b, 3, false);
  assert.ok(next.allies.some(u => u.energy === 100));
  assert.ok(!next.events.some(e => e.side === 'ally' && e.actor));
  const dead = structuredClone(b); dead.allies[0].hp = 0; dead.allies[0].energy = 100;
  assert.throws(() => castCommander(dead, dead.allies[0].key));
});
test('each dragon has a distinct gameplay effect', () => {
  const b = skillBattle('bajie'); b.dragonEnergy = 90;
  for (const u of [...b.allies, ...b.enemies]) u.energy = 0;
  const fire = combatTick(b, 1, false, 'Hỏa');
  const water = combatTick(b, 1, false, 'Thủy');
  const wood = combatTick(b, 1, false, 'Mộc');
  assert.ok(fire.events.some(e => e.kind === 'dragon'));
  assert.ok(fire.enemies[1].hp < water.enemies[1].hp);
  assert.ok(water.allies[1].hp > fire.allies[1].hp);
  assert.ok(wood.allies.every(u => u.shield >= 35));
});
test('full real-time expedition settles rewards once and returns survivors', () => {
  const s = kingdomInitial(); let next = dispatchMarch(s, 'camp1');
  for (let i = 0; i < 240 && next.march; i++) next = worldTick(next, 1);
  assert.equal(next.march, null); assert.equal(next.battle.winner, 'ally');
  assert.equal(next.coins, s.coins + 200); assert.equal(next.wins, 1);
  assert.equal(next.troops, s.troops - 12); assert.deepEqual(next.cleared, ['camp1']);
  for (let i = 0; i < 10; i++) next = worldTick(next, 1);
  assert.equal(next.coins, s.coins + 200);
  assert.ok(validKingdomState(durableSave(next)));
});
