const express = require("express");

const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { auth, restrictByRole } = require("../middleware/auth");
const {
  createComment,
  deleteComment,
} = require("../controllers/commentControllers");

const router = express.Router();

router.post(
  "/",
  auth,
  restrictByRole("user"),
  catchAsyncHandler(createComment),
);
router.delete("/:id", auth, catchAsyncHandler(deleteComment));

module.exports = router;
