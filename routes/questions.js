// imports
const router = require("express").Router();
const { Question } = require("../db/models");
const { questionValidators, searchValidators } = require("./validations");
const { csrfProtection, asyncHandler, validationCheck } = require("./utils");
const db = require("../db/models");
const Op = require("sequelize").Op;

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
    let { content, title } = req.body;
    const user = res.locals.user;
    const errors = req.errors.errors;
    if (!errors.length) {
      // validations pass
      content = content.replace(/<(?!img src=("[\w.]+")\/>)[^>]+>|svg/g, "");
      await Question.create({
        title,
        content,
        userId: user.id,
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

// will add error handling
router.post(
  "/search",
  searchValidators,
  validationCheck,
  asyncHandler(async (req, res) => {
    const { searchTerm } = req.body;
    const errors = req.errors.errors;
    console.log("errors", errors[0]);

    // search validation failed (no search term was entered) => put error in search box
    if (errors.length) {
      res.render("index", { questions: [], searchErrors: errors[0].msg });
    } else {
      res.redirect(`/questions/search/${searchTerm}`);
    }
  })
);

router.get(
  "/search/:searchTerm",
  asyncHandler(async (req, res) => {
    const searchTerm = req.params.searchTerm;

    const questions = await db.Question.findAll({
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
          {
            content: {
              [Op.iLike]: `%${searchTerm}%`,
            },
          },
        ],
      },
    });

    res.render("index", { questions });
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

    //////////////////////////////////
    //populate votes:
    const votes = await db.Vote.findAll({
      include: [
        {
          model: db.Answer,
          where: {
            questionId,
          },
        },
      ],
    });

    //populate votes:

    // console.log('VOTES', votes)
    let answerVotes = {};
    votes.forEach((vote) => {
      if (answerVotes[vote.answerId]) {
        if (vote.voteType == true) {
          answerVotes[vote.answerId] += 1;
        } else {
          answerVotes[vote.answerId] -= 1;
        }
      } else {
        if (vote.voteType == true) {
          answerVotes[vote.answerId] = 1;
        } else {
          answerVotes[vote.answerId] = -1;
        }
      }
    });

    res.render("question", { question, answers, answerVotes });
  })
);

module.exports = router;
