import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../api.js";
import { useError } from "./ErrorProvider.jsx";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const { showError } = useError();

  useEffect(() => {
    getCurrentUser();
  }, []);

  // api.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error) => {
  //     if (error.response?.status === 401) {
  //       logout().then();
  //     }
  //   },
  // );

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("http://localhost:5000/api/users/me");
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
      showError(error);
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
    <AuthContext.Provider value={{ currentUser, signup, login, logout }}>
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
