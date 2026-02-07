import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Session, getSession, setSession } from "@/lib/auth";

type AuthCtx = {
  session: Session | null;
  login: (username: string, age: number) => void;
  logout: () => void;
  refreshSession: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthCtx>({
  session: null,
  login: () => {},
  logout: () => {},
  refreshSession: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSess] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          const s: Session = { username: data.user.username, age: 18 };
          setSession(s);
          setSess(s);
          return;
        }
      }
    } catch {}
    const local = getSession();
    if (local) {
      setSess(local);
    } else {
      setSess(null);
      setSession(null);
    }
  }, []);

  useEffect(() => {
    refreshSession().finally(() => setIsLoading(false));
  }, [refreshSession]);

  const login = (username: string, age: number) => {
    const s: Session = { username: username.trim().toLowerCase(), age };
    setSession(s);
    setSess(s);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch {}
    setSession(null);
    setSess(null);
  };

  return (
    <AuthContext.Provider value={{ session, login, logout, refreshSession, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
