"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { getStoredToken, getStoredUser, storeAuth, clearAuth, type AuthUser } from "./auth-client";

interface AuthContextType {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  signIn: (token: string, user: AuthUser) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  status: "loading",
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<AuthContextType["status"]>("loading");

  useEffect(() => {
    const token = getStoredToken();
    const storedUser = getStoredUser();
    if (token && storedUser) {
      setUser(storedUser);
      setStatus("authenticated");
    } else {
      setStatus("unauthenticated");
    }
  }, []);

  const signIn = (token: string, user: AuthUser) => {
    storeAuth(token, user);
    setUser(user);
    setStatus("authenticated");
  };

  const signOut = () => {
    clearAuth();
    setUser(null);
    setStatus("unauthenticated");
  };

  return (
    <AuthContext.Provider value={{ user, status, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
