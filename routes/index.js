const router = require("express").Router();
const db = require("../db/models");
const { voteCountForQuestion } = require("./utils")

const { asyncHandler } = require("./utils");

/* GET home page. */
router.get(
  "/:pageNum?",
  asyncHandler(async (req, res) => {
    const numPages = Math.ceil(await db.Question.count() / 10);
    const pageLinks = [];

    for (let i = 1; i <= numPages; i++) {
      pageLinks.push(i);
    }

    let questions;

    if (req.params.pageNum) {
      questions = await db.Question.findAll({
        offset: ((req.params.pageNum - 1) * 10),
        limit: 10,
        raw: true,
        include: { model: db.User, attributes: ["username", "id"] },
        order: [
          ['createdAt', 'DESC']
        ],
      });
    } else {
      questions = await db.Question.findAll({
        limit: 10,
        raw: true,
        include: { model: db.User, attributes: ["username", "id"] },
        order: [
          ['createdAt', 'DESC']
        ],
      });
    }
    for (q of questions) {
      q.voteCount = await voteCountForQuestion(q.id);
      console.log('000000',q.voteCount)
    }
    questions.sort((f, s) => {
      return
    });
    // console.log(voteCountForQuestion)



    res.render("index", {
      questions,
      pageLinks
    });
  })
);



router.get(
  "/about",
  (req, res) => {
    res.render("about-us")
  }
)

module.exports = router;
