import React, { createContext, useCallback, useContext } from "react";
import { toast, ToastContainer } from "react-toastify";

const ErrorContext = createContext(undefined);

export const NotificationProvider = ({ children }) => {
  const showError = useCallback((error) => {
    console.error(error);
    const errorMessage = `${error.response?.data?.error || "Something went wrong"}. Please try again!`;
    toast.error(errorMessage, {
      icon: false,
      style: {
        backgroundColor: "#FFEAEA",
        color: "#A40000",
        fontFamily: "Libre Franklin",
        padding: "1rem",
      },
    });
  }, []);

  const showInfo = useCallback((message) => {
    toast.info(message, {
      icon: false,
      style: {
        backgroundColor: "#C3CEB7",
        color: "#141E0C",
        fontFamily: "Libre Franklin",
        padding: "1rem",
      },
    });
  }, []);

  return (
    <ErrorContext.Provider value={{ showError, showInfo }}>
      {children}
      <ToastContainer
        position="top-center"
        hideProgressBar={true}
        newestOnTop={true}
        autoClose={5000}
      />
    </ErrorContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within the NotificationProvider",
    );
  }
  return context;
};
