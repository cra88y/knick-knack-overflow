const csrf = require("csurf");
const { validationResult } = require("express-validator");
const db = require("../db/models");
const csrfProtection = csrf({ cookie: true });

const asyncHandler = (handler) => (req, res, next) =>
  handler(req, res, next).catch(next);

const validationCheck = (req, res, next) => {
  req.errors = validationResult(req);
  next();
};

const onlyImagesAllowed = (str) => {
  return str.replace(/<(?!img src=("[\w._:/-]+") ?\/>)[^>]+>|svg/gi, "");
};
const voteCountForAnswer = async (answerId) => {
  let count = 0;
  const votes = await db.Vote.findAll({ where: { answerId }, raw: true });
  votes.forEach((v) => {
    count += v.voteType ? 1 : -1;
  });
  return count;
};
module.exports = {
  csrfProtection,
  asyncHandler,
  validationCheck,
  onlyImagesAllowed,
  voteCountForAnswer,
};
