import React from "react";
import { InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ value, onSearch, placeholder }) => {
  return (
    <Search>
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "#74796D" }} />
      </SearchIconWrapper>
      <StyledInputBase
        value={value}
        onChange={onSearch}
        placeholder={placeholder}
      />
    </Search>
  );
};

const Search = styled("div")(({ theme }) => ({
  display: "flex",
  padding: "0.5rem 0.2rem",
  alignItems: "center",
  position: "relative",
  zIndex: "auto",
  borderRadius: "50rem",
  backgroundColor: "#EDEFE4",
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  zIndex: "auto",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "#141E0C",
  fontSize: "0.8rem",
  fontFamily: "Libre Franklin",
  fontOpticalSizing: "auto",
  fontWeight: 500,
  fontStyle: "normal",
  width: "100%",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "7rem",
      "&:focus": {
        width: "15rem",
      },
      "&::placeholder": {
        color: "#74796D",
      },
    },
  },
}));

export default SearchField;
