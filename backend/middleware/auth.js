const passport = require("passport");
const AppError = require("../utils/appError");

const auth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      if (info?.message === "jwt expired") {
        return next(new AppError("Token expired, please log in again", 401));
      }
      return next(new AppError("Invalid token, authentication failed", 401));
    }
    req.user = user;
    next();
  })(req, res, next);
};

const optionalAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);
};

module.exports = { auth, optionalAuth };
