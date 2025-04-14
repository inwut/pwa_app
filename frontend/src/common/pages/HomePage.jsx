import React from "react";
import DinnerDiningIcon from "@mui/icons-material/DinnerDining";
import BakeryDiningIcon from "@mui/icons-material/BakeryDining";
import LunchDiningIcon from "@mui/icons-material/LunchDining";
import IcecreamIcon from "@mui/icons-material/Icecream";

import "./HomePage.css";

const HomePage = () => {
  return (
    <section className="home-page">
      <h1 className="text--heading home-page__title">Recipegram</h1>
      <p className="text--heading home-page__slogan">
        Welcome to <span>Recipegram</span> – Your Personal Recipe Collection
      </p>
      <ul className="text--primary home-page__description">
        <li>
          <span>Create & Share</span> <DinnerDiningIcon /> Post your favorite
          recipes with photos.
        </li>
        <li>
          <span>Explore & Connect</span> <BakeryDiningIcon /> Discover new
          recipes, like, comment, and follow other users.
        </li>
        <li>
          <span>Offline Support</span> <LunchDiningIcon /> Access recipes even
          without an internet connection.
        </li>
        <li>
          <span>Stay Updated</span> <IcecreamIcon /> Get push notifications for
          likes, comments, and new followers.
        </li>
      </ul>
    </section>
  );
};

export default HomePage;
