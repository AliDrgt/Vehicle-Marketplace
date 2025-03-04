"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);

  // Check token on first load
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
    console.log("AuthProvider Initial Token:", storedToken); // 🔍 Debugging
  }, []);

  const login = (token: string) => {
    console.log("AuthProvider Setting Token:", token); // 🔍 Debugging
    localStorage.setItem("token", token);
    setToken(token);
  };

  const logout = () => {
    console.log("AuthProvider Logging Out"); // 🔍 Debugging
    localStorage.removeItem("token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
