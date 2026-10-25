const { unauthorized } = require('../utils/httpError');
const { userForToken } = require('../services/auth.service');

function getToken(req) {
  return (req.headers.authorization || '').replace(/^Bearer\s+/i, '') || req.headers['x-session-token'] || '';
}

// Put this in front of any route that needs a logged-in user. Sets req.user.
function requireAuth(req, res, next) {
  const user = userForToken(getToken(req));
  if (!user) return next(unauthorized('Please log in to continue.'));
  req.user = user;
  req.token = getToken(req);
  next();
}

module.exports = { requireAuth, getToken };
