import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vyron_user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    persistSession(data);
    return data;
  };

  const register = async (name, email, password, accountType) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      accountType,
    });
    persistSession(data);
    return data;
  };

  const persistSession = (data) => {
    localStorage.setItem("vyron_token", data.token);
    const { token, ...userData } = data;
    localStorage.setItem("vyron_user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("vyron_token");
    localStorage.removeItem("vyron_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
