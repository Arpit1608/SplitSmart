const authService = require('../services/auth.service');
const { cleanUser } = require('../utils/helpers');

exports.signup = (req, res) => res.json(authService.signup(req.body));

exports.login = (req, res) => res.json(authService.login(req.body));

exports.logout = (req, res) => {
  authService.endSession(req.token);
  res.json({ ok: true });
};

exports.me = (req, res) => res.json({ user: cleanUser(req.user) });
