const Comment = require("../db/models/comment");
const callDbHandler = require("../utils/callDbHandler");
const User = require("../db/models/user");
const AppError = require("../utils/appError");
const Recipe = require("../db/models/recipe");

const createComment = async (req, res) => {
  const authorId = req.user.id;
  const { content, recipeId, commentId } = req.body;

  const comment = await callDbHandler(() =>
    Comment.create({
      content,
      authorId,
      recipeId,
      commentId,
    }),
  );

  const commenter = callDbHandler(() =>
    User.findByPk(comment.authorId, {
      attributes: ["username"],
    }),
  );

  const recipe = callDbHandler(() =>
    Recipe.findByPk(comment.recipeId, {
      attributes: ["name"],
    }),
  ); // для пушів

  res.status(201).json(comment);
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const authUserId = req.user.id;
  const isAdmin = req.user.role === "admin";

  const comment = await callDbHandler(() =>
    Comment.findByPk(commentId, {
      attributes: ["id", "content"],
      include: [{ model: User, as: "author", attributes: ["id"] }],
    }),
  );

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.author.id !== authUserId && !isAdmin) {
    throw new AppError("You don't have permission to delete this comment", 403);
  }

  await callDbHandler(() => comment.destroy());
  res.status(200).json({ message: "Comment deleted successfully" });
};

module.exports = { createComment, deleteComment };
