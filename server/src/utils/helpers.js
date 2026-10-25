const crypto = require('crypto');

// Money is always stored as integer paise (1 rupee = 100 paise) to avoid float errors.
const toPaise = (amount) => Math.round(Number(amount) * 100);

const newId = () => crypto.randomUUID();
const now = () => new Date().toISOString();

// Never send password hashes/salts to the browser.
const cleanUser = (u) => ({
  id: u.id,
  username: u.username,
  name: u.name,
  email: u.email,
  createdAt: u.createdAt,
});

const UNKNOWN_USER = (id) => ({ id, username: 'unknown', name: 'Unknown', email: '' });

module.exports = { toPaise, newId, now, cleanUser, UNKNOWN_USER };
