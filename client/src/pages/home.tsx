import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Feed } from "@/components/Feed";
import { Stories } from "@/components/Stories";
import { useAuth } from "@/components/AuthProvider";
import { getWallet } from "@/lib/dahCoins";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "wouter";
import { 
  QuickActions, 
  LiveNowSection, 
  AvenuesSpotlight, 
  GroupsSection, 
  EventsSection, 
  QuestsSection,
  MarketplacePicksSection,
  GamesSection
} from "@/components/HomeSections";
import { Coins, Sparkles } from "lucide-react";

function WelcomeHeader() {
  const { session } = useAuth();
  const [wallet, setWallet] = useState({ available: 0, lockedForCollege: 0 });

  useEffect(() => {
    if (session) {
      setWallet(getWallet(session.username));
      const interval = setInterval(() => {
        setWallet(getWallet(session.username));
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (!session) return null;

  return (
    <div className="flex items-center justify-between gap-3 py-1" data-testid="header-welcome">
      <div className="flex items-center gap-3">
        <Link href={`/profile/${session.username}`}>
          <Avatar className="w-9 h-9 cursor-pointer ring-2 ring-primary/20">
            <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
              {session.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
        <div>
          <p className="text-sm font-medium leading-tight">Welcome back</p>
          <p className="text-xs text-muted-foreground">@{session.username}</p>
        </div>
      </div>
      <Link href="/dashboard">
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" data-testid="link-view-balance">
          <Coins className="w-4 h-4 text-primary" />
          <span className="font-semibold tabular-nums" data-testid="text-coin-total">
            {wallet.available.toLocaleString()}
          </span>
        </Button>
      </Link>
    </div>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 py-3 space-y-4">
        <WelcomeHeader />

        <Stories />

        <QuickActions />

        <LiveNowSection />

        <div>
          <Feed />
        </div>

        <GamesSection />

        <AvenuesSpotlight />

        <GroupsSection />

        <EventsSection />

        <QuestsSection />

        <MarketplacePicksSection />
      </div>
    </PageLayout>
  );
}
