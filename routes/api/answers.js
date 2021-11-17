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
  "/:id",
  requireAuth,
  asyncHandler(async (req, res) => {
    const questionId = req.params.id;
    const userId = res.locals.user.id;
    const { answerContents } = req.body;
    console.log(answerContents);
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
    let { answerId } = req.body;
    let voteType = true;
    let voted= false;
    let voteId
    answerId = parseInt(answerId, 10)
    // userId = parseInt(userId, 10)

    
    try {

      const voteStatus = await db.Vote.findOne({
        where: {
          userId,
          answerId
        }
      })
      if (voteStatus.voteType === true) voteType = false
      else voteType = true
      voteId = voteStatus.id
    } catch (err) {
      voteType = true;
      const vote = await db.Vote.create({ userId, answerId, voteType });
      voted = true;
    }
   

    //MAKE THE VOTE
    if (voted == false) {

     
      try {
        const vote = await db.Vote.update(
          { userId, answerId, voteType },
          { where: { id: voteId } }
        )
        console.log('successful update')
        // handleResult(result)
      } catch (err) {
        // handleError(err)
        console.log(err)
      }
    }
    res.status(201).json({
      voteType,
    });
  })
);

module.exports = router;
