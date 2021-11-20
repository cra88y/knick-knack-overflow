const router = require("express").Router();
const app = require("../app");
const db = require("../db/models");

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
        typeof parseInt(pageNum) !== 'number'
      )) return next();

    const pageLinks = [];

    for (let i = 1; i <= numPages; i++) {
      pageLinks.push(i);
    }

    let questions;

    if (pageNum) {
      questions = await db.Question.findAll({
        offset: ((pageNum - 1) * 10),
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
