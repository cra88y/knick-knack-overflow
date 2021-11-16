// imports
const router = require("express").Router();
const db = require("../db/models");
const { questionValidators } = require('./validations');
const {
  csrfProtection,
  asyncHandler,
  validationCheck
} = require("./utils");

// route GET /questions/new => render new question form
router.get("/new", csrfProtection, (req, res) => {
  const question = db.Question.build();
  res.render('question-create', { title: "Ask Question", question, csrfToken: req.csrfToken() });
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
      await db.Question.create({
        title,
        content,
        user: user.id
      });

      res.redirect("/");
    } else {
      // validations don't pass
      res.render("question-create", { 
        title: "Ask Question",
        question: req.body, 
        csrfToken: req.csrfToken(),
        errors: errors.map(err => err.msg)
      }); 
    }
  }));

module.exports = router;
