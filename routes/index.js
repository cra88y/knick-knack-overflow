const router = require("express").Router();
const app = require("../app");
const db = require("../db/models");
const { voteCountForQuestion } = require("./utils");

const { asyncHandler } = require("./utils");
let currentQs;

/* GET home page. */
router.get(
  "/:pageNum?",
  asyncHandler(async (req, res, next) => {
    const questionCount = await db.Question.count();
    const pageNum = req.params.pageNum;
    const numPages = Math.ceil(questionCount / 10);

    // since we are using this in index route we need to handle out of page range (send to 404)
    if (
      pageNum &&
      (pageNum > numPages ||
        pageNum < 1 ||
        typeof parseInt(pageNum) !== "number")
    )
      return next();

    const pageLinks = [];

    for (let i = 1; i <= numPages; i++) {
      pageLinks.push(i);
    }

    let questions;

    const offset = req.params.pageNum ? (req.params.pageNum - 1) * 10 : 0;
    questions = await db.Question.findAll({
      offset,
      limit: 10,
      include: [
        { model: db.User, attributes: ["username", "id"] },
        { model: db.Answer },
      ],
      order: [["createdAt", "DESC"]],
    });
    for (q of questions) {
      q.voteCount = await voteCountForQuestion(q.id);
    }
    questions.sort((f, s) => {
      return;
    });
    currentQs = questions
    res.render("index", {
      questions,
      pageLinks,
      showAnswersCount: true,
      votableQuestions: true,
    });
  })
);

router.get("/about", (req, res) => {
  res.render("about-us");
});

module.exports = router;

async function votesForQ(q) {

  let qVotes = await db.Question_Vote.findAll({
    where: {
      questionId: q.id,
    },
  });
  return qVotes
}

router.get(
  "/qVote/q",
  asyncHandler(async (req, res, next) => {
    
    const votes = []
    for (q of currentQs) {
      let res = await votesForQ(q)
      votes.push(...res)
    }
    

    let count = 0;
    let voteHiLows = {};
    votes.forEach((vote) => {
      if (voteHiLows[vote.questionId]) {
        voteHiLows[vote.questionId] += vote.voteType ? 1 : -1;
      } else {
        voteHiLows[vote.questionId] = vote.voteType ? 1 : -1;
      }
    });


    let userId = req.session.userId;
    let userVotes = {};
    votes.forEach((vote) => {

      if (vote.userId == userId) {
        userVotes[vote.questionId] = vote.voteType;
      }
    });


    res.status(201).json({
      userVotes,
      voteHiLows,
    });
  })
);

module.exports = router;
