var express = require("express");
const { restoreUser, loginUser, logoutUser } = require("../auth");
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
      res.redirect("/");
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
      // Attempt to get the user by their email address.
      const user = await db.User.findOne({ where: { email } });

      if (user !== null) {
        // If the user exists then compare their password
        // to the provided password.
        const passwordMatch = await bcrypt.compare(
          password,
          user.hashedPassword.toString()
        );

        if (passwordMatch) {
          // If the password hashes match, then login the user
          // and redirect them to the default route.
          loginUser(req, res, user);
          req.session.save(() => {
            return res.redirect("/");
          });
          return;
        }
      }

      // Otherwise display an error message to the user.
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
module.exports = router;
