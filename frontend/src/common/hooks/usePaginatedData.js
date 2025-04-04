import { useEffect, useState } from "react";

import useApiRequest from "./useApiRequest";
import useSearchInput from "./useSearchInput";
import { getPagedArrayFromIDB, saveArrayToIDB } from "../../utils/indexedDb.js";

const usePaginatedData = (
  endpoint,
  IDBStore = null,
  extraDeps = {},
  extraParams = {},
  limit = 4,
) => {
  const [data, setData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isFromCache, setIsFromCache] = useState(false);
  const { fetchData, isLoading } = useApiRequest();
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  useEffect(() => {
    fetchDataFromApi(true);
  }, [
    debouncedSearchInput,
    ...Object.values(extraDeps),
    ...Object.values(extraParams),
  ]);

  const applyFilters = (data, filters) => {
    return data.filter((item) => {
      if (filters.search) {
        if (item.name) {
          if (!item.name.toLowerCase().includes(filters.search.toLowerCase())) {
            return false;
          }
        }
        if (item.username) {
          if (
            !item.username.toLowerCase().includes(filters.search.toLowerCase())
          ) {
            return false;
          }
        }
      }
      if (filters.ingredients) {
        if (
          !item.ingredients ||
          !filters.ingredients
            .split(",")
            .every((name) => item.ingredients.some((ing) => ing.name === name))
        ) {
          return false;
        }
      }
      return true;
    });
  };

  const fetchDataFromApi = async (reset = false) => {
    const scrollY = window.scrollY;

    const response = await fetchData(endpoint, {
      params: {
        search: debouncedSearchInput || null,
        offset: reset ? 0 : offset,
        limit,
        ...extraParams,
      },
    });

    if (response) {
      setIsFromCache(false);
      setData((prevState) => (reset ? response : [...prevState, ...response]));
      setOffset((prevState) => (reset ? limit : prevState + limit));
      setHasMore(response.length === limit);
      if (IDBStore) await saveArrayToIDB(IDBStore, response);
    } else if (IDBStore) {
      const cachedResponse = await getPagedArrayFromIDB(
        IDBStore,
        limit,
        reset ? 0 : offset,
      );
      if (cachedResponse) {
        setIsFromCache(true);
        const filteredData = applyFilters(cachedResponse, {
          search: debouncedSearchInput,
          ...extraParams,
        });
        setData((prevState) =>
          reset ? filteredData : [...prevState, ...filteredData],
        );
        setOffset((prevState) => (reset ? limit : prevState + limit));
        setHasMore(filteredData.length === limit);
      } else {
        setData(null);
      }
    } else {
      setData(null);
    }

    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  return {
    data,
    setData,
    isLoading,
    isFromCache,
    searchInput,
    setSearchInput,
    fetchDataFromApi,
    hasMore,
  };
};

export default usePaginatedData;
