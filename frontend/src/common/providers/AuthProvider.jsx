import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../api.js";
import { useNotification } from "./NotificationProvider.jsx";
import { getFromIDB, saveToIDB, clearIDBStore } from "../../utils/indexedDb.js";
import {
  cacheInitialData,
  clearInitialData,
} from "../../utils/cacheInitialData.js";
import { replayDeferredRequests } from "../../utils/deferredRequestManager.js";
import {
  createPushSubscription,
  deletePushSubscription,
} from "../../utils/pushNotificationsManager.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useNotification();

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
  }, []);

  const handleAuthSuccess = useCallback(
    async (user) => {
      setCurrentUser(user);
      await saveToIDB("currentUser", user, "current");
      await cacheInitialData(user.id);
      await replayDeferredRequests();
    },
    [setCurrentUser],
  );

  const signup = useCallback(
    async (username, email, password) => {
      setIsLoading(true);
      try {
        const response = await api.post("users/signup", {
          username,
          email,
          password,
        });
        await handleAuthSuccess(response.data);
      } catch (error) {
        setCurrentUser(null);
        showError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess, showError],
  );

  const login = useCallback(
    async (email, password) => {
      setIsLoading(true);
      try {
        const response = await api.post("users/login", {
          email,
          password,
        });
        await handleAuthSuccess(response.data);
        if (response.data.pushNotificationsEnabled) {
          await createPushSubscription();
        }
      } catch (error) {
        setCurrentUser(null);
        showError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [handleAuthSuccess, showError],
  );

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await deletePushSubscription();
      await api.post("users/logout");
      setCurrentUser(null);
      await clearIDBStore("currentUser");
      await clearInitialData();
    } catch (error) {
      showError(error);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

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
