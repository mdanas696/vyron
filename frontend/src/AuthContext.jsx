import { createContext, useContext, useEffect, useState } from "react";
import api from "./axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("vyron_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (e) {
        localStorage.removeItem("vyron_user");
      }
    }
    setLoading(false);
  }, []);

  const persistSession = (data) => {
    localStorage.setItem("vyron_token", data.token);
    localStorage.setItem("vyron_user", JSON.stringify(data));
    setUser(data);
  };

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
