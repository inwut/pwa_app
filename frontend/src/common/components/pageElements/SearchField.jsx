import React from "react";
import { InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import "./SearchField.css";

const SearchField = ({ value, onSearch, placeholder }) => {
  return (
    <div className="search">
      <div className="search__icon">
        <SearchIcon sx={{ color: "#74796D" }} />
      </div>
      <StyledInputBase
        id="recipe-search"
        value={value}
        onChange={onSearch}
        placeholder={placeholder}
      />
    </div>
  );
};

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  color: "#141E0C",
  fontSize: "0.9rem",
  fontFamily: "Libre Franklin",
  fontOpticalSizing: "auto",
  fontWeight: 400,
  fontStyle: "normal",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 5),
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "7rem",
      "&:focus": {
        width: "12rem",
      },
    },
  },
}));

export default SearchField;
