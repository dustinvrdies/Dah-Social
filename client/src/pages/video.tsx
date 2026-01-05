import { useState, useMemo } from "react";
import { MainNav } from "@/components/MainNav";
import { PostRenderer } from "@/components/PostRenderer";
import { videoOnlyFeed } from "@/lib/feedData";
import { getAds } from "@/lib/ads";
import { Post } from "@/lib/postTypes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Users, Sparkles, Clock } from "lucide-react";

const VIDEO_AD_FREQUENCY = 4;

export default function VideoPage() {
  const [activeTab, setActiveTab] = useState("foryou");

  const feedWithAds = useMemo(() => {
    const videoAds = getAds().filter(a => a.videoSrc);
    const result: Post[] = [];
    let adIndex = 0;

    videoOnlyFeed.forEach((post, i) => {
      result.push(post);
      if ((i + 1) % VIDEO_AD_FREQUENCY === 0 && videoAds.length > 0) {
        result.push(videoAds[adIndex % videoAds.length] as unknown as Post);
        adIndex++;
      }
    });

    return result;
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-lg mx-auto">
        <div className="sticky top-[104px] md:top-14 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 py-2">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-4 bg-muted/50">
              <TabsTrigger value="foryou" className="gap-1" data-testid="tab-video-foryou">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">For You</span>
              </TabsTrigger>
              <TabsTrigger value="following" className="gap-1" data-testid="tab-video-following">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Following</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-1" data-testid="tab-video-trending">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="gap-1" data-testid="tab-video-recent">
                <Clock className="w-4 h-4" />
                <span className="hidden sm:inline">Recent</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        
        <div className="space-y-2 pb-20">
          {feedWithAds.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No videos yet. Be the first to share!
            </div>
          ) : (
            feedWithAds.map((p, idx) => <PostRenderer key={`${p.id}-${idx}`} post={p} />)
          )}
        </div>
      </div>
    </main>
  );
}
