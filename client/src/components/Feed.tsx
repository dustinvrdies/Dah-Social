import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthProvider";
import { getAllPosts } from "@/lib/feedData";
import { getHidden } from "@/lib/moderation";
import { Post } from "@/lib/postTypes";
import { getNextFeedAd, NativeAd } from "@/lib/ads";
import { PostRenderer } from "./PostRenderer";
import { NativeAdCard } from "./NativeAdCard";
import { CreatePostModal } from "./CreatePostModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, TrendingUp } from "lucide-react";

const AD_FREQUENCY = 5;

type FeedItem = Post | { isAd: true; ad: NativeAd };

export function Feed() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("foryou");

  useEffect(() => {
    setPosts(getAllPosts());
    if (session) {
      setHidden(getHidden(session.username));
    }
  }, [session]);

  const refreshPosts = () => {
    setPosts(getAllPosts());
  };

  const visiblePosts = useMemo(() => {
    return posts.filter((p) => !hidden.includes(p.id));
  }, [posts, hidden]);

  const feedWithAds = useMemo((): FeedItem[] => {
    const result: FeedItem[] = [];
    let adIndex = 0;

    visiblePosts.forEach((post, i) => {
      result.push(post);
      if ((i + 1) % AD_FREQUENCY === 0) {
        const ad = getNextFeedAd(adIndex);
        if (ad) {
          result.push({ isAd: true, ad });
          adIndex++;
        }
      }
    });

    return result;
  }, [visiblePosts]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 min-w-0">
          <TabsList className="bg-muted/40 w-full sm:w-auto">
            <TabsTrigger value="foryou" className="gap-1.5 flex-1 sm:flex-initial" data-testid="tab-foryou">
              <Sparkles className="w-3.5 h-3.5" />
              For You
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-1.5 flex-1 sm:flex-initial" data-testid="tab-following">
              <Users className="w-3.5 h-3.5" />
              Following
            </TabsTrigger>
            <TabsTrigger value="trending" className="gap-1.5 flex-1 sm:flex-initial" data-testid="tab-trending">
              <TrendingUp className="w-3.5 h-3.5" />
              Trending
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        <CreatePostModal onPostCreated={refreshPosts} />
      </div>

      {feedWithAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedWithAds.map((item, idx) => {
            if ('isAd' in item && item.isAd) {
              return <NativeAdCard key={`ad-${item.ad.id}-${idx}`} ad={item.ad} variant="feed" />;
            }
            const post = item as Post;
            return <PostRenderer key={`${post.id}-${idx}`} post={post} />;
          })}
        </div>
      )}
    </div>
  );
}
