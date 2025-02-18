import React from "react";
import { Link } from "react-router-dom";

import "./RecipeCard.css";
import Like from "./LIke.jsx";

const RecipeCard = ({ title, image, author, id }) => {
  return (
    <div className="recipe-card">
      <Link to={id}>
        <img src={image} alt={title} className="recipe-card__image" />
      </Link>
      <div className="recipe-card__info">
        <div>
          <h3 className="recipe-card__title">{title}</h3>
          <span className="info__item recipe-card__author">{author}</span>
        </div>
        <Like numberOfLikes="45" />
      </div>
    </div>
  );
};

export default RecipeCard;
