var express = require("express");
const { restoreUser, loginUser, logoutUser, requireAuth } = require("../auth");
var router = express.Router();
const bcrypt = require("bcryptjs");
const { csrfProtection, asyncHandler } = require("./utils");
const { userValidators, loginValidators } = require("./validations");
const db = require("../db/models");
const { check, validationResult } = require("express-validator");

router.get("/register", csrfProtection, (req, res) => {
  const user = db.User.build();
  res.render("user-register", {
    title: "welcome to register yourself",
    reqBody: {},
    user,
    csrfToken: req.csrfToken(),
  });
});

router.post(
  "/register",
  csrfProtection,
  userValidators,
  asyncHandler(async (req, res) => {
    const { username, email, password, confirmedPassword } = req.body;
    const reqBody = {
      username,
      email,
      password,
      confirmedPassword,
    };
    const user = db.User.build({ username, email });
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      const hashedPassword = await bcrypt.hash(confirmedPassword, 10);
      user.hashedPassword = hashedPassword;
      await user.save();
      loginUser(req, res, user);
    } else {
      const errors = validatorErrors.array().map((error) => error.msg);
      res.render("user-register", {
        title: "Register",
        reqBody,
        user,
        errors,
        csrfToken: req.csrfToken(),
      });
    }
  })
);

router.get("/login", csrfProtection, (req, res) => {
  res.render("user-login", {
    reqBody: {},
    title: "Login",
    csrfToken: req.csrfToken(),
  });
});
router.post(
  "/login",
  csrfProtection,
  loginValidators,
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    let errors = [];
    const validatorErrors = validationResult(req);
    if (validatorErrors.isEmpty()) {
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );
        if (passwordMatch) {
          loginUser(req, res, user);
          return;
        }
      }
      errors.push("Login failed for the provided email address and password");
    } else {
      errors = validatorErrors.array().map((error) => error.msg);
    }
    res.render("user-login", {
      title: "Login",
      email,
      errors,
      csrfToken: req.csrfToken(),
    });
  })
);
router.post("/logout", (req, res) => {
  logoutUser(req, res);
});

router.get(
  "/:id(\\d+)",
  // requireAuth,
  asyncHandler(async (req, res) => {
    let userId = req.params.id;
    const currentUser = await db.User.findByPk(userId, {
      include: [
        {
          model: db.Question,
          attributes: {
            exclude: ["createdAt", "updatedAt", "hashedPassword"],
          },
        },
        {
          model: db.Answer,
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        },
      ],
    });

    if (req.session.user) {
      userId = req.session.userId;
    }
    console.log(res.locals.user);
    res.render("profile-page", {
      currentUser,
    });
  })
);
module.exports = router;
