import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Link, useParams } from "react-router-dom";

import api from "../../common/api.js";
import "./ProfilePage.css";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import Button from "../../common/components/pageElements/Button.jsx";
import Info from "../../common/components/pageElements/Info.jsx";
import RecipeCardList from "../../recipes/components/RecipeCardList.jsx";
import Loader from "../../common/components/Loader.jsx";
import useApiRequest from "../../common/hooks/useApiRequest.js";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import { useNotification } from "../../common/providers/NotificationProvider.jsx";
import { saveToIDB, getFromIDB } from "../../utils/indexedDb.js";
import PushNotificationToggle from "../components/PushNotificationToggle.jsx";

const ProfilePage = () => {
  const userId = useParams().userId;
  const { currentUser } = useAuth();
  const { fetchData, isLoading } = useApiRequest();
  const { showError } = useNotification();
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [currentUser, userId]);

  const fetchUserData = async () => {
    const data = await fetchData(`users/${userId}`);
    if (data) {
      setUser(data.user);
      if (currentUser && currentUser.id === +userId) {
        await saveToIDB("profile", data.user, "me");
      }
    } else if (currentUser && currentUser.id === +userId) {
      const cachedData = await getFromIDB("profile", "me");
      if (cachedData) {
        setUser(cachedData);
      } else {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  const updateRecipeLikes = (recipeId, isLiked) => {
    setUser(({ recipes, ...rest }) => ({
      ...rest,
      recipes: recipes.map((recipe) =>
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
    }));
  };

  const subscriptionHandler = async () => {
    try {
      if (user.isFollowed) {
        await api.delete(`subscriptions`, {
          params: {
            userId: user.id,
          },
        });
      } else {
        await api.post(`subscriptions`, {
          userId: user.id,
        });
      }
    } catch (error) {
      showError(error);
    }
    await fetchUserData();
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : user !== null ? (
        <>
          <PageHeader>
            <PageTitle text={`@${user.username}`} />
            {currentUser &&
            currentUser.role === "user" &&
            user.id !== currentUser.id ? (
              <Button
                text={user.isFollowed ? "Unfollow" : "Follow"}
                filled
                size="large"
                onClick={subscriptionHandler}
              />
            ) : (
              <PushNotificationToggle />
            )}
          </PageHeader>
          <Info>
            <span>{user.recipeCount} Recipes</span>
            <Link to="followers">
              <Button text={`${user.followersCount} Followers`} />
            </Link>
            <Link to="following">
              <Button text={`${user.followingCount} Following`} />
            </Link>
          </Info>
          <RecipeCardList
            recipes={user.recipes}
            updateRecipesData={updateRecipeLikes}
          />
          {currentUser && user.id === currentUser.id && (
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
      ) : (
        <p className="text--primary text--filler">
          Oops... No profile found. Maybe try again later.
        </p>
      )}
    </>
  );
};

export default ProfilePage;
