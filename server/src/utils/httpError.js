/**
 * An error that carries an HTTP status code.
 * Throw it anywhere in a service/controller; the error handler turns it into
 * a JSON response like { error: "message" }.
 */
class HttpError extends Error {
  constructor(status, message, extra = {}) {
    super(message);
    this.status = status;
    this.extra = extra;
  }
}

const badRequest = (msg, extra) => new HttpError(400, msg, extra);
const unauthorized = (msg) => new HttpError(401, msg);
const forbidden = (msg) => new HttpError(403, msg);
const notFound = (msg) => new HttpError(404, msg);

module.exports = { HttpError, badRequest, unauthorized, forbidden, notFound };
