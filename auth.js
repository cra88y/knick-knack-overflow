const db = require("./db/models");

const loginUser = async (req, res, user) => {
  req.session.regenerate((err) => {
    req.session.userId = user.id;
    req.session.save();
    res.redirect("/");
  });
};
const logoutUser = async (req, res) => {
  req.session.destroy((err) => {
    res.redirect("/users/login");
  });
};
const restoreUser = async (req, res, next) => {
  res.locals.authenticated = false;
  if (!req.session.userId) {
    return next();
  }
  const userId = req.session.userId;
  try {
    const user = await db.User.findByPk(userId);
    user.hashedPassword = null;
    if (user) {
      res.locals.authenticated = true;
      res.locals.user = user;
      return next();
    }
  } catch (err) {
    return next(err);
  }
};
const requireAuth = (req, res, next) => {
  if (!res.locals.authenticated) {
    return res.redirect("/user/login");
  }
  return next();
};

module.exports = {
  loginUser,
  logoutUser,
  requireAuth,
  restoreUser,
};
