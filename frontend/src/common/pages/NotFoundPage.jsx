import React from "react";
import { Link } from "react-router-dom";

import "./NotFoundPage.css";
import Button from "../components/pageElements/Button.jsx";

const NotFoundPage = () => {
  return (
    <main className="main">
      <div className="not-found">
        <h1 className="not-found__title">Oops! Page not found</h1>
        <Link to="/">
          <Button text="Go Home" filled />
        </Link>
      </div>
    </main>
  );
};

export default NotFoundPage;
