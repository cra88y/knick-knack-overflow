const express = require("express");
const { requireAuth } = require("../../auth");
const router = express.Router();
const db = require("../../db/models");
const { asyncHandler } = require("../utils");

router.get(
  "/test",
  asyncHandler(async (req, res) => {
    const answers = await db.Answer.findAll({ limit: 10 });
    // console.log(answers);
    res.render("question", {
      answers,
    });
  })
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const answers = db.Answer.findAll({ limit: 10 });
  })
);
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
    const relatedAnswers = await db.Answer.findAll({ where: { questionId } });
    if (userId != question.userId) {
      return next(
        new Error("You are not the author of this question. Nice try.")
      );
    }
    relatedAnswers.forEach((ans) => {
      ans.destroy();
    });
    question.destroy();
    res.redirect("/");
  })
);
router.post(
  "/questions/:id/answers",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const userId = res.locals.user.id;
    const { answerContents } = req.body;
    const answer = db.Answer.build({
      userId,
      content: answerContents,
      questionId,
    });
    await answer.save();

    res.redirect(`/questions/${questionId}`);
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
    let voteId
    answerId = parseInt(answerId, 10)

    try {
      const voteStatus = await db.Vote.findOne({
        where: {
          userId,
          answerId
        }
      })
      voteId = voteStatus.id;
      if (voteStatus.voteType == true) {
        try {
          const vote = await db.Vote.destroy(
            { where: { id: voteId } }
          );
          destroyed = true;
          voteType = null
        } catch (err) {
          return next(err)
        }
      }
      else voteType = true
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
        )

      } catch (err) {
        return next(err)
      }
    }
    let count;
    try {
      count = await db.Vote.count(
        { where: { answerId, voteType: true } }
      )
      console.log('COUNT', count)

    } catch (err) {
      return next(err)
    }

    res.status(201).json({
      voteType, count
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
    let voteId
    answerId = parseInt(answerId, 10)

    try {
      const voteStatus = await db.Vote.findOne({
        where: {
          userId,
          answerId
        }
      })
      voteId = voteStatus.id;
      if (voteStatus.voteType == false) {
        try {
          const vote = await db.Vote.destroy(
            { where: { id: voteId } }
          )
          destroyed = true;
          voteType = null;
        } catch (err) {
          return next(err)
        }
      } else voteType = false

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
        )
      } catch (err) {
        return next(err)
      }
    };

    let count;
    try {
      count = await db.Vote.count(
        { where: { answerId, voteType: false } }
      )
      console.log('COUNT', count)

    } catch (err) {
      return next(err)
    };

    res.status(201).json({
      voteType, count
    });
  })
);


module.exports = router;
