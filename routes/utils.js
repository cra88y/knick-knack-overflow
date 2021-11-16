const csrf = require("csurf");
const { validationResult } = require('express-validator');

const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

const validationCheck = (req, res, next) => {
  req.errors = validationResult(req);
  next();
};

module.exports = {
  csrfProtection,
  asyncHandler,
  validationCheck
};
