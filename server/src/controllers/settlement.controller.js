const settlementService = require('../services/settlement.service');

exports.create = (req, res) => res.json({ settlement: settlementService.create(req.group, req.user, req.body) });

exports.list = (req, res) => res.json({ settlements: settlementService.listForUser(req.user.id) });

exports.confirm = (req, res) => res.json({ settlement: settlementService.confirm(req.user, req.params.id) });

exports.reject = (req, res) => res.json({ settlement: settlementService.reject(req.user, req.params.id) });
