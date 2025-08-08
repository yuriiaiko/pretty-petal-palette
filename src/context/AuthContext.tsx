// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { isTokenValid } from "@/lib/jwt";

interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string, userData?: any) => void;
  logout: () => void;
  user: any | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // Read from localStorage on init
    const token = localStorage.getItem("token");
    return !!token && isTokenValid(token);
  });

  const [user, setUser] = useState<any | null>(() => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  });

  const login = (token: string, userData?: any) => {
    if (isTokenValid(token)) {
      localStorage.setItem("token", token);
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
      }
      setIsAuthenticated(true);
    } else {
      console.error('Invalid token provided');
      throw new Error('Invalid token');
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  // Optional: Listen for localStorage changes in other tabs
  useEffect(() => {
    const syncAuth = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      
      if (token && isTokenValid(token)) {
        setIsAuthenticated(true);
        if (userStr) {
          setUser(JSON.parse(userStr));
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
    };

    window.addEventListener("storage", syncAuth);
    return () => window.removeEventListener("storage", syncAuth);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
