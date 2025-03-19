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

const restrictByRole = (roleType) => {
  return (req, res, next) => {
    const { role } = req.user;
    if (role !== roleType) {
      return next(
        new AppError("You don't have permission to perform this action", 403),
      );
    }
    next();
  };
};

module.exports = { auth, optionalAuth, restrictByRole };
