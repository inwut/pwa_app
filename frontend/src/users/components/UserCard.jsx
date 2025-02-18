import React from "react";

import "./UserCard.css";
import Info from "../../common/components/pageElements/Info.jsx";
import { Link } from "react-router-dom";

const UserCard = ({ id, username, recipes, followers }) => {
  return (
    <Link to={`/profile/${id}`}>
      <div className="user-card">
        <h3 className="text--primary user-card__username">@{username}</h3>
        <Info>
          <span>{recipes} Recipes</span>
          <span>{followers} Followers</span>
        </Info>
      </div>
    </Link>
  );
};

export default UserCard;
