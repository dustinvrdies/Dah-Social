import { useState, useCallback } from "react";
import { PageLayout } from "@/components/PageLayout";
import { Feed } from "@/components/Feed";
import { Stories } from "@/components/Stories";
import { ComposeBox } from "@/components/ComposeBox";
import { RightSidebar } from "@/components/RightSidebar";
import { LiveNowSection } from "@/components/HomeSections";

export default function Home() {
  const [feedKey, setFeedKey] = useState(0);
  const refreshFeed = useCallback(() => setFeedKey(k => k + 1), []);

  return (
    <PageLayout>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex gap-6">
          <div className="flex-1 min-w-0 space-y-4 max-w-2xl">
            <Stories />

            <ComposeBox onPostCreated={refreshFeed} />

            <LiveNowSection />

            <div key={feedKey}>
              <Feed />
            </div>
          </div>

          <RightSidebar />
        </div>
      </div>
    </PageLayout>
  );
}
