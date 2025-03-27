import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import UserCardList from "../components/UserCardList.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import Loader from "../../common/components/Loader.jsx";
import useSearchInput from "../../common/hooks/useSearchInput.js";
import useApiRequest from "../../common/hooks/useApiRequest.jsx";

const UsersPage = ({ type }) => {
  const userId = useParams().userId;
  const [users, setUsers] = useState([]);
  const { fetchData, isLoading } = useApiRequest();
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  useEffect(() => {
    fetchUsersData();
  }, [debouncedSearchInput, userId]);

  const fetchUsersData = async () => {
    let data;
    if (type === "following") {
      data = await fetchData(`users/${userId}/following`, {
        params: {
          search: debouncedSearchInput || null,
        },
      });
    } else if (type === "followers") {
      data = await fetchData(`users/${userId}/followers`, {
        params: {
          search: debouncedSearchInput || null,
        },
      });
    } else {
      data = await fetchData("users", {
        params: {
          search: debouncedSearchInput || null,
        },
      });
    }
    if (data) setUsers(data);
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
      {isLoading ? (
        <Loader />
      ) : (
        users !== null && <UserCardList users={users} />
      )}
    </>
  );
};

export default UsersPage;
