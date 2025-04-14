const callDbHandler = require("../utils/callDbHandler");
const Comment = require("../db/models/comment");

const getCommentById = async (id) => {
  return await callDbHandler(() =>
    Comment.findByPk(id, {
      attributes: ["id", "content", "authorId", "recipeId"],
    }),
  );
};

const createComment = async (commentData) => {
  return await callDbHandler(() => Comment.create(commentData));
};

const deleteComment = async (comment) => {
  await callDbHandler(() => comment.destroy());
};

module.exports = { getCommentById, createComment, deleteComment };
