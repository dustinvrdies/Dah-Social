import { ProfileTheme } from "@/lib/profileTheme";
import { Button } from "@/components/ui/button";

interface ProfileThemeSwitcherProps {
  setTheme: (theme: ProfileTheme) => void;
}

export function ProfileThemeSwitcher({ setTheme }: ProfileThemeSwitcherProps) {
  const themes: { label: string; theme: ProfileTheme }[] = [
    {
      label: "Sunset",
      theme: {
        background: "bg-gradient-to-br from-pink-50 to-sky-50",
        accent: "text-pink-500",
        accentHex: "350 80% 65%",
        text: "text-gray-800",
        card: "bg-white/80",
        font: "font-sans",
      },
    },
    {
      label: "Ocean",
      theme: {
        background: "bg-gradient-to-br from-sky-100 to-blue-50",
        accent: "text-sky-600",
        accentHex: "200 70% 50%",
        text: "text-gray-800",
        card: "bg-white/80",
        font: "font-sans",
      },
    },
    {
      label: "Twilight",
      theme: {
        background: "bg-gradient-to-br from-slate-900 to-purple-950",
        accent: "text-pink-400",
        accentHex: "350 70% 60%",
        text: "text-white",
        card: "bg-slate-800/80",
        font: "font-sans",
      },
    },
    {
      label: "Peach",
      theme: {
        background: "bg-gradient-to-br from-orange-50 to-rose-50",
        accent: "text-orange-500",
        accentHex: "30 80% 55%",
        text: "text-gray-800",
        card: "bg-white/80",
        font: "font-sans",
      },
    },
  ];

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {themes.map((t) => (
        <Button
          key={t.label}
          variant="secondary"
          size="sm"
          onClick={() => setTheme(t.theme)}
          data-testid={`button-theme-${t.label.toLowerCase()}`}
        >
          {t.label}
        </Button>
      ))}
    </div>
  );
}
