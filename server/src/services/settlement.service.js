const { db, save } = require('../db/store');
const { badRequest, notFound, forbidden } = require('../utils/httpError');
const { newId, now, toPaise } = require('../utils/helpers');
const { getGroupDebts } = require('./balance.service');
const { publicUser } = require('./user.service');

const METHODS = ['cash', 'upi', 'bank'];

/** Someone says "I paid X". It stays 'pending' until the recipient confirms. */
function create(group, user, { toUser, amount, method = 'cash', note = '' } = {}) {
  const cents = toPaise(amount);
  if (!group.memberIds.includes(toUser) || toUser === user.id) throw badRequest('Choose another group member to pay.');
  if (!Number.isFinite(cents) || cents <= 0) throw badRequest('Enter a valid settlement amount.');

  const debt = getGroupDebts(group.id).find((d) => d.fromUser === user.id && d.toUser === toUser);
  if (!debt || cents > debt.amount) {
    throw badRequest('That amount is higher than the amount currently owed to this person.');
  }

  const settlement = {
    id: newId(),
    groupId: group.id,
    fromUser: user.id,
    toUser,
    amount: cents,
    method: METHODS.includes(method) ? method : 'cash',
    note: String(note).slice(0, 200),
    status: 'pending',
    createdAt: now(),
  };
  db.settlements.push(settlement);
  save();
  return settlement;
}

function listForUser(userId) {
  return db.settlements
    .filter((s) => s.fromUser === userId || s.toUser === userId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .map((s) => ({
      ...s,
      group: db.groups.find((g) => g.id === s.groupId)?.name,
      from: publicUser(s.fromUser),
      to: publicUser(s.toUser),
    }));
}

/** Shared by confirm + reject: only the recipient may act, and only while pending. */
function respond(user, id, newStatus) {
  const settlement = db.settlements.find((s) => s.id === id);
  if (!settlement) throw notFound('Settlement not found.');
  const verb = newStatus === 'confirmed' ? 'confirm' : 'reject';
  if (settlement.toUser !== user.id) throw forbidden(`Only the recipient can ${verb} this payment.`);
  if (settlement.status !== 'pending') throw badRequest('This settlement is no longer pending.');

  settlement.status = newStatus;
  if (newStatus === 'confirmed') settlement.confirmedAt = now();
  save();
  return settlement;
}

const confirm = (user, id) => respond(user, id, 'confirmed');
const reject = (user, id) => respond(user, id, 'rejected');

module.exports = { create, listForUser, confirm, reject };
