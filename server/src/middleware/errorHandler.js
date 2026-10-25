const { HttpError, notFound } = require('../utils/httpError');

// Any /api URL that no route matched.
const apiNotFound = (req, res, next) => next(notFound('API route not found.'));

// Single place where errors become JSON responses.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...err.extra });
  }
  // Malformed JSON body etc. from express.json()
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON body.' });
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
}

module.exports = { apiNotFound, errorHandler };
