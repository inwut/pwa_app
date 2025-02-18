import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

import "./CheckBox.css";

const CheckBox = ({ label, onCheck }) => {
  return (
    <div className="checkbox text--primary">
      <FormControlLabel
        control={
          <Checkbox
            id="only-following-checkbox"
            onChange={onCheck}
            color="success"
            size="small"
          />
        }
        label={label}
        labelPlacement="end"
      />
    </div>
  );
};

export default CheckBox;
