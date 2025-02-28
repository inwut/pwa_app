import React from "react";

import "./RecipeCardList.css";
import RecipeCard from "./RecipeCard.jsx";

const RecipeCardList = ({ recipes }) => {
  return (
    <section className="recipe-card-list">
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.id}
          id={recipe.id}
          image={recipe.image}
          title={recipe.title}
          author={`@${recipe.author}`}
          likes={recipe.likes}
          isLiked={recipe.isLiked}
        />
      ))}
    </section>
  );
};

export default RecipeCardList;
