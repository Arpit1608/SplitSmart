const { db, save } = require('../db/store');
const { badRequest, notFound } = require('../utils/httpError');
const { newId, now, toPaise } = require('../utils/helpers');

const listForUser = (userId) =>
  db.personalExpenses.filter((e) => e.userId === userId).sort((a, b) => b.date.localeCompare(a.date));

function create(user, { description, amount, category = 'Other', date } = {}) {
  const cents = toPaise(amount);
  if (!description || !Number.isFinite(cents) || cents <= 0) {
    throw badRequest('Enter a description and a valid amount.');
  }
  const expense = {
    id: newId(),
    userId: user.id,
    description: String(description).trim().slice(0, 120),
    amount: cents,
    category,
    date: date || now().slice(0, 10),
    createdAt: now(),
  };
  db.personalExpenses.push(expense);
  save();
  return expense;
}

function remove(user, id) {
  const expense = db.personalExpenses.find((e) => e.id === id && e.userId === user.id);
  if (!expense) throw notFound('Expense not found.');
  db.personalExpenses = db.personalExpenses.filter((e) => e.id !== id);
  save();
}

module.exports = { listForUser, create, remove };
