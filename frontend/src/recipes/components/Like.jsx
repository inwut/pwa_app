import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { FormControlLabel } from "@mui/material";

import api from "../../common/api.js";
import "./Like.css";
import { useAuth } from "../../common/providers/AuthProvider.jsx";
import { useError } from "../../common/providers/ErrorProvider.jsx";
import { saveToIDB, deleteFromIDB } from "../../utils/indexedDb.js";

const Like = ({
  isLiked = false,
  recipeId,
  likes,
  updateRecipesData,
  updateFavoritesData,
  updateRecipeData,
  disabled,
}) => {
  const { currentUser } = useAuth();
  const { showError } = useError();
  const navigate = useNavigate();

  const likeHandler = async (event) => {
    if (currentUser) {
      const newLiked = event.target.checked;
      try {
        if (newLiked) {
          await api.post(`recipes/${recipeId}/like`);
          const updatedRecipe = await api.get(`recipes/${recipeId}`);
          await saveToIDB("favorites", updatedRecipe.data.recipe);
        } else {
          await api.delete(`recipes/${recipeId}/like`);
          await deleteFromIDB("favorites", +recipeId);
        }
        if (updateRecipesData) {
          await updateRecipesData(recipeId, newLiked);
        }
        if (updateRecipeData) {
          await updateRecipeData();
        }
        if (updateFavoritesData) {
          await updateFavoritesData();
        }
      } catch (error) {
        showError(error);
      }
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="like">
      <FormControlLabel
        control={
          <Checkbox
            name="like"
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            color="success"
            checked={isLiked}
            onChange={likeHandler}
            disabled={disabled}
          />
        }
        label={likes}
        labelPlacement="bottom"
      />
    </div>
  );
};
export default Like;
