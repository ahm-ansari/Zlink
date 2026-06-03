const crypto = require("crypto");

function requestContext(req, _res, next) {
  req.id = crypto.randomUUID();
  next();
}

module.exports = requestContext;
