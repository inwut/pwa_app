import React from "react";
const UsersPage = ({ type }) => {
  return type === "followings" ? (
    <h1>Followings Page</h1>
  ) : type === "followers" ? (
    <h1>Followers Page</h1>
  ) : (
    <h1>Users Page</h1>
  );
};

export default UsersPage;
