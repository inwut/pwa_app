import React from "react";

import "./RecipesPage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import CheckBox from "../../common/components/pageElements/CheckBox.jsx";
import ProductsAutocomplete from "../components/ProductsAutocomplete.jsx";
import RecipeCardList from "../components/RecipeCardList.jsx";

const RecipesPage = () => {
  const recipes = [
    {
      id: 1,
      image:
        "https://wallpapers.com/images/hd/aesthetic-food-pictures-yw84jpuaeol0h8vh.jpg",
      title: "Healthy breakfast",
      author: "dariavetrykush",
      likes: 56,
    },
    {
      id: 2,
      image:
        "https://www.dish-works.com/wp-content/uploads/P03A-French-Onion-Greek-Yogurt-Dip-Kale-Salad-800x533.jpg",
      title: "Salad",
      author: "semytskiy",
      likes: 56,
    },
    {
      id: 3,
      image: "https://scx2.b-cdn.net/gfx/news/2020/healthyfood.jpg",
      title: "Cereal with berries",
      author: "inwut",
      likes: 56,
    },
  ];
  return (
    <>
      <PageHeader>
        <PageTitle text="Recipes" />
        <div className="page-header__toolbar">
          <SearchField value="" onSearch={() => {}} placeholder="Recipe name" />
          <CheckBox label="Only following" onCheck={() => {}} />
        </div>
      </PageHeader>
      <ProductsAutocomplete />
      <RecipeCardList recipes={recipes} />
    </>
  );
};

export default RecipesPage;
