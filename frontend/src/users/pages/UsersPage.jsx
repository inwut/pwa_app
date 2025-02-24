import React from "react";
import UserCardList from "../components/UserCardList.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
const UsersPage = ({ type }) => {
  const users = [
    {
      id: 1,
      username: "dariavetrykush",
      recipes: 21,
      followers: 45,
    },
    {
      id: 2,
      username: "semytskiy",
      recipes: 21,
      followers: 45,
    },
    {
      id: 3,
      username: "inwut",
      recipes: 21,
      followers: 45,
    },
  ];

  return (
    <>
      <PageHeader>
        {type === "following" ? (
          <PageTitle text="Following" />
        ) : type === "followers" ? (
          <PageTitle text="Followers" />
        ) : (
          <PageTitle text="Users" />
        )}
        <div className="page-header__toolbar">
          <SearchField value="" onSearch={() => {}} placeholder="Username" />
        </div>
      </PageHeader>
      <UserCardList users={users} />
    </>
  );
};

export default UsersPage;
