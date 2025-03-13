const AppError = require("./appError");

const callDbHandler = async (fn, errorMessage = "Database error occurred") => {
  try {
    return await fn();
  } catch (err) {
    console.error(err);
    if (err.name === "SequelizeUniqueConstraintError") {
      if (err.parent.constraint === "user_username_key") {
        throw new AppError("User with this username already exists", 409);
      }
      if (err.parent.constraint === "user_email_key") {
        throw new AppError("User with this email already exists", 409);
      }
    }
    if (err.name === "SequelizeValidationError") {
      throw new AppError(
        err.errors.map((error) => error.message).join(", "),
        400,
      );
    }
    throw new AppError(errorMessage, 500);
  }
};

module.exports = callDbHandler;
