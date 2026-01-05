export type ProfileTheme = {
  background: string;
  accent: string;
  accentHex?: string;
  text: string;
  card: string;
  font: string;
};

export const defaultTheme: ProfileTheme = {
  background: "bg-gradient-to-br from-pink-50 to-sky-50",
  accent: "text-pink-500",
  accentHex: "350 80% 65%",
  text: "text-gray-800",
  card: "bg-white/80",
  font: "font-sans",
};
