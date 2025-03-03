import React, { useState } from "react";
import { Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

import "./NavBar.css";
import NavLinks from "./NavLinks.jsx";

const NavBar = () => {
  const [isNavOpened, setIsNavOpened] = useState(false);
  const [hasNavRendered, setHasNavRendered] = useState(false);

  const toggleMenuHandler = () => {
    if (isNavOpened) {
      setIsNavOpened(false);
      setTimeout(() => setHasNavRendered(false), 300);
    } else {
      setHasNavRendered(true);
      setTimeout(() => setIsNavOpened(true), 10);
    }
  };

  return (
    <header className="header">
      <h1 className="header__logo">
        <Link to="/">Recipegram</Link>
      </h1>
      <button className="header__menu-button" onClick={toggleMenuHandler}>
        {isNavOpened ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav
        className={`nav ${hasNavRendered && "nav--visible"} ${isNavOpened && "nav--opened"}`}
      >
        <NavLinks onLinkCLick={toggleMenuHandler} />
      </nav>
    </header>
  );
};

export default NavBar;
