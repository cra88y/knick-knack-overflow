// imports
const express = require("express");
const router = express.Router();
const { Question } = require("../db/models");
const { questionValidators, searchValidators } = require("./validations");
const {
  csrfProtection,
  asyncHandler,
  validationCheck,
  onlyImagesAllowed,
  voteCountForAnswer,
  voteCountForQuestion,
} = require("./utils");
const db = require("../db/models");
const Op = require("sequelize").Op;
const { application } = require("express");

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
  "/search",
  asyncHandler(async (req, res) => {
    const searchTerm = req.query.searchTerm;
    let questions;

    if (searchTerm) {
      questions = await db.Question.findAll({
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
        include: [{ model: db.User, attributes: ["username", "id"] }],
      });
    }

    if (!questions) {
      return res.redirect("/");
    }

    const numEntries = Math.ceil(questions.length / 10);
    const pageLinks = [];

    for (let i = 1; i <= numEntries; i++) {
      pageLinks.push(i);
    }

    res.render("index", { pageLinks, questions });
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
      include: { model: db.User, attributes: ["username", "id"] },
    });
    if (!question) next(new Error("Question not found"));

    const answers = await db.Answer.findAll({
      where: { questionId: questionId },
      include: { model: db.User, attributes: ["username", "id"] },
    });
    for (ans of answers) {
      ans.voteCount = await voteCountForAnswer(ans.id);
    }
    answers.sort((f, s) => {
      return s.voteCount - f.voteCount;
    });

    // const votes = await db.Vote.findAll({
    //   include: [
    //     {
    //       model: db.Answer,
    //       where: {
    //         questionId,
    //       },
    //     },
    //   ],
    // });

    // let answerVotes = {};
    // votes.forEach((vote) => {
    //   if (answerVotes[vote.answerId]) {
    //     if (vote.voteType == true) {
    //       answerVotes[vote.answerId] += 1;
    //     } else {
    //       answerVotes[vote.answerId] -= 1;
    //     }
    //   } else {
    //     if (vote.voteType == true) {
    //       answerVotes[vote.answerId] = 1;
    //     } else {
    //       answerVotes[vote.answerId] = -1;
    //     }
    //   }
    // });

    /////////////////// Suggested questions /////////////////////////
    // go through current question title and grab all words seperately
    const titleTerms = question.title.split(" ");
    const suggested = await db.Question.findAll({
      where: {
        [Op.and]: [
          {
            id: {
              [Op.not]: questionId,
            },
          },
          {
            [Op.or]: [
              ...titleTerms.map((term) => {
                // using terms longer than 2 chars to try and target more topic specific words
                if (term.length > 3) {
                  return { title: { [Op.iLike]: `%${term}%` } };
                }
              }),
            ],
          },
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

    let count = 0;
    let voteHiLows = {};
    votes.forEach((vote) => {
      if (voteHiLows[vote.answerId]) {
        voteHiLows[vote.answerId] += vote.voteType ? 1 : -1;
      } else {
        voteHiLows[vote.answerId] = vote.voteType ? 1 : -1;
      }
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
      voteHiLows,
    });
  })
);

router.post(
  "/:id/upVotes",
  asyncHandler(async (req, res) => {
    if (!res.locals.authenticated) {
      res.status(201).json({
        loggedOut: true,
      });
    }
    const userId = res.locals.user.id;
    let { questionId } = req.body;
    let voteType = true;
    let voted = false;
    let destroyed = false;
    let voteId;
    questionId = parseInt(questionId, 10);
    console.log(questionId);
    try {
      const voteStatus = await db.Question_Vote.findOne({
        where: {
          userId,
          questionId,
        },
      });
      voteId = voteStatus.id;
      if (voteStatus.voteType == true) {
        try {
          const vote = await db.Question_Vote.destroy({
            where: { id: voteId },
          });
          destroyed = true;
          voteType = null;
        } catch (err) {
          return next(err);
        }
      } else voteType = true;
    } catch (err) {
      voteType = true;
      const vote = await db.Question_Vote.create({
        userId,
        questionId,
        voteType,
      });
      voted = true;
    }

    if (voted == false && destroyed == false) {
      try {
        const vote = await db.Question_Vote.update(
          { userId, questionId, voteType },
          { where: { id: voteId } }
        );
      } catch (err) {
        return next(err);
      }
    }
    let count = await voteCountForQuestion(questionId);
    res.status(201).json({
      voteType,
      count,
    });
  })
);

router.post(
  "/:id/downVotes",
  asyncHandler(async (req, res) => {
    if (!res.locals.authenticated) {
      res.status(201).json({
        loggedOut: true,
      });
    }
    const userId = res.locals.user.id;
    let { questionId } = req.body;
    let voteType = false;
    let voted = false;
    let destroyed = false;
    let voteId;
    questionId = parseInt(questionId, 10);
    console.log(questionId);
    try {
      const voteStatus = await db.Question_Vote.findOne({
        where: {
          userId,
          questionId,
        },
      });
      voteId = voteStatus.id;
      if (voteStatus.voteType == false) {
        try {
          const vote = await db.Question_Vote.destroy({
            where: { id: voteId },
          });
          destroyed = true;
          voteType = null;
        } catch (err) {
          return next(err);
        }
      } else voteType = false;
    } catch (err) {
      voteType = false;
      const vote = await db.Question_Vote.create({
        userId,
        questionId,
        voteType,
      });
      voted = true;
    }

    if (voted == false && destroyed == false) {
      try {
        const vote = await db.Question_Vote.update(
          { userId, questionId, voteType },
          { where: { id: voteId } }
        );
      } catch (err) {
        return next(err);
      }
    }
    let count = await voteCountForQuestion(questionId);
    res.status(201).json({
      voteType,
      count,
    });
  })
);

module.exports = router;
