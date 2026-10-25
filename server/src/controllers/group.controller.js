const groupService = require('../services/group.service');
const messageService = require('../services/message.service');

exports.list = (req, res) => res.json({ groups: groupService.listForUser(req.user.id) });

exports.create = (req, res) => res.json({ group: groupService.createGroup(req.user, req.body) });

exports.get = (req, res) =>
  res.json({ group: groupService.groupView(req.group), messages: messageService.listForGroup(req.group.id) });

exports.addMember = (req, res) =>
  res.json({ group: groupService.addMember(req.group, req.body?.username) });
