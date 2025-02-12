import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import "./NavBar.css";
import NavLinks from "./NavLinks.jsx";

const NavBar = () => {
  const [openNav, setOpenNav] = useState(false);
  const [navRendered, setNavRendered] = useState(false);

  const toggleMenuHandler = () => {
    if (openNav) {
      setOpenNav(false);
      setTimeout(() => setNavRendered(false), 300);
    } else {
      setNavRendered(true);
      setTimeout(() => setOpenNav(true), 10);
    }
  };

  return (
    <header className="header">
      <h1 className="header__logo">
        <Link to="/">Recipegram</Link>
      </h1>
      <button className="header__menu-button" onClick={toggleMenuHandler}>
        {openNav ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav
        className={`nav ${navRendered && "nav--visible"} ${openNav && "nav--transitioned"}`}
      >
        <NavLinks onLinkCLick={toggleMenuHandler} />
      </nav>
    </header>
  );
};

export default NavBar;
