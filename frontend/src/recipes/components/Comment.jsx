import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import "./Comment.css";
import Button from "../../common/components/pageElements/Button.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";
import api from "../../common/api.js";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import { useNotification } from "../../common/providers/NotificationProvider.jsx";

const Comment = ({ isParent, comment, recipeId, reloadData }) => {
  const { currentUser } = useAuth();
  const { showError, showInfo } = useNotification();
  const [reply, setReply] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);

  const toggleReplyFieldHandler = () => {
    setShowReplyField((prevState) => !prevState);
  };

  const sendReplyHandler = async () => {
    const scrollY = window.scrollY;
    try {
      await api.post("comments/", {
        content: reply,
        recipeId,
        commentId: comment.id,
      });
      await reloadData();
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);
    } catch (error) {
      if (!navigator.onLine) {
        showInfo(
          "You're offline. Your reply will be sent once you're back online.",
        );
        return;
      }
      showError(error);
    } finally {
      setReply("");
      setShowReplyField(false);
    }
  };

  const deleteCommentHandler = async () => {
    try {
      await api.delete(`comments/${comment.id}`);
      await reloadData();
    } catch (error) {
      if (!navigator.onLine) {
        showInfo(
          "You're offline. Your comment will be deleted once you're back online.",
        );
        return;
      }
      showError(error);
    }
  };

  return (
    <div className="comment">
      <Info style={{ alignItems: "start" }}>
        <div className="comment__info-section">
          <Link to={`/profile/${comment.author.id}`}>
            <Button text={`@${comment.author.username}`} />
          </Link>
          {comment.to && ">"}
          {comment.to && (
            <Link to={`/profile/${comment.to.id}`}>
              <Button text={`@${comment.to.username}`} />
            </Link>
          )}
          {currentUser &&
            (comment.author.id === currentUser.id ||
              currentUser.role === "admin") && (
              <Button
                icon={<DeleteOutlineIcon />}
                onClick={deleteCommentHandler}
              />
            )}
        </div>
      </Info>
      <p
        className="text--primary comment__text"
        onClick={toggleReplyFieldHandler}
      >
        {comment.content}
      </p>
      {showReplyField && (
        <div className="comment__reply">
          <StyledTextField
            label="Response"
            type="text"
            autoComplete="off"
            variant="standard"
            fullWidth
            value={reply}
            onChange={(e) => setReply(e.target.value)}
          />
          <Button
            icon={<ReplyIcon />}
            disabled={reply.length === 0}
            onClick={sendReplyHandler}
          />
        </div>
      )}
      <div className="comment__responses">
        {isParent &&
          comment.responses &&
          comment.responses.map((c) => <Comment key={c.id} comment={c} />)}
      </div>
    </div>
  );
};

export default Comment;
