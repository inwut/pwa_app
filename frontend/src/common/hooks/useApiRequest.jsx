import { useState, useRef } from "react";
import api from "../api.js";
import { useError } from "../providers/ErrorProvider.jsx";

const useApiRequest = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useError();
  const abortControllerRef = useRef(null);

  const fetchData = async (url, options = {}) => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await api.get(url, {
        signal: abortControllerRef.current?.signal,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error(error);
      if (error.name === "CanceledError") return null;
      showError(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchData, isLoading };
};

export default useApiRequest;
