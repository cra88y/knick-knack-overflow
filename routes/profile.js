const express = require("express");
const { requireAuth } = require("../auth");
const db = require("../db/models");
const { asyncHandler } = require("./utils");
const 
const router = express.Router();


console.log("HI")
router.get(
    '/:id(\\d+)',
    requireAuth,
    asyncHandler(async(req, res) => {
    console.log("Hii")
    const user = await db.User.findByPk(userId, {include: [{model: db.Question}, {model: db.Answer}]})
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

router.post()

router.put()

router.delete()
router.get(
    'profiles/:id(\\d+)',
    requireAuth,
    asyncHandler(async(req, res) => {
    const id = req.params.id;
    const user = await User.findAll({
        include: [{model: Question}, {model: Answer}],
        where: {
            userId: id
        }
    })
    // if (req.session.user) {
    //     userId = req.session.user.userId
    // }
    res.render('profile-page', {

    })
}))

module.exports = router;
