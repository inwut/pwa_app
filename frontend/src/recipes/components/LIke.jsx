import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import "./Like.css";
import { FormControlLabel } from "@mui/material";
const Like = ({ onLike, likes }) => {
  return (
    <div className="like">
      <FormControlLabel
        control={
          <Checkbox
            name="like"
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            onChange={onLike}
            color="success"
          />
        }
        label={likes}
        labelPlacement="bottom"
      />
    </div>
  );
};
export default Like;
