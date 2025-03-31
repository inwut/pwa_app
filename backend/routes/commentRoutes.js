const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, restrictByRole } = require("../middlewares/auth");
const {
  commentDataValidator,
} = require("../middlewares/validators/commentValidators");
const { idValidator } = require("../middlewares/validators/commonValidators");
const validationHandler = require("../middlewares/validationHandler");
const {
  createComment,
  deleteComment,
} = require("../controllers/commentControllers");

const router = express.Router();

router.post(
  "/",
  auth,
  restrictByRole("user"),
  commentDataValidator,
  validationHandler,
  catchAsyncHandler(createComment),
);
router.delete("/:id", auth, idValidator, catchAsyncHandler(deleteComment));

module.exports = router;
