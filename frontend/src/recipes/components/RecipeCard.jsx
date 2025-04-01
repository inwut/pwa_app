import React from "react";
import { Link } from "react-router-dom";

import "./RecipeCard.css";
import Like from "./Like.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import defaultImage from "../../assets/defaultRecipeImage.jpg";
import { useAuth } from "../../common/providers/AuthProvider.jsx";

const RecipeCard = ({
  id,
  name,
  image,
  author,
  likes,
  isLiked,
  updateRecipesData,
  updateFavoritesData,
}) => {
  const { currentUser } = useAuth();
  return (
    <div className="recipe-card">
      <Link to={`/recipes/${id}`}>
        <img
          src={
            image
              ? `${import.meta.env.VITE_API_BASE_URL}/uploads/${image}`
              : defaultImage
          }
          alt={name}
          className="recipe-card__image"
        />
      </Link>
      <div className="recipe-card__info">
        <div>
          <h3 className="text--primary recipe-card__title">{name}</h3>
          <Info>
            <span className="recipe-card__author">{author}</span>
          </Info>
        </div>
        <Like
          likes={likes}
          isLiked={isLiked}
          recipeId={id}
          updateRecipesData={updateRecipesData}
          updateFavoritesData={updateFavoritesData}
          disabled={currentUser && currentUser.role === "admin"}
        />
      </div>
    </div>
  );
};

export default RecipeCard;
