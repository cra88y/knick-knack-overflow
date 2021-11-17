// imports
const router = require("express").Router();
const { Question } = require("../db/models");
const { questionValidators } = require("./validations");
const { csrfProtection, asyncHandler, validationCheck } = require("./utils");
const db = require("../db/models");
// route GET /questions/new => render new question form
router.get("/new", csrfProtection, (req, res) => {
  const question = Question.build();
  res.render("question-create", {
    title: "Ask Question",
    question,
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/new",
  csrfProtection,
  questionValidators,
  validationCheck,
  asyncHandler(async (req, res) => {
    const { content, title } = req.body;
    const user = res.locals.user;
    const errors = req.errors.errors;

    if (!errors.length) {
      // validations pass
      await Question.create({
        title,
        content,
        userId: user.id
      });

      res.redirect("/");
    } else {
      // validations don't pass
      res.render("question-create", {
        title: "Ask Question",
        question: req.body,
        csrfToken: req.csrfToken(),
        errors: errors.map((err) => err.msg),
      });
    }
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
