import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "./AuthProvider";
import { NotificationBell } from "./NotificationBell";
import { SearchBar } from "./SearchBar";
import { getUnreadCount } from "@/lib/inbox";
import { getWallet } from "@/lib/dahCoins";
import { Home, Video, ShoppingBag, User, LogIn, LogOut, Mail, Menu, Radio, Users, Calendar, Sparkles, Target, BarChart3, MessageSquare, Coins, Gamepad2, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MainNav() {
  const { session, logout } = useAuth();
  const [location] = useLocation();
  const [unreadInbox, setUnreadInbox] = useState(0);
  const [coinBalance, setCoinBalance] = useState(0);

  useEffect(() => {
    if (session) {
      setUnreadInbox(getUnreadCount(session.username));
      setCoinBalance(getWallet(session.username).available);
      const interval = setInterval(() => {
        setUnreadInbox(getUnreadCount(session.username));
        setCoinBalance(getWallet(session.username).available);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const navItems = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/video", label: "Video", icon: Video },
    { href: "/avenues", label: "Avenues", icon: MessageSquare },
    { href: "/live", label: "Live", icon: Radio },
    { href: "/mall", label: "Mall", icon: ShoppingBag },
    { href: "/discover", label: "Discover", icon: Sparkles },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/quests", label: "Quests", icon: Target },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/rewards", label: "Rewards", icon: Gift },
    { href: "/leaderboard", label: "Ranks", icon: Trophy },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/50 bg-card/95 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-14">
          <div className="flex items-center gap-4">
            <Link href="/" data-testid="link-home-logo">
              <span className="font-bold text-2xl text-gradient-dah tracking-tight">DAH</span>
            </Link>

            {session && (
              <Link href="/dashboard">
                <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 cursor-pointer hover-elevate" data-testid="display-coin-balance-nav">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="text-sm font-bold text-primary tabular-nums">{coinBalance.toLocaleString()}</span>
                  <span className="text-xs text-muted-foreground">DAH</span>
                </div>
              </Link>
            )}

            <div className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={isActive ? "bg-primary/15 text-primary" : ""}
                      data-testid={`link-nav-${item.label.toLowerCase()}`}
                    >
                      <Icon className="w-4 h-4 mr-1.5" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden sm:flex flex-1 max-w-md mx-4">
            <SearchBar />
          </div>

          <div className="flex items-center gap-2">
            {session ? (
              <>
                <Link href="/inbox">
                  <Button variant="ghost" size="icon" className="hidden sm:flex relative" data-testid="link-inbox">
                    <Mail className="w-5 h-5" />
                    {unreadInbox > 0 && (
                      <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-xs flex items-center justify-center">
                        {unreadInbox > 9 ? "9+" : unreadInbox}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <NotificationBell />
                <Link href={`/profile/${session.username}`}>
                  <div className="ring-gradient-dah p-[2px] rounded-full cursor-pointer">
                    <Avatar className="w-8 h-8" data-testid="link-profile">
                      <AvatarImage src={undefined} />
                      <AvatarFallback className="bg-card text-sm font-medium">
                        {session.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  className="hidden sm:flex"
                  data-testid="button-logout"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default" size="sm" className="bg-dah-gradient-strong" data-testid="link-login">
                  <LogIn className="w-4 h-4 mr-1.5" />
                  Join DAH
                </Button>
              </Link>
            )}
            
            <Button variant="ghost" size="icon" className="lg:hidden" data-testid="button-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="lg:hidden flex items-center gap-1 py-1 border-t border-border/30 overflow-x-auto px-2 scrollbar-hide">
        {session && (
          <Link href="/dashboard">
            <div className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 mr-1" data-testid="display-coin-balance-mobile">
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold text-primary tabular-nums">{coinBalance.toLocaleString()}</span>
            </div>
          </Link>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex-shrink-0 ${isActive ? "text-primary" : "text-muted-foreground"}`}
                data-testid={`link-nav-mobile-${item.label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
              </Button>
            </Link>
          );
        })}
        {session && (
          <>
            <Link href="/inbox">
              <Button variant="ghost" size="sm" className={`flex-shrink-0 ${location === "/inbox" ? "text-primary" : "text-muted-foreground"}`} data-testid="link-inbox-mobile">
                <div className="relative">
                  <Mail className="w-5 h-5" />
                  {unreadInbox > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </Button>
            </Link>
            <Link href={`/profile/${session.username}`}>
              <Button variant="ghost" size="sm" className="flex-shrink-0 text-muted-foreground" data-testid="link-profile-mobile">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
