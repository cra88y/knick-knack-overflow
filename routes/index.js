const router = require("express").Router();
const db = require("../db/models");
const {
  asyncHandler,
} = require("./utils");

/* GET home page. */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const questions = await db.Question.findAll({ limit: 10 });
    // console.log(questions);
    res.render("index", {
      questions,
    });
  })
);

module.exports = router;
