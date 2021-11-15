const express = require("express");
const { restoreUser } = require("../../auth");
const router = express.Router();
const db = require("../db/models");
const asyncHandler = require("../utils");
router.get("/", function (req, res) {});

router.post(
  "/",
  restoreUser,
  asyncHandler(async (req, res) => {
    const userId = res.locals.userId;
    const { content } = req.body;
    db.Answer.build({ userId, content });
  })
);

module.exports = router;
