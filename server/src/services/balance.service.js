/**
 * Balance maths. The two core functions (`computeBalances`, `simplifyDebts`)
 * are pure - they take plain data and return plain data - so they are easy to test.
 */
const { db } = require('../db/store');

/**
 * net[userId] > 0  => the group owes this person money
 * net[userId] < 0  => this person owes the group money
 */
function computeBalances(memberIds, expenses, settlements) {
  const net = {};
  memberIds.forEach((uid) => (net[uid] = 0));

  for (const e of expenses) {
    net[e.paidBy] = (net[e.paidBy] || 0) + e.amount;
    for (const s of e.splits) net[s.userId] = (net[s.userId] || 0) - s.amount;
  }
  // Only settlements the recipient has confirmed change balances.
  for (const s of settlements) {
    net[s.fromUser] = (net[s.fromUser] || 0) + s.amount;
    net[s.toUser] = (net[s.toUser] || 0) - s.amount;
  }
  return net;
}

/** Turns net balances into a short list of "A pays B" suggestions (greedy). */
function simplifyDebts(net) {
  const creditors = [];
  const debtors = [];
  for (const [uid, n] of Object.entries(net)) {
    if (n > 0) creditors.push({ uid, amount: n });
    if (n < 0) debtors.push({ uid, amount: -n });
  }
  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const out = [];
  let i = 0;
  let j = 0;
  while (i < debtors.length && j < creditors.length) {
    const amount = Math.min(debtors[i].amount, creditors[j].amount);
    if (amount > 0) out.push({ fromUser: debtors[i].uid, toUser: creditors[j].uid, amount });
    debtors[i].amount -= amount;
    creditors[j].amount -= amount;
    if (debtors[i].amount === 0) i++;
    if (creditors[j].amount === 0) j++;
  }
  return out;
}

function getGroupBalances(groupId) {
  const group = db.groups.find((g) => g.id === groupId);
  if (!group) return {};
  const expenses = db.expenses.filter((e) => e.groupId === groupId && !e.deletedAt);
  const settlements = db.settlements.filter((s) => s.groupId === groupId && s.status === 'confirmed');
  return computeBalances(group.memberIds, expenses, settlements);
}

const getGroupDebts = (groupId) => simplifyDebts(getGroupBalances(groupId));

module.exports = { computeBalances, simplifyDebts, getGroupBalances, getGroupDebts };
