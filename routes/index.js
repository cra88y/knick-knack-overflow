const router = require("express").Router();
const db = require("../db/models");

const { asyncHandler } = require("./utils");

/* GET home page. */
router.get(
  "/:pageNum?(\d+)",
  asyncHandler(async (req, res, next) => {
    const questionCount = await db.Question.count();
    const pageNum = req.params.pageNum;
    const numPages = Math.ceil(questionCount / 10);

    // since we are using this in index route we need to handle out of page range (send to 404)
    if (pageNum > numPages) return next();

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
