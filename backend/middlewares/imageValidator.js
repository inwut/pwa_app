const AppError = require("../utils/appError");

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

const imageValidator = (req, res, next) => {
  const imageFile = req.files?.image;
  if (imageFile) {
    if (!allowedMimeTypes.includes(imageFile.mimetype)) {
      return next(
        new AppError("Invalid image format. Allowed: JPG, PNG, WEBP", 415),
      );
    }
  }
  next();
};

module.exports = imageValidator;
