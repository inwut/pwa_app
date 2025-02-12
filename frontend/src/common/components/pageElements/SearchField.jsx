import React from "react";
import { InputBase, styled } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchField = ({ value, onSearch, placeholder }) => {
  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchIcon sx={{ color: "#74796D" }} />
      </SearchIconWrapper>
      <StyledInputBase
        value={value}
        onChange={onSearch}
        placeholder={placeholder}
      />
    </SearchWrapper>
  );
};

const SearchWrapper = styled("div")(({ theme }) => ({
  position: "relative",
  zIndex: "auto",
  display: "flex",
  alignItems: "center",
  padding: "0.5rem 0.2rem",
  width: "100%",
  borderRadius: "50rem",
  backgroundColor: "#EDEFE4",
  [theme.breakpoints.up("sm")]: {
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  position: "absolute",
  zIndex: "auto",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(0, 2),
  height: "100%",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  width: "100%",
  color: "#141E0C",
  fontSize: "0.9rem",
  fontFamily: "Libre Franklin",
  fontOpticalSizing: "auto",
  fontWeight: 400,
  fontStyle: "normal",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("sm")]: {
      width: "7rem",
      "&:focus": {
        width: "15rem",
      },
    },
  },
}));

export default SearchField;
