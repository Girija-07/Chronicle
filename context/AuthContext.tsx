// context/AuthContext.tsx  ← TL stub only
"use client";

import { createContext, useContext, ReactNode } from "react";
import { AuthUser } from "@/lib/types";

interface AuthContextValue {
  user:    AuthUser | null;
  login:   (user: AuthUser) => void;
  logout:  () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user:    null,
  login:   () => {},
  logout:  () => {},
  loading: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // D3 replaces this entire implementation — this stub just prevents import errors
  return (
    <AuthContext.Provider value={{ user: null, login: () => {}, logout: () => {}, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}