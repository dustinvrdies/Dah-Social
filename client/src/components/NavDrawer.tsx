import { Link, useLocation } from "wouter";
import { useAuth } from "./AuthProvider";
import { getWallet } from "@/lib/dahCoins";
import { getUnreadCount } from "@/lib/inbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Home,
  Video,
  ShoppingBag,
  MessageSquare,
  Radio,
  Users,
  Calendar,
  Sparkles,
  Target,
  BarChart3,
  Gamepad2,
  Gift,
  Trophy,
  Mail,
  LogOut,
  LogIn,
  Coins,
  FileText,
  Shield,
  Gavel,
  ScrollText,
  BookOpen,
  Cookie,
} from "lucide-react";
import { useState, useEffect } from "react";

interface NavDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NavDrawer({ open, onOpenChange }: NavDrawerProps) {
  const { session, logout } = useAuth();
  const [location] = useLocation();
  const [coinBalance, setCoinBalance] = useState(0);
  const [unreadInbox, setUnreadInbox] = useState(0);

  useEffect(() => {
    if (session) {
      setCoinBalance(getWallet(session.username).available);
      setUnreadInbox(getUnreadCount(session.username));
      const interval = setInterval(() => {
        setCoinBalance(getWallet(session.username).available);
        setUnreadInbox(getUnreadCount(session.username));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const mainNav = [
    { href: "/", label: "Home", icon: Home },
    { href: "/video", label: "Videos", icon: Video },
    { href: "/live", label: "Live", icon: Radio },
    { href: "/discover", label: "Discover", icon: Sparkles },
  ];

  const socialNav = [
    { href: "/avenues", label: "Avenues", icon: MessageSquare },
    { href: "/groups", label: "Groups", icon: Users },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/inbox", label: "Inbox", icon: Mail, badge: unreadInbox },
  ];

  const earnNav = [
    { href: "/mall", label: "DAH Mall", icon: ShoppingBag },
    { href: "/games", label: "Games", icon: Gamepad2 },
    { href: "/quests", label: "Quests", icon: Target },
    { href: "/rewards", label: "Rewards", icon: Gift },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/dashboard", label: "Dashboard", icon: BarChart3 },
  ];

  const legalNav = [
    { href: "/terms", label: "Terms of Service", icon: FileText },
    { href: "/privacy", label: "Privacy Policy", icon: Shield },
    { href: "/community-guidelines", label: "Community Guidelines", icon: BookOpen },
    { href: "/acceptable-use", label: "Acceptable Use", icon: Gavel },
    { href: "/dmca", label: "DMCA / Copyright", icon: ScrollText },
    { href: "/cookie-policy", label: "Cookie Policy", icon: Cookie },
  ];

  const renderSection = (title: string, items: typeof mainNav) => (
    <div className="space-y-1">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-2">{title}</p>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.href;
        const badge = (item as any).badge;
        return (
          <Link key={item.href} href={item.href} onClick={() => onOpenChange(false)}>
            <div
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/80 hover-elevate"
              }`}
              data-testid={`drawer-link-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium flex-1">{item.label}</span>
              {badge > 0 && (
                <Badge variant="destructive" className="h-5 min-w-5 px-1.5 text-[10px]">
                  {badge > 9 ? "9+" : badge}
                </Badge>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-72 p-0 flex flex-col">
        <SheetHeader className="p-4 pb-2">
          <SheetTitle className="text-left">
            <span className="text-gradient-dah text-2xl font-bold tracking-tight">DAH</span>
          </SheetTitle>
        </SheetHeader>

        {session && (
          <div className="px-4 pb-3">
            <Link href={`/profile/${session.username}`} onClick={() => onOpenChange(false)}>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 cursor-pointer hover-elevate" data-testid="drawer-profile">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {session.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">@{session.username}</p>
                  <div className="flex items-center gap-1 text-xs text-primary">
                    <Coins className="w-3 h-3" />
                    <span className="font-bold tabular-nums">{coinBalance.toLocaleString()}</span>
                    <span className="text-muted-foreground">DAH</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-2 space-y-5 pb-4">
          {renderSection("Browse", mainNav)}
          {renderSection("Community", socialNav)}
          {renderSection("Earn & Play", earnNav)}

          <Separator />

          {renderSection("Legal", legalNav)}
        </div>

        <div className="border-t p-3">
          {session ? (
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={() => {
                logout();
                onOpenChange(false);
              }}
              data-testid="drawer-logout"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </Button>
          ) : (
            <Link href="/login" onClick={() => onOpenChange(false)}>
              <Button className="w-full bg-dah-gradient-strong gap-2" data-testid="drawer-login">
                <LogIn className="w-5 h-5" />
                Join DAH
              </Button>
            </Link>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
