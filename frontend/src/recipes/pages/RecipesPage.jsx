import React, { useEffect, useState } from "react";

import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import CheckBox from "../../common/components/pageElements/CheckBox.jsx";
import ProductsAutocomplete from "../components/ProductsAutocomplete.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";
import Loader from "../../common/components/Loader.jsx";
import useSearchInput from "../../common/hooks/useSearchInput.js";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import useApiRequest from "../../common/hooks/useApiRequest.jsx";

const RecipesPage = () => {
  const { currentUser } = useAuth();
  const [recipes, setRecipes] = useState(null);
  const [isOnlyFollowing, setIsOnlyFollowing] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const { fetchData, isLoading } = useApiRequest();
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  useEffect(() => {
    fetchRecipesData();
  }, [debouncedSearchInput, isOnlyFollowing, ingredients]);

  const fetchRecipesData = async () => {
    const ingredientsString = ingredients.map((ing) => ing.name).join(",");
    const data = await fetchData("recipes", {
      params: {
        search: debouncedSearchInput || null,
        onlyFollowing: isOnlyFollowing || null,
        ingredients: ingredientsString || null,
      },
    });

    if (data) setRecipes(data);
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
          <RecipeCardList recipes={recipes} reloadRecipes={fetchRecipesData} />
        )
      )}
    </>
  );
};

export default RecipesPage;
