import { ReactNode } from "react";
import { ProfileTheme } from "@/lib/profileTheme";

interface ProfileThemeProviderProps {
  theme: ProfileTheme;
  children: ReactNode;
}

export function ProfileThemeProvider({ theme, children }: ProfileThemeProviderProps) {
  const style = {
    "--dah-accent": theme.accentHex || "#7c3aed",
  } as React.CSSProperties;

  return (
    <div style={style} className={`min-h-screen ${theme.background} ${theme.text} ${theme.font}`}>
      {children}
    </div>
  );
}
