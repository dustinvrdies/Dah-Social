import { Link } from "wouter";
import { useAuth } from "./AuthProvider";
import { NotificationBell } from "./NotificationBell";
import { SearchBar } from "./SearchBar";
import { getWallet } from "@/lib/dahCoins";
import { LogIn, Search, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";

export function AppHeader() {
  const { session } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [coinBalance, setCoinBalance] = useState(0);

  useEffect(() => {
    if (session) {
      const wallet = getWallet(session.username);
      setCoinBalance(wallet.available);
      const interval = setInterval(() => {
        const w = getWallet(session.username);
        setCoinBalance(w.available);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [session]);

  return (
    <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border/50">
      <div className="flex items-center justify-between gap-3 h-14 px-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <Link href="/" data-testid="link-home-logo">
            <span className="font-bold text-2xl text-gradient-dah tracking-tight">DAH</span>
          </Link>

          {session && (
            <Link href="/dashboard">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 cursor-pointer hover-elevate" data-testid="display-coin-balance">
                <Coins className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary tabular-nums">{coinBalance.toLocaleString()}</span>
                <span className="text-xs text-muted-foreground hidden sm:inline">DAH</span>
              </div>
            </Link>
          )}
        </div>

        {showSearch ? (
          <div className="flex-1 max-w-md">
            <SearchBar 
              onSearch={(q) => {
                console.log("Searching for:", q);
                setShowSearch(false);
              }} 
            />
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 max-w-md">
            <SearchBar onSearch={(q) => console.log("Searching for:", q)} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden"
            onClick={() => setShowSearch(!showSearch)}
            data-testid="button-search-toggle"
          >
            <Search className="w-5 h-5" />
          </Button>

          {session ? (
            <>
              <NotificationBell />
              <Link href={`/profile/${session.username}`}>
                <div className="ring-gradient-dah p-[2px] rounded-full cursor-pointer">
                  <Avatar className="w-8 h-8" data-testid="link-profile-avatar">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-card text-sm font-medium">
                      {session.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-dah-gradient-strong" data-testid="link-login">
                <LogIn className="w-4 h-4 mr-1.5" />
                Join
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
