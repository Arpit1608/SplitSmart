const messageService = require('../services/message.service');

exports.list = (req, res) => res.json({ messages: messageService.listForGroup(req.group.id) });

exports.create = (req, res) => res.json({ message: messageService.create(req.group, req.user, req.body?.message) });
