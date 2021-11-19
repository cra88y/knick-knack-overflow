const express = require("express");
const { render } = require("pug");
const { requireAuth } = require("../../auth");
const router = express.Router();
const db = require("../../db/models");
const {
  asyncHandler,
  onlyImagesAllowed,
  validationCheck,
  csrfProtection,
  voteCountForAnswer,
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
        errors.push({ msg: "Disallowed content removed from answer" });
        return res.render("production-errors", { errors });
        return next(new Error("Disallowed content"));
      }
      const answer = db.Answer.build({
        userId,
        content: answerContents,
        questionId,
      });
      await answer.save();
      return res.redirect(`/questions/${questionId}`);
    }
    res.render("production-errors", { errors });
  })
);

router.post(
  "/answers/:id/upVotes",
  asyncHandler(async (req, res) => {
    if (!res.locals.authenticated) {
      res.status(201).json({
        loggedOut: true,
      });
    }
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
    let count = await voteCountForAnswer(answerId);
    res.status(201).json({
      voteType,
      count,
    });
  })
);

router.post(
  "/answers/:id/downVotes",
  asyncHandler(async (req, res) => {
    if (!res.locals.authenticated) {
      res.status(201).json({
        loggedOut: true,
      });
    }
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
    let count = await voteCountForAnswer(answerId);
    res.status(201).json({
      voteType,
      count,
    });
  })
);

module.exports = router;
