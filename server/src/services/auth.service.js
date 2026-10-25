const crypto = require('crypto');
const { db, save } = require('../db/store');
const { badRequest, unauthorized } = require('../utils/httpError');
const { newId, now, cleanUser } = require('../utils/helpers');

// Sessions live in memory, so restarting the server logs everyone out.
// (Replace this Map with a DB table or Redis when you deploy for real.)
const sessions = new Map();

const hashPassword = (password, salt) => crypto.scryptSync(password, salt, 64).toString('hex');

function passwordMatches(password, user) {
  const a = Buffer.from(hashPassword(password, user.salt), 'hex');
  const b = Buffer.from(user.hash, 'hex');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function startSession(userId) {
  const token = crypto.randomBytes(32).toString('hex');
  sessions.set(token, userId);
  return token;
}

const endSession = (token) => sessions.delete(token);

function userForToken(token) {
  const userId = sessions.get(token);
  return db.users.find((u) => u.id === userId) || null;
}

function signup({ name, username, email, password } = {}) {
  if (!name || !username || !email || !password) throw badRequest('Please fill in every field.');
  if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
    throw badRequest('Username must be 3–20 characters: letters, numbers or underscore.');
  }
  if (String(password).length < 8) throw badRequest('Password must be at least 8 characters.');
  if (db.users.some((u) => u.username.toLowerCase() === String(username).toLowerCase())) {
    throw badRequest('That username is already taken.');
  }
  if (db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase())) {
    throw badRequest('An account with this email already exists.');
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const user = {
    id: newId(),
    name: String(name).trim().slice(0, 60),
    username: String(username).trim(),
    email: String(email).trim().toLowerCase(),
    salt,
    hash: hashPassword(password, salt),
    createdAt: now(),
  };
  db.users.push(user);
  save();
  return { token: startSession(user.id), user: cleanUser(user) };
}

function login({ identity, password } = {}) {
  const id = String(identity || '').toLowerCase();
  const user = db.users.find((u) => u.username.toLowerCase() === id || u.email === id);
  if (!user || !password || !passwordMatches(password, user)) {
    throw unauthorized('Incorrect username/email or password.');
  }
  return { token: startSession(user.id), user: cleanUser(user) };
}

module.exports = { signup, login, startSession, endSession, userForToken };
