import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Session, getSession, setSession } from "@/lib/auth";

type AuthCtx = {
  session: Session | null;
  login: (username: string, age: number) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthCtx>({
  session: null,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSess] = useState<Session | null>(null);

  useEffect(() => {
    setSess(getSession());
  }, []);

  const login = (username: string, age: number) => {
    const s: Session = { username: username.trim().toLowerCase(), age };
    setSession(s);
    setSess(s);
  };

  const logout = () => {
    setSession(null);
    setSess(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
