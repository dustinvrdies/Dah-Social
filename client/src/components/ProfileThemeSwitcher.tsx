import { Button } from "@/components/ui/button";
import { ProfileTheme } from "@/lib/profileTheme";

interface ProfileThemeSwitcherProps {
  setTheme: (theme: ProfileTheme) => void;
}

export function ProfileThemeSwitcher({ setTheme }: ProfileThemeSwitcherProps) {
  const themes: { label: string; theme: ProfileTheme }[] = [
    {
      label: "Midnight",
      theme: {
        background: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950",
        accent: "text-pink-400",
        accentHex: "330 85% 60%",
        text: "text-white",
        card: "bg-slate-900/80",
        font: "font-sans",
      },
    },
    {
      label: "Neon",
      theme: {
        background: "bg-gradient-to-br from-purple-950 via-black to-pink-950",
        accent: "text-cyan-400",
        accentHex: "180 80% 55%",
        text: "text-white",
        card: "bg-purple-950/80",
        font: "font-sans",
      },
    },
    {
      label: "Ocean",
      theme: {
        background: "bg-gradient-to-br from-slate-900 via-blue-950 to-cyan-950",
        accent: "text-sky-400",
        accentHex: "200 80% 55%",
        text: "text-white",
        card: "bg-blue-950/80",
        font: "font-sans",
      },
    },
    {
      label: "Sunset",
      theme: {
        background: "bg-gradient-to-br from-rose-950 via-orange-950 to-amber-950",
        accent: "text-orange-400",
        accentHex: "30 90% 55%",
        text: "text-white",
        card: "bg-rose-950/80",
        font: "font-sans",
      },
    },
    {
      label: "Aurora",
      theme: {
        background: "bg-gradient-to-br from-emerald-950 via-teal-950 to-cyan-950",
        accent: "text-emerald-400",
        accentHex: "160 80% 50%",
        text: "text-white",
        card: "bg-emerald-950/80",
        font: "font-sans",
      },
    },
    {
      label: "Minimal",
      theme: {
        background: "bg-gradient-to-br from-neutral-950 to-neutral-900",
        accent: "text-white",
        accentHex: "0 0% 100%",
        text: "text-neutral-200",
        card: "bg-neutral-900/90",
        font: "font-sans",
      },
    },
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">Profile Theme</p>
      <div className="flex flex-wrap gap-2">
        {themes.map((t) => (
          <Button
            key={t.label}
            variant="outline"
            size="sm"
            onClick={() => setTheme(t.theme)}
            className={`${t.theme.background} ${t.theme.text} border-white/20`}
            data-testid={`button-theme-${t.label.toLowerCase()}`}
          >
            {t.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
