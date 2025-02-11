import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import NavLinks from "./NavLinks.jsx";
import MenuIcon from "@mui/icons-material/Menu";

import "./NavBar.css";
const NavBar = () => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenuHandler = () => {
    setOpenMenu((prevState) => !prevState);
  };

  return (
    <>
      <header className="header header--view ">
        <h1 className="header__logo">
          <Link to="/">Recipegram</Link>
        </h1>
        <button className="header__menu-button" onClick={toggleMenuHandler}>
          <MenuIcon sx={{ color: "#141E0C", fontSize: "2rem" }} />
        </button>
        <nav
          className={openMenu ? "nav nav--view nav--visible" : "nav nav--view"}
        >
          <NavLinks />
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default NavBar;
