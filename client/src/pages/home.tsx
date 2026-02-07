import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Feed } from "@/components/Feed";
import { Stories } from "@/components/Stories";
import { useAuth } from "@/components/AuthProvider";
import { getWallet } from "@/lib/dahCoins";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { 
  QuickActions, 
  LiveNowSection, 
  AvenuesSpotlight, 
  GroupsSection, 
  EventsSection, 
  QuestsSection,
  MarketplacePicksSection 
} from "@/components/HomeSections";
import { Coins, TrendingUp, Zap } from "lucide-react";

function CoinsSummaryBanner() {
  const { session } = useAuth();
  const [wallet, setWallet] = useState({ available: 0, lockedForCollege: 0 });

  useEffect(() => {
    if (session) {
      setWallet(getWallet(session.username));
      const interval = setInterval(() => {
        setWallet(getWallet(session.username));
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [session]);

  if (!session) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-primary/5 via-card to-secondary/5 border-primary/10" data-testid="card-coins-summary">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center pulse-glow">
            <Coins className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold tabular-nums" data-testid="text-coin-total">
              {wallet.available.toLocaleString()} <span className="text-primary text-sm">DAH</span>
            </p>
            <p className="text-xs text-muted-foreground">
              {wallet.lockedForCollege > 0 
                ? `+ ${wallet.lockedForCollege.toLocaleString()} locked for college`
                : "Your balance"
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/quests">
            <Button variant="outline" size="sm" data-testid="link-earn-more">
              <Zap className="w-4 h-4 mr-1" />
              Quests
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" data-testid="link-view-earnings">
              <TrendingUp className="w-4 h-4 mr-1" />
              Stats
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

export default function Home() {
  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-5">
        <div>
          <Stories />
        </div>

        <CoinsSummaryBanner />

        <QuickActions />

        <LiveNowSection />

        <QuestsSection />

        <div>
          <h2 className="font-semibold text-lg mb-3">Your Feed</h2>
          <Feed />
        </div>

        <AvenuesSpotlight />

        <GroupsSection />

        <EventsSection />

        <MarketplacePicksSection />
      </div>
    </PageLayout>
  );
}
