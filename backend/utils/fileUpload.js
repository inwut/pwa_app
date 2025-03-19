const { v4: uuidv4 } = require("uuid");
const path = require("path");
const AppError = require("./appError");
const fs = require("fs");

const generateUniqueImageName = (image) => {
  const MIME_TYPE_MAP = {
    "image/png": "png",
    "image/jpeg": "jpeg",
    "image/jpg": "jpg",
  };
  return `${uuidv4()}.${MIME_TYPE_MAP[image.mimetype]}`;
};

const saveImage = async (image, imageName) => {
  const imagePath = path.join(__dirname, "..", "uploads", imageName);
  await image.mv(imagePath, (err) => {
    if (err) {
      console.error(err);
      throw new AppError("Error saving image", 500);
    }
  });
};

const deleteImage = (imagePath) => {
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }
};

module.exports = { generateUniqueImageName, saveImage, deleteImage };
