const db = require("./db/models");

const loginUser = async(req, res, user) => {
  req.session.auth = {
    userId: user.id,
  };
  // return true
};
const logoutUser = async(req, res) => {
  delete req.session.auth;
  return true
};
const restoreUser = async (req, res, next) => {
  if (req.session.auth) {
    const { userId } = req.session.auth;

    try {
      const user = await db.User.findByPk(userId);
      user.hashedPassword = null;
      if (user) {
        res.locals.authenticated = true;
        res.locals.user = user;
        next();
      }
    } catch (err) {
      res.locals.authenticated = false;
      next(err);
    }
  } else {
    res.locals.authenticated = false;
    next();
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
