import React from "react";
import "./RecipeCardList.css";
import RecipeCard from "./RecipeCard.jsx";
import Button from "../../common/components/pageElements/Button.jsx";

const RecipeCardList = ({
  recipes,
  loadMore,
  hasMore,
  updateRecipesData,
  updateFavoritesData,
}) => {
  return (
    <>
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
              updateRecipesData={updateRecipesData}
              updateFavoritesData={updateFavoritesData}
            />
          ))
        ) : (
          <p className="text--primary text--filler">
            Oops... No recipes found for this request.
          </p>
        )}
      </section>
      {hasMore && (
        <div className="load-more__container">
          <Button
            text="Load more"
            filled
            size="large"
            onClick={() => loadMore()}
          />
        </div>
      )}
    </>
  );
};

export default RecipeCardList;
