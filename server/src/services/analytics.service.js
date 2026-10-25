const { db } = require('../db/store');
const { badRequest } = require('../utils/httpError');

/** Monthly spending summary: personal expenses + shared expenses the user paid for. */
function monthlySummary(user, monthParam) {
  const month = String(monthParam || new Date().toISOString().slice(0, 7));
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) throw badRequest('Month must look like 2026-10.');

  const personal = db.personalExpenses.filter((e) => e.userId === user.id && e.date.startsWith(month));
  const myGroupIds = new Set(db.groups.filter((g) => g.memberIds.includes(user.id)).map((g) => g.id));
  const paidShared = db.expenses.filter(
    (e) => myGroupIds.has(e.groupId) && !e.deletedAt && e.createdAt.startsWith(month) && e.paidBy === user.id
  );

  const sum = (list) => list.reduce((total, e) => total + e.amount, 0);
  const tracked = [...personal, ...paidShared];

  const categories = {};
  for (const e of tracked) categories[e.category] = (categories[e.category] || 0) + e.amount;

  const [year, mm] = month.split('-').map(Number);
  const daysInMonth = new Date(year, mm, 0).getDate();
  const daily = Array.from({ length: daysInMonth }, (_, i) => {
    const day = String(i + 1).padStart(2, '0');
    const date = `${month}-${day}`;
    return { day: i + 1, amount: sum(tracked.filter((e) => (e.date || e.createdAt).slice(0, 10) === date)) };
  });

  return {
    month,
    personalTotal: sum(personal),
    paidSharedTotal: sum(paidShared),
    categories: Object.entries(categories)
      .map(([category, amount]) => ({ category, amount }))
      .sort((a, b) => b.amount - a.amount),
    daily,
  };
}

module.exports = { monthlySummary };
