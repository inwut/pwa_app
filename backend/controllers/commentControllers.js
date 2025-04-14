const AppError = require("../utils/appError");
const commentDao = require("../dao/commentDao");
const recipeDao = require("../dao/recipeDao");
const sendPushNotification = require("../utils/sendPushNotification");

const createComment = async (req, res) => {
  const author = req.user;
  const { content, recipeId, commentId } = req.body;

  const comment = await commentDao.createComment({
    content,
    authorId: author.id,
    recipeId,
    commentId,
  });

  if (!commentId) {
    const recipe = await recipeDao.getRecipeByIdWithAuthorId(comment.recipeId);

    await sendPushNotification(recipe.author.id, {
      title: "Someone commented your recipe!",
      body: `@${author.username} commented your recipe "${recipe.name}"`,
      data: {
        url: `/recipes/${recipe.id}`,
      },
    });
  } else {
    const repliedComment = await commentDao.getCommentById(commentId);

    await sendPushNotification(repliedComment.authorId, {
      title: "Someone replied to your comment!",
      body: `@${author.username} replied to your comment: "${repliedComment.content}"`,
      data: {
        url: `/recipes/${repliedComment.recipeId}`,
      },
    });
  }

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

  if (comment.authorId !== authUserId && !isAdmin) {
    throw new AppError("You don't have permission to delete this comment", 403);
  }

  await commentDao.deleteComment(comment);
  res.status(200).json({ message: "Comment deleted successfully" });
};

module.exports = { createComment, deleteComment };
