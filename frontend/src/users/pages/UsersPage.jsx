import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserCardList from "../components/UserCardList.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import useSearchInput from "../../common/hooks/useSearchInput.js";

const UsersPage = ({ type }) => {
  const userId = useParams().userId;
  const [users, setUsers] = useState([]);
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  const testUsers = [
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

  useEffect(() => {
    fetchUsersData();
  }, [debouncedSearchInput]);

  const fetchUsersData = () => {
    if (type === "following") {
      // api request to userId following
    } else if (type === "followers") {
      // api request to userId followers
    } else {
      // api request users
    }
    setUsers(testUsers);
  };

  return (
    <>
      <PageHeader>
        <PageTitle text={type.charAt(0).toUpperCase() + type.slice(1)} />
        <div className="page-header__toolbar">
          <SearchField
            value={searchInput}
            onSearch={(e) => setSearchInput(e.target.value)}
            placeholder="Username"
          />
        </div>
      </PageHeader>
      <UserCardList users={users} />
    </>
  );
};

export default UsersPage;
