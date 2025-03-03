import React from "react";
import { Link } from "react-router-dom";

import "./RecipeCard.css";
import Like from "./Like.jsx";
import Info from "../../common/components/pageElements/Info.jsx";

const RecipeCard = ({ id, title, image, author, likes, isLiked }) => {
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${id}`}>
        <img src={image} alt={title} className="recipe-card__image" />
      </Link>
      <div className="recipe-card__info">
        <div>
          <h3 className="text--primary recipe-card__title">{title}</h3>
          <Info>
            <span className="recipe-card__author">{author}</span>
          </Info>
        </div>
        <Like likes={likes} isLiked={isLiked} recipeId={id} />
      </div>
    </div>
  );
};

export default RecipeCard;
