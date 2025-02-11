import React from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
const NavLinks = () => {
  return (
    <ul className="nav__links nav__links--view">
      <li>
        <NavLink to="/recipes">Recipes</NavLink>
      </li>
      <li>
        <NavLink to="/users">Users</NavLink>
      </li>
      <li>
        <NavLink to="/favorites">Favorites</NavLink>
      </li>
      <li>
        <NavLink to="/profile/1">Profile</NavLink>
      </li>
      <li>
        <NavLink to="/auth">Authenticate</NavLink>
      </li>
    </ul>
  );
};

export default NavLinks;
