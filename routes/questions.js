// imports
const router = require("express").Router();
const { Question } = require("../db/models");
const { questionValidators, searchValidators } = require("./validations");
const {
  csrfProtection,
  asyncHandler,
  validationCheck,
  onlyImagesAllowed,
  voteCountForAnswer,
} = require("./utils");
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
  asyncHandler(async (req, res, next) => {
    let { content, title } = req.body;
    const user = res.locals.user;
    let errors = req.errors.errors;
    if (!errors.length) {
      // validations pass
      content = onlyImagesAllowed(content);
      if (!content.length) {
        return next(
          new Error(
            "No question question content. (disallowed content may have been removed)"
          )
        );
      }
      await Question.create({
        title,
        content,
        userId: user.id,
      });

      res.redirect("/");
    } else {
      console.log(req.body)
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
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const questionId = req.params.id;
    const question = await db.Question.findOne({
      where: {
        id: questionId,
      },
      raw: true,
      include: { model: db.User, attributes: ["username", "id"] },
    });
    if (!question) next(new Error("Question not found"));

    const answers = await db.Answer.findAll({
      where: { questionId: questionId },
      raw: true,
      include: { model: db.User, attributes: ["username", "id"] },
    });
    console.log(answers);
    for (ans of answers) {
      ans.voteCount = await voteCountForAnswer(ans.id);
    }
    answers.sort((f, s) => {
      return s.voteCount - f.voteCount;
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

    // get suggested other questions
    // go through current question title and grab all words seperately
    const titleTerms = question.title.split(" ");
    const suggested = await db.Question.findAll({
      where: {
        [Op.or]: [
          ...titleTerms.map((term) => {
            // using terms longer than 2 chars to try and target more topic specific words
            if (term.length > 3) {
              return { title: { [Op.iLike]: `%${term}%` } };
            }
          }),
        ],
      },
      limit: 10,
      order: [["createdAt", "DESC"]],
    });

    res.render("question", {
      suggested,
      question,
      answers,
      csrfToken: req.csrfToken(),
    });
  })
);

router.get(
  "/:id/votes",
  asyncHandler(async (req, res, next) => {
    const questionId = req.params.id;

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
    let userId = req.session.userId;
    let userVotes = {};
    votes.forEach((vote) => {
      if (vote.userId == userId) {
        userVotes[vote.answerId] = vote.voteType;
      }
    });
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

    res.status(201).json({
      answerVotes,
      userVotes,
    });
  })
);

module.exports = router;
