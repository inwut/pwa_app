import React from "react";
import { NavLink, useNavigate } from "react-router-dom";

import "./NavLinks.css";
import { useAuth } from "../../providers/AuthProvider.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "../pageElements/Button.jsx";

const NavLinks = ({ onLinkCLick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logout();
    navigate("/");
  };

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
      {currentUser?.role === "user" && (
        <li>
          <NavLink to="/favorites" onClick={onLinkCLick}>
            Favorites
          </NavLink>
        </li>
      )}
      {currentUser && currentUser.role === "user" && (
        <li>
          <NavLink to={`/profile/${currentUser.id}`} onClick={onLinkCLick}>
            Profile
          </NavLink>
        </li>
      )}
      {currentUser ? (
        <Button icon={<LogoutIcon />} onClick={logoutHandler} />
      ) : (
        <li>
          <NavLink to="/auth" onClick={onLinkCLick}>
            Authenticate
          </NavLink>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
