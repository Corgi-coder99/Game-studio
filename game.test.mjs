import test from 'node:test';
import assert from 'node:assert/strict';
import { initialState, validState, summon, multiplier, createBattle, attack } from './game.mjs';

test('initial save is valid; imported saves reject invalid roster and stats', () => {
  const s = initialState();
  assert.ok(validState(s));
  assert.equal(validState({ ...s, coins: -1 }), false);
  assert.equal(validState({ ...s, team: ['wukong'] }), false);
  assert.equal(validState({ ...s, owned: [...s.owned, s.owned[0]] }), false);
  assert.equal(validState({ ...s, overrides: { nezha: { hp: 301, atk: 25 } } }), false);
  assert.equal(validState({ ...s, overrides: { nezha: { hp: 120, atk: 25 } } }), true);
  assert.equal(validState({ ...s, overrides: { nezha: { hp: 120, atk: 25, name: '<img src=x onerror=alert(1)>' } } }), false);
});
test('summon charges up front, returns duplicates and does not mutate original', () => {
  const s = initialState(); const { state, results } = summon(s, 10, () => .9);
  assert.equal(results.length, 10); assert.ok(results.every(h => h.rarity === 'R' && h.duplicate));
  assert.equal(state.coins, 1050); assert.equal(state.pity, 10); assert.equal(state.pulls, 10);
  assert.equal(s.coins, 1800); assert.throws(() => summon({ ...s, coins: 99 }));
  assert.throws(() => summon(s, 3));
});
test('SSR pity triggers at pull 30 and resets, including in ten pulls', () => {
  const s = { ...initialState(), pity: 29 };
  const { state, results } = summon(s, 10, () => .9);
  assert.equal(results[0].rarity, 'SSR'); assert.equal(state.pity, 9);
  assert.ok(state.owned.includes(results[0].id));
  assert.equal(summon(initialState(), 1, () => .01).state.pity, 0);
  assert.equal(summon(initialState(), 1, () => .1).results[0].rarity, 'SR');
});
test('elemental damage and skills respect turn constraints', () => {
  assert.equal(multiplier('Hỏa', 'Kim'), 1.35); assert.equal(multiplier('Kim', 'Hỏa'), 1);
  const b = createBattle(initialState());
  assert.throws(() => attack(b, b.enemies[0].key, true));
  const next = attack(b, b.enemies[0].key);
  assert.equal(next.enemies[0].hp, b.enemies[0].hp - b.allies[0].atk);
  assert.equal(b.active, 0); assert.equal(next.active, 1);
  const third = { ...b, turn: 3 };
  assert.equal(attack(third, third.enemies[0].key, true).enemies[0].hp, third.enemies[0].hp - Math.round(third.allies[0].atk * 1.6));
  assert.throws(() => attack(b, 'invalid'));
});
test('full battle terminates, counters attack after allies act, defeated targets rejected', () => {
  let b = createBattle(initialState()); let actions = 0;
  while (!b.winner && actions++ < 200) {
    const target = b.enemies.find(h => h.hp > 0);
    b = attack(b, target.key, b.turn % 3 === 0);
    assert.ok(b.allies.every(h => h.hp >= 0)); assert.ok(b.enemies.every(h => h.hp >= 0));
  }
  assert.ok(b.winner); assert.ok(actions < 200); assert.ok(b.turn > 1);
  assert.equal(attack(b, 'invalid'), b);
  const dead = createBattle(initialState()); dead.enemies[0].hp = 0;
  assert.throws(() => attack(dead, dead.enemies[0].key));
});
test('team and card edits apply only to a new allied formation', () => {
  const s = initialState(); const before = createBattle(s);
  s.overrides.zhaoyun = { hp: 300, atk: 80 }; const after = createBattle(s);
  assert.equal(before.allies[0].hp, 108); assert.equal(after.allies[0].hp, 300);
  assert.equal(after.enemies[0].hp, 108);
  assert.throws(() => createBattle({ ...s, team: [] }));
});
