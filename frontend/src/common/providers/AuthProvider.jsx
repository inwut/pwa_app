import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api.js";
import { useError } from "./ErrorProvider.jsx";
import { getFromIDB, saveToIDB, clearIDBStore } from "../../utils/indexedDb.js";
import {
  cacheInitialData,
  clearInitialData,
} from "../../utils/cacheInitialData.js";

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
        await clearIDBStore("currentUser");
        setCurrentUser(null);
      } else {
        const cachedUser = await getFromIDB("currentUser", "current");
        setCurrentUser(cachedUser || null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, setCurrentUser]);

  const signup = useCallback(
    async (username, email, password) => {
      setIsLoading(true);
      try {
        const response = await api.post("users/signup", {
          username,
          email,
          password,
        });
        setCurrentUser(response.data);
        await saveToIDB("currentUser", response.data, "current");
        await cacheInitialData(response.data.id);
      } catch (error) {
        setCurrentUser(null);
        showError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentUser, showError, setIsLoading],
  );

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const response = await api.post("users/login", {
          email,
          password,
        });
        setCurrentUser(response.data);
        await saveToIDB("currentUser", response.data, "current");
        await cacheInitialData(response.data.id);
      } catch (error) {
        setCurrentUser(null);
        showError(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentUser, showError, setIsLoading],
  );

  const logout = useCallback(async () => {
    try {
      await api.post("users/logout");
      setCurrentUser(null);
      await clearIDBStore("currentUser");
      await clearInitialData();
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
