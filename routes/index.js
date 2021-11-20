const router = require("express").Router();
const app = require("../app");
const db = require("../db/models");
const { voteCountForQuestion } = require("./utils");

const { asyncHandler } = require("./utils");

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
      console.log("000000", q.voteCount);
    }
    questions.sort((f, s) => {
      return;
    });
    // console.log(voteCountForQuestion)

    res.render("index", {
      questions,
      pageLinks,
      showAnswersCount: true,
    });
  })
);

router.get("/about", (req, res) => {
  res.render("about-us");
});

module.exports = router;
