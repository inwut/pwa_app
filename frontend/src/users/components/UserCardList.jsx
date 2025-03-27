import React from "react";

import "./UserCardList.css";
import UserCard from "./UserCard.jsx";

const UserCardList = ({ users }) => {
  return (
    <section className="user-card-list">
      {users.length ? (
        users.map((user) => (
          <UserCard
            key={user.id}
            id={user.id}
            username={user.username}
            recipes={user.recipeCount}
            followers={user.followersCount}
          />
        ))
      ) : (
        <p className="text--primary text--filler">
          Oops... No users found for this request.
        </p>
      )}
    </section>
  );
};

export default UserCardList;
