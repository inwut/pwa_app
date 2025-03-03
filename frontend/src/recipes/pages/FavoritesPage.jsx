import React, { useEffect, useState } from "react";

import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";
import useSearchInput from "../../common/hooks/useSearchInput.js";

const FavoritesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  const testRecipes = [
    {
      id: 1,
      image:
        "https://wallpapers.com/images/hd/aesthetic-food-pictures-yw84jpuaeol0h8vh.jpg",
      title: "Healthy breakfast",
      author: "dariavetrykush",
      likes: 56,
      isLiked: true,
    },
    {
      id: 2,
      image:
        "https://www.dish-works.com/wp-content/uploads/P03A-French-Onion-Greek-Yogurt-Dip-Kale-Salad-800x533.jpg",
      title: "Salad",
      author: "semytskiy",
      likes: 56,
      isLiked: false,
    },
    {
      id: 3,
      image: "https://scx2.b-cdn.net/gfx/news/2020/healthyfood.jpg",
      title: "Cereal with berries",
      author: "inwut",
      likes: 56,
      isLiked: true,
    },
  ];

  useEffect(() => {
    fetchRecipesData();
  }, [debouncedSearchInput]);

  const fetchRecipesData = () => {
    // api request
    setRecipes(testRecipes);
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
      <RecipeCardList recipes={recipes} />
    </>
  );
};

export default FavoritesPage;
