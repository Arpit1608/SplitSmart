const { db } = require('../db/store');
const { cleanUser, UNKNOWN_USER } = require('../utils/helpers');

const stripAt = (s) => String(s || '').trim().replace(/^@/, '');

const findById = (id) => db.users.find((u) => u.id === id);

const findByUsername = (username) => {
  const wanted = stripAt(username).toLowerCase();
  return db.users.find((u) => u.username.toLowerCase() === wanted);
};

/** Public-safe user object, with a placeholder if the account no longer exists. */
const publicUser = (id) => {
  const u = findById(id);
  return u ? cleanUser(u) : UNKNOWN_USER(id);
};

function search(currentUserId, query) {
  const q = stripAt(query).toLowerCase();
  if (q.length < 1) return [];
  return db.users
    .filter(
      (u) => u.id !== currentUserId && (u.username.toLowerCase().includes(q) || u.name.toLowerCase().includes(q))
    )
    .slice(0, 10)
    .map(cleanUser);
}

module.exports = { stripAt, findById, findByUsername, publicUser, search };
