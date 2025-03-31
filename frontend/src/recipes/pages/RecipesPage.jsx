import React, { useState } from "react";

import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import CheckBox from "../../common/components/pageElements/CheckBox.jsx";
import ProductsAutocomplete from "../components/ProductsAutocomplete.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";
import Loader from "../../common/components/Loader.jsx";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import usePaginatedData from "../../common/hooks/usePaginatedData.js";

const RecipesPage = () => {
  const { currentUser } = useAuth();
  const [isOnlyFollowing, setIsOnlyFollowing] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const {
    data: recipes,
    setData: setRecipes,
    isLoading,
    searchInput,
    setSearchInput,
    fetchDataFromApi,
    hasMore,
  } = usePaginatedData("recipes", {
    onlyFollowing: isOnlyFollowing || null,
    ingredients: ingredients.map((ing) => ing.name).join(",") || null,
  });

  const updateRecipeLikes = (recipeId, isLiked) => {
    setRecipes((prevRecipes) =>
      prevRecipes.map((recipe) =>
        recipe.id === recipeId
          ? {
              ...recipe,
              isLiked,
              likesCount: isLiked
                ? +recipe.likesCount + 1
                : +recipe.likesCount - 1,
            }
          : recipe,
      ),
    );
  };

  const toggleCheckBoxHandler = () => {
    setIsOnlyFollowing((prevState) => !prevState);
  };

  const changeIngredientsHandler = (data) => {
    setIngredients(data);
  };

  return (
    <>
      <PageHeader>
        <PageTitle text="Recipes" />
        <div className="page-header__toolbar">
          <SearchField
            placeholder="Recipe name"
            value={searchInput}
            onSearch={(e) => setSearchInput(e.target.value)}
          />
          {currentUser && (
            <CheckBox
              label="Only following"
              onCheck={toggleCheckBoxHandler}
              checked={isOnlyFollowing}
            />
          )}
        </div>
      </PageHeader>
      <ProductsAutocomplete onIngredientsChange={changeIngredientsHandler} />
      {isLoading ? (
        <Loader />
      ) : (
        recipes !== null && (
          <RecipeCardList
            recipes={recipes}
            updateRecipesData={updateRecipeLikes}
            loadMore={fetchDataFromApi}
            hasMore={hasMore}
          />
        )
      )}
    </>
  );
};

export default RecipesPage;
