import { useState } from "react";
import { useDebounce } from "use-debounce";

const useSearchInput = (initialValue = "", delay = 1000) => {
  const [searchInput, setSearchInput] = useState(initialValue);
  const [debouncedSearchInput] = useDebounce(searchInput, delay);

  return {
    searchInput,
    setSearchInput,
    debouncedSearchInput,
  };
};

export default useSearchInput;
