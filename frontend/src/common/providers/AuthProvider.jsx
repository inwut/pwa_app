import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api.js";
import { useError } from "./ErrorProvider.jsx";
import { deleteFromIDB, getFromIDB, saveToIDB } from "../../utils/indexedDb.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useError();

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get("users/me");
      setCurrentUser(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        await deleteFromIDB("users", "current");
        setCurrentUser(null);
      } else {
        const cachedUser = await getFromIDB("users", "current");
        setCurrentUser(cachedUser || null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setCurrentUser]);

  const signup = useCallback(
    async (username, email, password) => {
      try {
        const response = await api.post("users/signup", {
          username,
          email,
          password,
        });
        setCurrentUser(response.data);
        await saveToIDB("users", "current", response.data);
      } catch (error) {
        setCurrentUser(null);
        showError(error);
      }
    },
    [setCurrentUser, showError],
  );

  const login = useCallback(
    async (email, password) => {
      try {
        const response = await api.post("users/login", {
          email,
          password,
        });
        setCurrentUser(response.data);
        await saveToIDB("users", "current", response.data);
      } catch (error) {
        setCurrentUser(null);
        showError(error);
      }
    },
    [setCurrentUser, showError],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("users/logout");
      setCurrentUser(null);
      await deleteFromIDB("users", "current");
    } catch (error) {
      showError(error);
    }
  }, [setCurrentUser, showError]);

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
