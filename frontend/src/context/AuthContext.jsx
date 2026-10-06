import { createContext, useContext, useEffect, useState } from "react";
import {
  registerUser,
  loginUser,
  logoutUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD USER FROM STORAGE
  // =========================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  // =========================
  // REGISTER
  // =========================
  const register = async (userData) => {
    const data = await registerUser(userData);

    return data;
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (loginData) => {
    const data = await loginUser(loginData);

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));

    setUser(data.user);

    return data;
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        register,
        login,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === "admin",
        isClient: user?.role === "client",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// =========================
// CUSTOM HOOK
// =========================
export const useAuth = () => {
  return useContext(AuthContext);
};