import { ProfileTheme } from "@/lib/profileTheme";
import { Button } from "@/components/ui/button";

interface ProfileThemeSwitcherProps {
  setTheme: (theme: ProfileTheme) => void;
}

export function ProfileThemeSwitcher({ setTheme }: ProfileThemeSwitcherProps) {
  const themes: { label: string; theme: ProfileTheme }[] = [
    {
      label: "Dark",
      theme: {
        background: "bg-black",
        accent: "text-purple-400",
        accentHex: "#7c3aed",
        text: "text-white",
        card: "bg-neutral-950",
        font: "font-sans",
      },
    },
    {
      label: "Light",
      theme: {
        background: "bg-white",
        accent: "text-blue-600",
        accentHex: "#2563eb",
        text: "text-black",
        card: "bg-neutral-100",
        font: "font-serif",
      },
    },
    {
      label: "Emerald",
      theme: {
        background: "bg-black",
        accent: "text-emerald-400",
        accentHex: "#34d399",
        text: "text-white",
        card: "bg-neutral-950",
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
