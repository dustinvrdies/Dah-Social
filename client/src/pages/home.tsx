import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { Feed } from "@/components/Feed";
import { Stories } from "@/components/Stories";
import { 
  QuickActions, 
  LiveNowSection, 
  AvenuesSpotlight, 
  GroupsSection, 
  EventsSection, 
  QuestsSection,
  MarketplacePicksSection 
} from "@/components/HomeSections";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <AppHeader />
      
      <main className="max-w-2xl mx-auto px-4 py-4">
        <div className="mb-4">
          <Stories />
        </div>

        <QuickActions />

        <LiveNowSection />

        <QuestsSection />

        <div className="mb-6">
          <h2 className="font-semibold text-lg mb-3">Your Feed</h2>
          <Feed />
        </div>

        <AvenuesSpotlight />

        <GroupsSection />

        <EventsSection />

        <MarketplacePicksSection />
      </main>

      <BottomNav />
    </div>
  );
}
