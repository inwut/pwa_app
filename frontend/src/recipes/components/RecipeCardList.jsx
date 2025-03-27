import React from "react";

import "./RecipeCardList.css";
import RecipeCard from "./RecipeCard.jsx";

const RecipeCardList = ({ recipes, reloadRecipes }) => {
  return (
    <section className="recipe-card-list">
      {recipes.length ? (
        recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            id={recipe.id}
            image={recipe.image}
            name={recipe.name}
            author={`@${recipe.author.username}`}
            likes={recipe.likesCount}
            isLiked={recipe.isLiked}
            reloadRecipes={reloadRecipes}
          />
        ))
      ) : (
        <p className="text--primary text--filler">
          Oops... No recipes found for this request.
        </p>
      )}
    </section>
  );
};

export default RecipeCardList;
