const express = require("express");

const {
  signup,
  login,
  getUsers,
  getUserById,
  getUserFollowing,
  getUserFollowers,
} = require("../controllers/userController");
const catchAsyncHandler = require("../utils/catchAsyncHandler");
const { optionalAuth } = require("../middleware/auth");

const router = express.Router();

router.get("/", catchAsyncHandler(getUsers));

router.post("/signup", catchAsyncHandler(signup));

router.post("/login", catchAsyncHandler(login));

router.get("/:id", optionalAuth, catchAsyncHandler(getUserById));

router.get("/:id/following", catchAsyncHandler(getUserFollowing));

router.get("/:id/followers", catchAsyncHandler(getUserFollowers));

module.exports = router;
