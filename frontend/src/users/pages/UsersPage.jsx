import React, { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { useParams } from "react-router-dom";

import UserCardList from "../components/UserCardList.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";

const UsersPage = ({ type }) => {
  const userId = useParams().userId;
  const [users, setUsers] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearchInput] = useDebounce(searchInput, 1000);

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
    fetchUsers();
  }, [debouncedSearchInput]);

  const fetchUsers = () => {
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
        {type === "following" ? (
          <PageTitle text="Following" />
        ) : type === "followers" ? (
          <PageTitle text="Followers" />
        ) : (
          <PageTitle text="Users" />
        )}
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
