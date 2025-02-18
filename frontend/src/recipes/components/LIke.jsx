import React from "react";
import Checkbox from "@mui/material/Checkbox";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";

import "./Like.css";
import { FormControlLabel } from "@mui/material";
const Like = ({ onLike, numberOfLikes }) => {
  return (
    <div className="like">
      <FormControlLabel
        value="bottom"
        control={
          <Checkbox
            name="like"
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            onChange={onLike}
            color="success"
            sx={{
              paddingBottom: "0.2rem",
              color: "#74796D",
              "&.Mui-checked": {
                color: "#476730",
              },
            }}
          />
        }
        label={numberOfLikes}
        labelPlacement="bottom"
      />
    </div>
  );
};
export default Like;
