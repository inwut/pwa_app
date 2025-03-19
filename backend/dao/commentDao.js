const callDbHandler = require("../utils/callDbHandler");
const Comment = require("../db/models/comment");
const User = require("../db/models/user");

const getCommentById = async (id) => {
  return await callDbHandler(() =>
    Comment.findByPk(id, {
      attributes: ["id", "content"],
      include: [{ model: User, as: "author", attributes: ["id"] }],
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
