import { useEffect, useState } from "react";
import useApiRequest from "./useApiRequest";
import useSearchInput from "./useSearchInput";

const usePaginatedData = (endpoint, extraParams = {}, limit = 4) => {
  const [data, setData] = useState(null);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const { fetchData, isLoading } = useApiRequest();
  const { searchInput, setSearchInput, debouncedSearchInput } =
    useSearchInput();

  useEffect(() => {
    fetchDataFromApi(true);
  }, [debouncedSearchInput, ...Object.values(extraParams)]);

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
      setData((prevState) => (reset ? response : [...prevState, ...response]));
      setOffset((prevState) => (reset ? limit : prevState + limit));
      setHasMore(response.length === limit);
    }

    setTimeout(() => {
      window.scrollTo(0, scrollY);
    }, 0);
  };

  return {
    data,
    setData,
    isLoading,
    searchInput,
    setSearchInput,
    fetchDataFromApi,
    hasMore,
  };
};

export default usePaginatedData;
