import React, { useEffect, useState } from "react";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { FormControlLabel } from "@mui/material";

import "./Like.css";

const Like = ({ isLiked = false, recipeId, likes }) => {
  const [liked, setLiked] = useState(isLiked);

  const likeHandler = (event) => {
    const newLiked = event.target.checked;
    setLiked(newLiked);
    if (newLiked) {
      // api request liked
    } else {
      // api request dislike
    }
  };

  useEffect(() => {
    setLiked(isLiked);
  }, [isLiked]);

  return (
    <div className="like">
      <FormControlLabel
        control={
          <Checkbox
            name="like"
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            color="success"
            checked={liked}
            onChange={likeHandler}
          />
        }
        label={likes}
        labelPlacement="bottom"
      />
    </div>
  );
};
export default Like;
