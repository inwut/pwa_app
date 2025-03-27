import React, { useEffect, useState } from "react";

import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";
import Loader from "../../common/components/Loader.jsx";
import useSearchInput from "../../common/hooks/useSearchInput.js";
import useApiRequest from "../../common/hooks/useApiRequest.jsx";

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState(null);
  const { fetchData, isLoading } = useApiRequest();
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  useEffect(() => {
    fetchRecipesData();
  }, [debouncedSearchInput]);

  const fetchRecipesData = async () => {
    const data = await fetchData("recipes/liked", {
      params: {
        search: debouncedSearchInput || null,
      },
    });
    if (data) setRecipes(data);
  };

  return (
    <>
      <PageHeader>
        <PageTitle text="Favorites" />
        <SearchField
          placeholder="Recipe name"
          value={searchInput}
          onSearch={(e) => setSearchInput(e.target.value)}
        />
      </PageHeader>
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

export default FavoritesPage;
