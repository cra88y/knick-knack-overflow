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
    const answer = db.Answer.build({
      userId,
      content: answerContents,
      questionId,
    });
    await answer.save();
    res.redirect(`/questions/questionId`);
  })
);

module.exports = router;
