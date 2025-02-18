import React from "react";

import "./UserCardList.css";
import UserCard from "./UserCard.jsx";

const UserCardList = ({ users }) => {
  return (
    <section className="user-card-list">
      {users.map((user) => (
        <UserCard
          key={user.id}
          id={user.id}
          username={user.username}
          recipes={user.recipes}
          followers={user.followers}
        />
      ))}
    </section>
  );
};

export default UserCardList;
