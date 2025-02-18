import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";

const NavLinks = ({ onLinkCLick }) => {
  return (
    <ul className="nav__links text--primary">
      <li>
        <NavLink to="/recipes" onClick={onLinkCLick}>
          Recipes
        </NavLink>
      </li>
      <li>
        <NavLink to="/users" onClick={onLinkCLick}>
          Users
        </NavLink>
      </li>
      <li>
        <NavLink to="/favorites" onClick={onLinkCLick}>
          Favorites
        </NavLink>
      </li>
      <li>
        <NavLink to="/profile/1" onClick={onLinkCLick}>
          Profile
        </NavLink>
      </li>
      <li>
        <NavLink to="/auth" onClick={onLinkCLick}>
          Authenticate
        </NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
