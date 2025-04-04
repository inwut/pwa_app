import React from "react";

import "./UserCardList.css";
import UserCard from "./UserCard.jsx";
import Button from "../../common/components/pageElements/Button.jsx";

const UserCardList = ({ users, loadMore, hasMore }) => {
  return (
    <>
      <section className="user-card-list">
        {users && users.length ? (
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
            Oops... No users found. Maybe try again later.
          </p>
        )}
      </section>
      {users && hasMore && (
        <div className="load-more__container">
          <Button
            text="Load more"
            filled
            size="large"
            onClick={() => loadMore()}
          />
        </div>
      )}
    </>
  );
};

export default UserCardList;
