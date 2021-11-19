const router = require("express").Router();
const db = require("../db/models");

const { asyncHandler } = require("./utils");

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll({
      limit: 10,
      raw: true,
      include: { model: db.User, attributes: ["username", "id"] },
      order: [
        ['createdAt', 'DESC']
    ],
    });
    res.render("index", {
      questions,
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
