const { getGroupForUser } = require('../services/group.service');

// For routes with /groups/:id - loads the group into req.group,
// or responds 404 if it doesn't exist / the user isn't a member.
function loadGroup(req, res, next) {
  try {
    req.group = getGroupForUser(req.params.id, req.user.id);
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = { loadGroup };
