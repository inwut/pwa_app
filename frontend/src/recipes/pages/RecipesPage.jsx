import React, { useEffect, useState } from "react";

import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import CheckBox from "../../common/components/pageElements/CheckBox.jsx";
import ProductsAutocomplete from "../components/ProductsAutocomplete.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";
import useSearchInput from "../../common/hooks/useSearchInput.js";

const RecipesPage = () => {
  const [recipes, setRecipes] = useState([]);
  const [isOnlyFollowing, setIsOnlyFollowing] = useState(false);
  const [ingredients, setIngredients] = useState([]);
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
  }, [debouncedSearchInput, isOnlyFollowing, ingredients]);

  const fetchRecipesData = () => {
    // api request
    setRecipes(testRecipes);
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
          <CheckBox
            label="Only following"
            onCheck={toggleCheckBoxHandler}
            checked={isOnlyFollowing}
          />
        </div>
      </PageHeader>
      <ProductsAutocomplete onIngredientsChange={changeIngredientsHandler} />
      <RecipeCardList recipes={recipes} />
    </>
  );
};

export default RecipesPage;
