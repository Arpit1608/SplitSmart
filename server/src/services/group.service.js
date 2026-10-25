const { db, save } = require('../db/store');
const { badRequest, notFound } = require('../utils/httpError');
const { newId, now, cleanUser } = require('../utils/helpers');
const { stripAt, findByUsername, findById } = require('./user.service');
const { getGroupBalances, getGroupDebts } = require('./balance.service');

/** Returns the group only if `userId` is a member; otherwise throws 404 (so we don't leak that it exists). */
function getGroupForUser(groupId, userId) {
  const group = db.groups.find((g) => g.id === groupId);
  if (!group || !group.memberIds.includes(userId)) throw notFound('Group not found.');
  return group;
}

/** The shape the frontend receives: the group plus members, expenses, balances and suggested payments. */
function groupView(group) {
  return {
    ...group,
    members: group.memberIds.map(findById).filter(Boolean).map(cleanUser),
    expenses: db.expenses
      .filter((e) => e.groupId === group.id && !e.deletedAt)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    balances: getGroupBalances(group.id),
    debts: getGroupDebts(group.id),
  };
}

const listForUser = (userId) =>
  db.groups.filter((g) => g.memberIds.includes(userId)).map(groupView);

function createGroup(user, { name, usernames = [] } = {}) {
  if (!name || !String(name).trim()) throw badRequest('Give your group a name.');
  if (!Array.isArray(usernames)) throw badRequest('Members must be a list of usernames.');

  const memberIds = [];
  const missing = [];
  for (const raw of usernames) {
    const username = stripAt(raw);
    if (!username) continue;
    const found = findByUsername(username);
    if (!found) missing.push(username);
    else if (found.id !== user.id && !memberIds.includes(found.id)) memberIds.push(found.id);
  }
  if (missing.length) {
    throw badRequest(`Username${missing.length > 1 ? 's' : ''} not found: ${missing.map((x) => '@' + x).join(', ')}`, {
      missing,
    });
  }

  const group = {
    id: newId(),
    name: String(name).trim().slice(0, 80),
    createdBy: user.id,
    memberIds: [user.id, ...memberIds],
    createdAt: now(),
  };
  db.groups.push(group);
  save();
  return groupView(group);
}

function addMember(group, rawUsername) {
  const username = stripAt(rawUsername);
  const user = findByUsername(username);
  if (!user) throw notFound(`@${username || 'that username'} doesn't exist. Check the spelling and try again.`);
  if (group.memberIds.includes(user.id)) throw badRequest('That person is already in this group.');
  group.memberIds.push(user.id);
  save();
  return groupView(group);
}

module.exports = { getGroupForUser, groupView, listForUser, createGroup, addMember };
