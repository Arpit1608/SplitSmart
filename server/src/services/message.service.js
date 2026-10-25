const { db, save } = require('../db/store');
const { badRequest } = require('../utils/httpError');
const { newId, now } = require('../utils/helpers');
const { publicUser } = require('./user.service');

const withUser = (m) => ({ ...m, user: publicUser(m.userId) });

const listForGroup = (groupId, limit = 100) =>
  db.messages.filter((m) => m.groupId === groupId).slice(-limit).map(withUser);

function create(group, user, text) {
  const body = String(text || '').trim();
  if (!body) throw badRequest('Message cannot be empty.');
  const message = { id: newId(), groupId: group.id, userId: user.id, message: body.slice(0, 1000), createdAt: now() };
  db.messages.push(message);
  save();
  return withUser(message);
}

module.exports = { listForGroup, create };
