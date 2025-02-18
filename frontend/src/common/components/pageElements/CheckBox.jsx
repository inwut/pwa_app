import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

const CheckBox = ({ label, onCheck }) => {
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
            id="only-following-checkbox"
            onChange={onCheck}
            color="success"
            size="small"
            sx={{
              color: "#74796D",
              "&.Mui-checked": {
                color: "#476730",
              },
            }}
          />
        }
        label={label}
        labelPlacement="end"
        slotProps={{
          typography: {
            sx: {
              color: "#74796D",
              fontSize: "1rem",
              fontFamily: "Libre Franklin",
              fontWeight: 400,
              fontStyle: "normal",
            },
          },
        }}
      />
    </div>
  );
};

export default CheckBox;
