import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthProvider";
import { getAllPosts } from "@/lib/feedData";
import { getHidden } from "@/lib/moderation";
import { Post } from "@/lib/postTypes";
import { getNextFeedAd, NativeAd } from "@/lib/ads";
import { PostRenderer } from "./PostRenderer";
import { NativeAdCard } from "./NativeAdCard";
import { CreatePostModal } from "./CreatePostModal";
import FeedFilter from "./FeedFilter";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, TrendingUp } from "lucide-react";

const AD_FREQUENCY = 5;

type FeedItem = Post | { isAd: true; ad: NativeAd };

export function Feed() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("foryou");
  const [feedFilter, setFeedFilter] = useState("all");

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
    let filtered = posts.filter((p) => !hidden.includes(p.id));
    if (feedFilter !== "all") {
      filtered = filtered.filter((p) => p.type === feedFilter);
    }
    return filtered;
  }, [posts, hidden, feedFilter]);

  const feedWithAds = useMemo((): FeedItem[] => {
    if (feedFilter !== "all") return visiblePosts;
    
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
  }, [visiblePosts, feedFilter]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="grid w-full sm:w-auto grid-cols-3 bg-muted/50">
              <TabsTrigger value="foryou" className="gap-1.5" data-testid="tab-foryou">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">For You</span>
              </TabsTrigger>
              <TabsTrigger value="following" className="gap-1.5" data-testid="tab-following">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Following</span>
              </TabsTrigger>
              <TabsTrigger value="trending" className="gap-1.5" data-testid="tab-trending">
                <TrendingUp className="w-4 h-4" />
                <span className="hidden sm:inline">Trending</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          
          <CreatePostModal onPostCreated={refreshPosts} />
        </div>

        <FeedFilter onFilterChange={setFeedFilter} activeFilter={feedFilter} />
      </div>

      {feedWithAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
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
