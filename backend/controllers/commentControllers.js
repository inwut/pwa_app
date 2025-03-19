const AppError = require("../utils/appError");
const commentDao = require("../dao/commentDao");
const userDao = require("../dao/userDao");
const recipeDao = require("../dao/recipeDao");

const createComment = async (req, res) => {
  const authorId = req.user.id;
  const { content, recipeId, commentId } = req.body;

  const comment = await commentDao.createComment({
    content,
    authorId,
    recipeId,
    commentId,
  });

  const commenter = await userDao.getUserById(comment.authorId);
  const recipe = await recipeDao.getRecipeById(comment.recipeId); // для пушів
  res.status(201).json(comment);
};

const deleteComment = async (req, res) => {
  const commentId = req.params.id;
  const authUserId = req.user.id;
  const isAdmin = req.user.role === "admin";

  const comment = await commentDao.getCommentById(commentId);

  if (!comment) {
    throw new AppError("Comment not found", 404);
  }

  if (comment.author.id !== authUserId && !isAdmin) {
    throw new AppError("You don't have permission to delete this comment", 403);
  }

  await commentDao.deleteComment(comment);
  res.status(200).json({ message: "Comment deleted successfully" });
};

module.exports = { createComment, deleteComment };
