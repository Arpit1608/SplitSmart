const expenseService = require('../services/expense.service');
const personalService = require('../services/personalExpense.service');
const groupService = require('../services/group.service');

// ----- shared (group) expenses -----
exports.createShared = (req, res) => {
  const expense = expenseService.createExpense(req.group, req.user, req.body);
  res.json({ expense, group: groupService.groupView(req.group) });
};

// ----- personal expenses -----
exports.listPersonal = (req, res) => res.json({ expenses: personalService.listForUser(req.user.id) });

exports.createPersonal = (req, res) => res.json({ expense: personalService.create(req.user, req.body) });

exports.removePersonal = (req, res) => {
  personalService.remove(req.user, req.params.id);
  res.json({ ok: true });
};
