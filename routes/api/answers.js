const express = require("express");
const { requireAuth } = require("../../auth");
const router = express.Router();
const db = require("../../db/models");
const { asyncHandler } = require("../utils");

router.get(
  "/test",
  asyncHandler(async (req, res) => {
    const answers = await db.Answer.findAll({ limit: 10 });
    console.log(answers);
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
  "/:id/votes",
  requireAuth,
  asyncHandler(async (req, res) => {
    const userId = res.locals.user.id;
    // console.log('here000000000')
    let { answerId } = req.body;
    let voteType = true;
    answerId = parseInt(answerId, 10);
    // userId = parseInt(userId, 10)

    // console.log('000000000000000000 userId', typeof(userId), userId)
    // console.log('000000000000000000 answerId', typeof (answerId), answerId)
    // console.log('VOTE:', db.Vote)
    // try {

    const voteStatus = await db.Vote.findOne({
      where: {
        userId,
        answerId,
      },
    });
    console.log("0000000000 DB voteType", voteStatus.voteType);
    if (voteStatus.voteType === true) voteType = false;
    else voteType = true;
    // } catch (err) {
    //   voteType = true;
    // }
    console.log("000000000000TIME", voteStatus.createdAt);
    // console.log('00000000000 CATCH')

    //MAKE THE VOTE

    // const vote = await db.Vote.update({ userId, answerId, voteType, createdAt: voteStatus.createdAt, updatedAt: voteStatus.updatedAt });
    res.status(201).json({
      voteType,
    });
  })
);

module.exports = router;
