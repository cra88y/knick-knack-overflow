const { check, validationResult } = require("express-validator");
const userValidators = [
  check("username")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a username")
    .isLength({ max: 20 })
    .withMessage("Username must not be more than 20 characters long"),
  check("emailAddress")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address")
    .isLength({ max: 255 })
    .withMessage("Email Address must not be more than 255 characters long")
    .isEmail()
    .withMessage("Email Address is not a valid email"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password")
    .isLength({ max: 50 })
    .withMessage("Password must not be more than 50 characters long"),
  check("confirmedPassword")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Confirm Password")
    .isLength({ max: 50 })
    .withMessage("Confirm Password must not be more than 50 characters long"),
];
const loginValidators = [
  check("emailAddress")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Email Address"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a value for Password"),
];

const questionValidators = [
  check("content")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a question!"),
  check("title")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a title!")
    .custom(async (value, { req }) => {
      const otherQuestion = await db.Question.findOne({
        where: { title: value },
      });

      if (otherQuestion) {
        return Promise.reject(
          "Title taken... Your question was probably already asked!"
        );
      } else {
        return true;
      }
    }),
];

module.exports = { userValidators, loginValidators };
