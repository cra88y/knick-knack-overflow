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

// router.post(
//   "/:id/votes",
//   requireAuth,
//   asyncHandler(async (req, res) => {
//     const userId = res.locals.user.id;

//     const { answerId } = req.body;
//     let voteType = true;

// try {
//       const voteStatus = await Vote.findOne({
//         where: {
//           userId,
//           answerId
//         }
//       })
//     } catch (err) {
//       voteType = true;
//     }

//     //MAKE THE VOTE
//     const vote = await db.Vote.create({ userId, answerId, voteType });
//     res.status(201).json({
//       voteType,
//     });
//   })
// );

module.exports = router;
