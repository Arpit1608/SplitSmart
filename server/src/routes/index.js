const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { loadGroup } = require('../middleware/loadGroup');
const auth = require('../controllers/auth.controller');
const users = require('../controllers/user.controller');
const groups = require('../controllers/group.controller');
const expenses = require('../controllers/expense.controller');
const settlements = require('../controllers/settlement.controller');
const messages = require('../controllers/message.controller');
const analytics = require('../controllers/analytics.controller');

const router = express.Router();

router.get('/health', (req, res) => res.json({ ok: true, app: 'SplitSmart', storage: 'persistent-json' }));

// ---- auth ----
router.post('/auth/signup', auth.signup);
router.post('/auth/login', auth.login);
router.post('/auth/logout', requireAuth, auth.logout);
router.get('/me', requireAuth, auth.me);

// Everything below needs a logged-in user.
router.use(requireAuth);

router.get('/users/search', users.search);

// ---- groups (and everything that lives inside a group) ----
router.get('/groups', groups.list);
router.post('/groups', groups.create);
router.get('/groups/:id', loadGroup, groups.get);
router.post('/groups/:id/members', loadGroup, groups.addMember);
router.post('/groups/:id/expenses', loadGroup, expenses.createShared);
router.post('/groups/:id/settlements', loadGroup, settlements.create);
router.get('/groups/:id/messages', loadGroup, messages.list);
router.post('/groups/:id/messages', loadGroup, messages.create);

// ---- personal expenses ----
router.get('/personal-expenses', expenses.listPersonal);
router.post('/personal-expenses', expenses.createPersonal);
router.delete('/personal-expenses/:id', expenses.removePersonal);

// ---- settlements ----
router.get('/settlements', settlements.list);
router.post('/settlements/:id/confirm', settlements.confirm);
router.post('/settlements/:id/reject', settlements.reject);

// ---- analytics ----
router.get('/analytics', analytics.monthly);

module.exports = router;
