import React, { createContext, useCallback, useContext, useState } from "react";
import ErrorAlert from "../components/ErrorAlert.jsx";

const ErrorContext = createContext(undefined);

export const ErrorProvider = ({ children }) => {
  const [error, setError] = useState("");

  const showError = useCallback((error) => {
    console.error(error);
    const errorMessage = `${error.response?.data?.error || "Something went wrong"}. Please try again!`;
    setError(errorMessage);
    setTimeout(() => setError(""), 10000);
  }, []);

  return (
    <ErrorContext.Provider value={{ showError }}>
      {error && <ErrorAlert message={error} onClose={() => setError("")} />}
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within the ErrorProvider");
  }
  return context;
};
