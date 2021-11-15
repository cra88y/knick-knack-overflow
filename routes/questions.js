// imports
const router = require("express").Router();
const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { questionValidation } = require('./validations');

// route GET /questions/new => render new question form
router.get("/questions/new", csrfProtection, (req, res) => {
  const question = db.Question.build();
  res.render('question-create', { question, csrfToken: req.csrfToken() });
});

router.post("/questions/new", csrfProtection, asyncHandler((req, res) => {
  const { content, title } = req.body;
  const user = res.locals.user;

  await db.Question.create({
    title,
    content,
    user: user.id
  });
}));

module.exports = router;