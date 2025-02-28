import React from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import "./HomePage.css";

const HomePage = () => {
  return (
    <section className="home-page">
      <h1 className="text--heading home-page__title">Recipegram</h1>
      <p className="text--primary home-page__slogan">
        Welcome to <span>Recipegram</span> – Your Personal Recipe Collection!
      </p>
      <ul className="text--primary home-page__description">
        <li>
          <span>Create & Share</span> <ArrowForwardIosIcon /> Post your favorite
          recipes with photos.
        </li>
        <li>
          <span>Explore & Connect</span> <ArrowForwardIosIcon /> Discover new
          recipes, like, comment, and follow other users.
        </li>
        <li>
          <span>Offline Support</span> <ArrowForwardIosIcon /> Add and access
          recipes even without an internet connection.
        </li>
        <li>
          <span>Stay Updated</span> <ArrowForwardIosIcon /> Get push
          notifications for likes, comments, and new posts.
        </li>
      </ul>
    </section>
  );
};

export default HomePage;
