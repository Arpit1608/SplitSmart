const { db, save } = require('../db/store');
const { badRequest } = require('../utils/httpError');
const { newId, now, toPaise } = require('../utils/helpers');
const { equalSplits, customSplits } = require('./split');

function createExpense(group, user, body = {}) {
  const { description, amount, category = 'Other', paidBy = user.id, splitWith, splitType = 'equal', customShares } = body;

  const total = toPaise(amount);
  if (!description || !Number.isFinite(total) || total <= 0) {
    throw badRequest('Enter a description and an amount greater than zero.');
  }
  if (!group.memberIds.includes(paidBy)) throw badRequest('Payer must be a group member.');

  const userIds = Array.isArray(splitWith) ? [...new Set(splitWith)] : group.memberIds;
  if (!userIds.length || userIds.some((uid) => !group.memberIds.includes(uid))) {
    throw badRequest('Choose valid group members to split with.');
  }

  const splits = splitType === 'custom' ? customSplits(total, userIds, customShares) : equalSplits(total, userIds);

  const expense = {
    id: newId(),
    groupId: group.id,
    description: String(description).trim().slice(0, 120),
    amount: total,
    category,
    paidBy,
    splits,
    createdBy: user.id,
    createdAt: now(),
  };
  db.expenses.push(expense);
  save();
  return expense;
}

module.exports = { createExpense };
