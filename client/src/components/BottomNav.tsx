import { Link, useLocation } from "wouter";
import { useAuth } from "./AuthProvider";
import { getWallet } from "@/lib/dahCoins";
import { Home, Video, ShoppingBag, User, Coins, Gift } from "lucide-react";
import { useState, useEffect } from "react";

export function BottomNav() {
  const { session } = useAuth();
  const [location] = useLocation();
  const [coinBalance, setCoinBalance] = useState(0);

  useEffect(() => {
    if (session) {
      setCoinBalance(getWallet(session.username).available);
      const interval = setInterval(() => {
        setCoinBalance(getWallet(session.username).available);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const tabs = [
    { href: "/", label: "Home", icon: Home },
    { href: "/video", label: "Video", icon: Video },
    { href: "/mall", label: "Mall", icon: ShoppingBag },
    { href: "/rewards", label: "Rewards", icon: Gift },
    { href: session ? `/profile/${session.username}` : "/login", label: "Profile", icon: User },
  ];

  const isTabActive = (tabHref: string, tabLabel: string) => {
    if (tabLabel === "Home") return location === "/";
    if (tabLabel === "Profile") return location.startsWith("/profile") || location === "/login";
    if (tabLabel === "Mall") return location.startsWith("/mall");
    if (tabLabel === "Video") return location === "/video";
    return location === tabHref;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-xl border-t border-border/50 safe-area-bottom">
      {session && (
        <Link href="/dashboard">
          <div className="flex items-center justify-center gap-1.5 py-1 border-b border-border/30 cursor-pointer hover-elevate" data-testid="display-coin-balance-bottom">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-bold text-primary tabular-nums">{coinBalance.toLocaleString()} DAH Coins</span>
          </div>
        </Link>
      )}
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = isTabActive(tab.href, tab.label);

          return (
            <Link key={tab.label} href={tab.href}>
              <button
                className={`flex flex-col items-center justify-center gap-1 w-16 h-14 rounded-xl transition-all ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
                data-testid={`tab-${tab.label.toLowerCase()}`}
              >
                <div className="relative">
                  <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5px]" : ""}`} />
                </div>
                <span className={`text-[10px] font-medium ${isActive ? "text-primary" : ""}`}>
                  {tab.label}
                </span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
