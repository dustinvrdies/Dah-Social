export type ProfileTheme = {
  background: string;
  accent: string;
  accentHex?: string;
  text: string;
  card: string;
  font: string;
};

export const defaultTheme: ProfileTheme = {
  background: "bg-black",
  accent: "text-purple-400",
  accentHex: "263 70% 58%",
  text: "text-white",
  card: "bg-neutral-950",
  font: "font-sans",
};
