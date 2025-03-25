import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../../api.js";

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("http://localhost:5000/api/users/me");
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
    }
  }, []);

  const signup = useCallback(async (username, email, password) => {
    try {
      const response = await api.post(
        "http://localhost:5000/api/users/signup",
        {
          username,
          email,
          password,
        },
      );
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      setCurrentUser(response.data);
    } catch (error) {
      setCurrentUser(null);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post("http://localhost:5000/api/users/logout");
      setCurrentUser(null);
    } catch (error) {
      setCurrentUser(null);
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
