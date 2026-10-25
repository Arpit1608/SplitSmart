const analyticsService = require('../services/analytics.service');

exports.monthly = (req, res) => res.json(analyticsService.monthlySummary(req.user, req.query.month));
