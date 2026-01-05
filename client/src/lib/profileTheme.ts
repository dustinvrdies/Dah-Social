export type ProfileTheme = {
  background: string;
  accent: string;
  accentHex?: string;
  text: string;
  card: string;
  font: string;
};

export const defaultTheme: ProfileTheme = {
  background: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950",
  accent: "text-pink-400",
  accentHex: "330 85% 60%",
  text: "text-white",
  card: "bg-slate-900/80",
  font: "font-sans",
};
