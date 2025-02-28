import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link, useParams } from "react-router-dom";

import "./ProfilePage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import Button from "../../common/components/formElements/Button.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import RecipeCardList from "../../recipes/components/RecipeCardList.jsx";

const ProfilePage = () => {
  const userId = useParams().userId;
  const [user, setUser] = useState({ recipes: [] });
  const testUser = {
    id: 0,
    username: "dariavetrykush",
    followers: 34,
    following: 12,
    recipes: [
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
    ],
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = () => {
    // api request
    setUser(testUser);
  };

  const subscribeHandler = () => {
    // api request
  };

  return (
    <>
      <PageHeader>
        <PageTitle text={`@${user.username}`} />
        {user.id !== 0 && (
          <Button
            text="Subscribe"
            filled
            size="large"
            onClick={subscribeHandler}
          />
        )}
      </PageHeader>
      <Info>
        <span>{user.recipes.length} Recipes</span>
        <Link to="followers">
          <Button text={`${user.followers} Followers`} />
        </Link>
        <Link to="following">
          <Button text={`${user.following} Following`} />
        </Link>
      </Info>
      <RecipeCardList recipes={user.recipes} />
      {user.id === 0 && (
        <Link to="/recipes/create">
          <Button
            filled
            icon={<AddIcon />}
            size="large"
            classNames="profile__add-button"
          />
        </Link>
      )}
    </>
  );
};

export default ProfilePage;
