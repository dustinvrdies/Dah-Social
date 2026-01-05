import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "./AuthProvider";
import { NotificationBell } from "./NotificationBell";
import { getUnreadCount } from "@/lib/inbox";
import { Home, Video, ShoppingBag, User, LogIn, LogOut, Search, Mail, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export function MainNav() {
  const { session, logout } = useAuth();
  const [location] = useLocation();
  const [unreadInbox, setUnreadInbox] = useState(0);

  useEffect(() => {
    if (session) {
      setUnreadInbox(getUnreadCount(session.username));
      const interval = setInterval(() => {
        setUnreadInbox(getUnreadCount(session.username));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const navItems = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/video", label: "Video", icon: Video },
    { href: "/mall", label: "Mall", icon: ShoppingBag },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/98 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between gap-4 h-14">
          <div className="flex items-center gap-6">
            <Link href="/" data-testid="link-home-logo">
              <span className="font-bold text-2xl text-gradient-dah tracking-tight">DAH</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
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
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search DAH..."
                className="w-full pl-9 bg-muted/50 border-0 focus-visible:ring-1 focus-visible:ring-primary/50"
                data-testid="input-search"
              />
            </div>
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
            
            <Button variant="ghost" size="icon" className="md:hidden" data-testid="button-menu">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="md:hidden flex items-center justify-around py-1 border-t border-border/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                size="sm"
                className={isActive ? "text-primary" : "text-muted-foreground"}
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
              <Button variant="ghost" size="sm" className={location === "/inbox" ? "text-primary" : "text-muted-foreground"} data-testid="link-inbox-mobile">
                <div className="relative">
                  <Mail className="w-5 h-5" />
                  {unreadInbox > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full" />
                  )}
                </div>
              </Button>
            </Link>
            <Link href={`/profile/${session.username}`}>
              <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="link-profile-mobile">
                <User className="w-5 h-5" />
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
