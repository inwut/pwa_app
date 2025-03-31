import React from "react";

import "./UserCardList.css";
import UserCard from "./UserCard.jsx";
import Button from "../../common/components/pageElements/Button.jsx";

const UserCardList = ({ users, loadMore, hasMore }) => {
  return (
    <>
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
      {hasMore && (
        <div className="load-more__container">
          <Button
            text="Load more users"
            size="large"
            onClick={() => loadMore()}
          />
        </div>
      )}
    </>
  );
};

export default UserCardList;
