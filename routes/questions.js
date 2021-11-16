// imports
const router = require("express").Router();
const db = require("../db/models");
const { csrfProtection, asyncHandler } = require("./utils");
const { questionValidation } = require("./validations");

// route GET /questions/new => render new question form
router.get("/new", csrfProtection, (req, res) => {
  const question = db.Question.build();
  res.render("question-create", { question, csrfToken: req.csrfToken() });
});

router.post(
  "/new",
  csrfProtection,
  asyncHandler(async (req, res) => {
    const { content, title } = req.body;
    const user = res.locals.user;

    await db.Question.create({
      title,
      content,
      user: user.id,
    });
  })
);

router.get(
  "/:id",
  asyncHandler(async (req, res, next) => {
    const questionId = req.params.id;
    const question = await db.Question.findByPk(questionId);
    if (!question) next(new Error("Question not found"));
    const answers = await db.Answer.findAll({
      where: { questionId: questionId },
    });
    res.render("question", { question, answers });
  })
);

module.exports = router;
