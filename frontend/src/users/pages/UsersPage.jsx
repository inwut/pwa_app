import React from "react";
import { useParams } from "react-router-dom";

import UserCardList from "../components/UserCardList.jsx";
import PageTitle from "../../common/components/pageElements/PageTitle.jsx";
import PageHeader from "../../common/components/pageElements/PageHeader.jsx";
import SearchField from "../../common/components/pageElements/SearchField.jsx";
import Loader from "../../common/components/Loader.jsx";
import usePaginatedData from "../../common/hooks/usePaginatedData.js";

const UsersPage = ({ type }) => {
  const userId = useParams().userId;
  const endpoint = userId ? `/users/${userId}/${type}` : "/users";
  const IDBStore = type === "users" ? type : null;
  const {
    data: users,
    isLoading,
    searchInput,
    setSearchInput,
    fetchDataFromApi,
    hasMore,
  } = usePaginatedData(endpoint, IDBStore, { type });

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
        <UserCardList
          users={users}
          loadMore={fetchDataFromApi}
          hasMore={hasMore}
        />
      )}
    </>
  );
};

export default UsersPage;
