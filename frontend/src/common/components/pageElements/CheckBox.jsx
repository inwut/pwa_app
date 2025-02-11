import React from "react";
import Checkbox from "@mui/material/Checkbox";
import { FormControlLabel } from "@mui/material";

const CheckBox = ({ label, onCheck }) => {
  return (
    <div>
      <FormControlLabel
        control={
          <Checkbox
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
              fontSize: "0.8rem",
              fontFamily: "Libre Franklin",
              fontWeight: 500,
              fontStyle: "normal",
              color: "#74796D",
            },
          },
        }}
      />
    </div>
  );
};

export default CheckBox;
