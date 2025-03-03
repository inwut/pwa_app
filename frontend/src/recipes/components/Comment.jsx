import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import "./Comment.css";
import Button from "../../common/components/pageElements/Button.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import StyledTextField from "../../common/components/pageElements/StyledTextField.jsx";

const Comment = ({ parent, comment }) => {
  const [reply, setReply] = useState("");
  const [showReplyField, setShowReplyField] = useState(false);

  const toggleReplyFieldHandler = () => {
    setShowReplyField((prevState) => !prevState);
  };

  const sendReplyHandler = () => {
    //api request
    setShowReplyField(false);
  };

  const deleteCommentHandler = () => {
    // api request
  };

  const reformatResponses = (responses) => {
    const reformattedResponses = [];
    const reformat = (comments, parentAuthor = comment.author) => {
      comments.forEach((comment) => {
        reformattedResponses.push({ ...comment, to: parentAuthor });
        if (comment.responses) {
          reformat(comment.responses, comment.author);
        }
      });
    };
    reformat(responses);
    return reformattedResponses;
  };

  return (
    <div className="comment">
      <Info>
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
        </div>
        <div className="comment__info-section">
          <span>{comment.created_at}</span>
          {comment.author.id === 1 && (
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
        {comment.text}
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
        {parent &&
          comment.responses &&
          reformatResponses(comment.responses).map((c) => (
            <Comment key={c.id} comment={c} />
          ))}
      </div>
    </div>
  );
};

export default Comment;
