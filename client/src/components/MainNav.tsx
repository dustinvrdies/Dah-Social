import { Link, useLocation } from "wouter";
import { useAuth } from "./AuthProvider";
import { NotificationBell } from "./NotificationBell";
import { Home, Video, ShoppingBag, User, LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MainNav() {
  const { session, logout } = useAuth();
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Feed", icon: Home },
    { href: "/video", label: "Video", icon: Video },
    { href: "/mall", label: "Mall", icon: ShoppingBag },
  ];

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-2 px-4 py-3 border-b border-border bg-card/95 backdrop-blur shadow-sm">
      <Link href="/" data-testid="link-home-logo">
        <span className="font-bold text-xl text-gradient-sunset">DAH Social</span>
      </Link>

      <div className="flex items-center gap-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                size="sm"
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                <Icon className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">{item.label}</span>
              </Button>
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        {session ? (
          <>
            <NotificationBell />
            <Link href={`/profile/${session.username}`}>
              <Button variant="ghost" size="sm" data-testid="link-profile">
                <User className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">@{session.username}</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              data-testid="button-logout"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </>
        ) : (
          <Link href="/login">
            <Button variant="default" size="sm" data-testid="link-login">
              <LogIn className="w-4 h-4 mr-1" />
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
}
