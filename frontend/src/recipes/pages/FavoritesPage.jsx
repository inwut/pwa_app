import React from "react";

import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";
import Loader from "../../common/components/Loader.jsx";
import usePaginatedData from "../../common/hooks/usePaginatedData.js";

const FavoritesPage = () => {
  const {
    data: recipes,
    isLoading,
    searchInput,
    setSearchInput,
    fetchDataFromApi,
    hasMore,
  } = usePaginatedData("recipes/liked");

  const updateRecipeLikes = async () => {
    await fetchDataFromApi(true);
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
          <RecipeCardList
            recipes={recipes}
            updateFavoritesData={updateRecipeLikes}
            loadMore={fetchDataFromApi}
            hasMore={hasMore}
          />
        )
      )}
    </>
  );
};

export default FavoritesPage;
