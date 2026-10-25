const test = require('node:test');
const assert = require('node:assert/strict');
const { computeBalances, simplifyDebts } = require('../src/services/balance.service');
const { equalSplits, customSplits } = require('../src/services/split');

test('equal split gives leftover paise to the first people and always sums to the total', () => {
  const splits = equalSplits(1000, ['a', 'b', 'c']); // Rs 10.00 / 3
  assert.deepEqual(splits.map((s) => s.amount), [334, 333, 333]);
  assert.equal(splits.reduce((s, x) => s + x.amount, 0), 1000);
});

test('custom split must add up to the total', () => {
  assert.throws(() => customSplits(1000, ['a', 'b'], { a: 3, b: 3 }), /add up exactly/);
  const ok = customSplits(1000, ['a', 'b'], { a: 4, b: 6 });
  assert.deepEqual(ok.map((s) => s.amount), [400, 600]);
});

test('balances: payer is owed, sharers owe', () => {
  const expenses = [{ paidBy: 'a', amount: 900, splits: [{ userId: 'a', amount: 300 }, { userId: 'b', amount: 300 }, { userId: 'c', amount: 300 }] }];
  assert.deepEqual(computeBalances(['a', 'b', 'c'], expenses, []), { a: 600, b: -300, c: -300 });
});

test('confirmed settlements reduce what is owed', () => {
  const expenses = [{ paidBy: 'a', amount: 600, splits: [{ userId: 'a', amount: 300 }, { userId: 'b', amount: 300 }] }];
  const settlements = [{ fromUser: 'b', toUser: 'a', amount: 300 }];
  assert.deepEqual(computeBalances(['a', 'b'], expenses, settlements), { a: 0, b: 0 });
});

test('simplifyDebts produces payments that clear every balance', () => {
  const net = { a: 500, b: -200, c: -300, d: 0 };
  const debts = simplifyDebts(net);
  const after = { ...net };
  for (const d of debts) {
    after[d.fromUser] += d.amount;
    after[d.toUser] -= d.amount;
  }
  assert.ok(Object.values(after).every((v) => v === 0));
  assert.equal(debts.length, 2);
});
