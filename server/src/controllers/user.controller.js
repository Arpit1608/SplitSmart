const userService = require('../services/user.service');

exports.search = (req, res) => res.json({ users: userService.search(req.user.id, req.query.q) });
