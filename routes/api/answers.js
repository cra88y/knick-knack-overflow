const express = require("express");
const { requireAuth } = require("../../auth");
const router = express.Router();
const db = require("../../db/models");
const {
  asyncHandler,
  onlyImagesAllowed,
  validationCheck,
  csrfProtection,
} = require("../utils");
const { answerValidators } = require("../validations");

router.post(
  "/answers/:id/delete",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const answerId = req.params.id;
    const userId = res.locals.user.id;
    const answer = await db.Answer.findByPk(answerId);
    if (userId != answer.userId) {
      return next(
        new Error("You are not the author of this answer. Nice try.")
      );
    }
    db.Vote.destroy({ where: { answerId: answer.id } });
    answer.destroy();
    res.redirect("back");
  })
);
router.post(
  "/questions/:id/delete",
  requireAuth,
  asyncHandler(async (req, res, next) => {
    const questionId = req.params.id;
    const userId = res.locals.user.id;
    const question = await db.Question.findByPk(questionId);
    if (userId != question.userId) {
      return next(
        new Error("You are not the author of this question. Nice try.")
      );
    }
    const relatedAnswers = await db.Answer.findAll({ where: { questionId } });
    relatedAnswers.forEach((ans) => {
      db.Vote.destroy({ where: { answerId: ans.id } });
      ans.destroy();
    });
    question.destroy();
    res.redirect("/");
  })
);

router.post(
  "/questions/:id/answers",
  requireAuth,
  answerValidators,
  validationCheck,
  csrfProtection,
  asyncHandler(async (req, res, next) => {
    const questionId = req.params.id;
    const userId = res.locals.user.id;
    let { answerContents } = req.body;
    let errors = req.errors.errors;
    if (!errors.length) {
      answerContents = onlyImagesAllowed(answerContents);
      if (!answerContents.length) {
        return next(new Error("Disallowed content"));
      }
      const answer = db.Answer.build({
        userId,
        content: answerContents,
        questionId,
      });
      await answer.save();
      res.redirect(`/questions/${questionId}`);
    } else {
      // validations don't pass
      const question = await db.Question.findByPk(questionId);
      if (!question) next(new Error("Question not found"));
      res.render(`question`, {
        question,
        csrfToken: req.csrfToken(),
        errors: errors.map((err) => err.msg),
        answerContents,
      });
    }
  })
);

router.post(
  "/answers/:id/upVotes",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    let { answerId } = req.body;
    let voteType = true;
    let voted = false;
    let destroyed = false;
    let voteId;
    answerId = parseInt(answerId, 10);

    try {
      const voteStatus = await db.Vote.findOne({
        where: {
          userId,
          answerId,
        },
      });
      voteId = voteStatus.id;
      if (voteStatus.voteType == true) {
        try {
          const vote = await db.Vote.destroy({ where: { id: voteId } });
          destroyed = true;
          voteType = null;
        } catch (err) {
          return next(err);
        }
      } else voteType = true;
    } catch (err) {
      voteType = true;
      const vote = await db.Vote.create({ userId, answerId, voteType });
      voted = true;
    }

    if (voted == false && destroyed == false) {
      try {
        const vote = await db.Vote.update(
          { userId, answerId, voteType },
          { where: { id: voteId } }
        );
      } catch (err) {
        return next(err);
      }
    }
    let count = 0;
    const votes = await db.Vote.findAll({ where: { answerId } });
    votes.forEach((v) => {
      count += v.voteType ? 1 : -1;
    });
    console.log("00000000000000000000000000");
    console.log(count);
    res.status(201).json({
      voteType,
      count,
    });
  })
);

router.post(
  "/answers/:id/downVotes",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    let { answerId } = req.body;
    let voteType = false;
    let voted = false;
    let destroyed = false;
    let voteId;
    answerId = parseInt(answerId, 10);

    try {
      const voteStatus = await db.Vote.findOne({
        where: {
          userId,
          answerId,
        },
      });
      voteId = voteStatus.id;
      if (voteStatus.voteType == false) {
        try {
          const vote = await db.Vote.destroy({ where: { id: voteId } });
          destroyed = true;
          voteType = null;
        } catch (err) {
          return next(err);
        }
      } else voteType = false;
    } catch (err) {
      voteType = false;
      const vote = await db.Vote.create({ userId, answerId, voteType });
      voted = true;
    }

    if (voted == false && destroyed == false) {
      try {
        const vote = await db.Vote.update(
          { userId, answerId, voteType },
          { where: { id: voteId } }
        );
      } catch (err) {
        return next(err);
      }
    }

    let count = 0;
    const votes = await db.Vote.findAll({ where: { answerId } });
    console.log(votes);
    votes.forEach((v) => {
      count += v.voteType ? 1 : -1;
    });
    res.status(201).json({
      voteType,
      count,
    });
  })
);

module.exports = router;
