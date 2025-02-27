import React, { useState } from "react";
import { Link } from "react-router-dom";
import TextField from "@mui/material/TextField";
import ReplyIcon from "@mui/icons-material/Reply";

import "./Comment.css";
import Button from "../../common/components/formElements/Button.jsx";

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
      <div className="text--primary comment__author">
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
      <p
        className="text--primary comment__text"
        onClick={toggleReplyFieldHandler}
      >
        {comment.text}
      </p>
      {showReplyField && (
        <div className="comment__reply">
          <TextField
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
