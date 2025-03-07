"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

// Define the type for the decoded JWT payload
interface JwtPayload {
  id: string;
  exp: number; // Token expiration time
}

interface AuthContextType {
  token: string | null;
  user: { id: string } | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<{ id: string } | null>(null);

  // Extract user ID from the token when loading
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      try {
        const decoded: JwtPayload = jwtDecode<JwtPayload>(storedToken);
        setUser({ id: decoded.id });
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    }
  }, []);

  const login = (newToken: string) => {
    console.log("AuthProvider Setting Token:", newToken);
    localStorage.setItem("token", newToken);
    setToken(newToken);
    try {
      const decoded: JwtPayload = jwtDecode<JwtPayload>(newToken);
      setUser({ id: decoded.id });
    } catch (error) {
      console.error("Error decoding token during login:", error);
    }
  };

  const logout = () => {
    console.log("AuthProvider Logging Out");
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
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
