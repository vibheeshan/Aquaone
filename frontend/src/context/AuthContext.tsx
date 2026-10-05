"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  role: string; // "citizen" | "expert" | "health_officer" | "admin"
  points: number;
  level: string;
  badge_count: number;
  avatar?: string | null;
  current_streak?: number;
  longest_streak?: number;
  is_verified?: boolean;
  created_at?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  login: (userData: UserProfile) => void;
  logout: () => void;
  loading: boolean;
  getDashboardRoute: (role: string) => string;
}

export function getDashboardRoute(role: string): string {
  switch (role) {
    case "expert":
    case "researcher":
    case "environmental_expert":
    case "field_officer":
    case "analyst":
      return "/dashboard/command";
    case "health_officer":
    case "admin":
    case "government":
      return "/dashboard/one-health";
    default:
      return "/dashboard/citizen";
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
  getDashboardRoute,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("aquaone_user");
      if (stored) {
        setUser(JSON.parse(stored));
      }
      // No default user — require explicit login
    } catch (e) {
      console.error("Error reading auth state:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (userData: UserProfile) => {
    setUser(userData);
    localStorage.setItem("aquaone_user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("aquaone_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, getDashboardRoute }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
