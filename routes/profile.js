const router = express.Router();
const express = require("express");
const { requireAuth } = require("../../auth");
const db = require("../../db/models");
const { asyncHandler } = require("../utils");


router.get(
    '/users/:id(\\d+)',
    requireAuth,
    asyncHandler(async(req, res) => {
    const user = await db.user.FindByPk(userId, {include: [{model: db.questions}]})
    let userId = undefined
    if (req.session.user) {
        userId = req.session.user.userId
     }
    res.render('profile-page', {
        user,
        title,
        content
    })
}))
