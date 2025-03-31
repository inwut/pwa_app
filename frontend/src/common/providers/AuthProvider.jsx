import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api.js";
import useApiRequest from "../../common/hooks/useApiRequest.jsx";
import { useError } from "./ErrorProvider.jsx";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const { fetchData, isLoading } = useApiRequest();
  const { showError } = useError();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = useCallback(async () => {
    const data = await fetchData("http://localhost:5000/api/users/me");
    if (data) {
      setCurrentUser(data);
    }
  }, []);

  const signup = useCallback(async (username, email, password) => {
    try {
      const response = await api.post("users/signup", {
        username,
        email,
        password,
      });
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
      showError(error);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post("users/login", {
        email,
        password,
      });
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
      showError(error);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("users/logout");
      setCurrentUser(null);
    } catch (error) {
      showError(error);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, isLoading, signup, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within the AuthProvider");
  }
  return context;
};
