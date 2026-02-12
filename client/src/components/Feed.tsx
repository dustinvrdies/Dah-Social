import { useState, useEffect, useMemo, useCallback } from "react";
import { useAuth } from "./AuthProvider";
import { getAllPosts } from "@/lib/feedData";
import { getHidden } from "@/lib/moderation";
import { getFollowing } from "@/lib/follows";
import { getReactions } from "@/lib/reactions";
import { Post } from "@/lib/postTypes";
import { getNextFeedAd, NativeAd } from "@/lib/ads";
import { PostRenderer } from "./PostRenderer";
import { NativeAdCard } from "./NativeAdCard";
import { CreatePostModal } from "./CreatePostModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Sparkles, Users, TrendingUp, ArrowUpDown, Clock, Flame, ImageIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";

const AD_FREQUENCY = 5;

type SortMode = "newest" | "popular" | "random";
type FeedItem = Post | { isAd: true; ad: NativeAd };

function getPostEngagement(post: Post): number {
  const reactions = getReactions(post.id);
  const hasMedia = ("media" in post && post.media) || ("src" in post && post.src) ? 3 : 0;
  const isVideo = post.type === "video" ? 2 : 0;
  const isListing = post.type === "listing" ? 1 : 0;
  return reactions.length + hasMedia + isVideo + isListing;
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const result = [...arr];
  let s = seed;
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function diversifyFeed(posts: Post[]): Post[] {
  if (posts.length <= 3) return posts;
  
  const textPosts = posts.filter(p => p.type === "text" && !("media" in p && p.media));
  const mediaPosts = posts.filter(p => p.type === "text" && "media" in p && p.media);
  const videoPosts = posts.filter(p => p.type === "video");
  const listingPosts = posts.filter(p => p.type === "listing");
  
  const result: Post[] = [];
  const queues = [mediaPosts, textPosts, videoPosts, listingPosts].filter(q => q.length > 0);
  const indices = queues.map(() => 0);
  
  let queueIdx = 0;
  let totalAdded = 0;
  const maxPosts = posts.length;
  
  while (totalAdded < maxPosts) {
    let found = false;
    for (let attempt = 0; attempt < queues.length; attempt++) {
      const qi = (queueIdx + attempt) % queues.length;
      if (indices[qi] < queues[qi].length) {
        result.push(queues[qi][indices[qi]]);
        indices[qi]++;
        totalAdded++;
        found = true;
        queueIdx = (qi + 1) % queues.length;
        break;
      }
    }
    if (!found) break;
  }
  
  return result;
}

export function Feed() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("foryou");
  const [sortMode, setSortMode] = useState<SortMode>("newest");
  const [mediaOnly, setMediaOnly] = useState(false);

  useEffect(() => {
    setPosts(getAllPosts());
    if (session) {
      setHidden(getHidden(session.username));
    }
  }, [session]);

  const refreshPosts = () => {
    setPosts(getAllPosts());
  };

  const following = useMemo(() => {
    if (!session) return [] as string[];
    return getFollowing(session.username);
  }, [session]);

  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts.filter((p) => !hidden.includes(p.id));

    if (activeTab === "following") {
      if (following.length === 0) return [];
      filtered = filtered.filter((p) => {
        const user = "user" in p ? p.user : "";
        return following.includes(user.toLowerCase());
      });
    }

    if (mediaOnly) {
      filtered = filtered.filter((p) => {
        if (p.type === "video") return true;
        if ("media" in p && p.media) return true;
        return false;
      });
    }

    if (activeTab === "trending") {
      return [...filtered].sort((a, b) => getPostEngagement(b) - getPostEngagement(a));
    }

    switch (sortMode) {
      case "popular":
        return [...filtered].sort((a, b) => getPostEngagement(b) - getPostEngagement(a));
      case "random": {
        const daySeed = Math.floor(Date.now() / 86400000);
        return seededShuffle(filtered, daySeed);
      }
      case "newest":
      default: {
        const sorted = [...filtered].sort((a, b) => {
          const aTime = (a as any).timestamp || 0;
          const bTime = (b as any).timestamp || 0;
          return bTime - aTime;
        });
        return diversifyFeed(sorted);
      }
    }
  }, [posts, hidden, activeTab, sortMode, mediaOnly, following]);

  const feedWithAds = useMemo((): FeedItem[] => {
    const result: FeedItem[] = [];
    let adIndex = 0;

    filteredAndSortedPosts.forEach((post, i) => {
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
  }, [filteredAndSortedPosts]);

  const sortLabel = sortMode === "newest" ? "Newest" : sortMode === "popular" ? "Popular" : "Shuffled";

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

        <div className="flex items-center gap-1.5">
          {activeTab === "foryou" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground" data-testid="button-sort-posts">
                  <ArrowUpDown className="w-3.5 h-3.5" />
                  {sortLabel}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Sort by</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortMode("newest")} data-testid="sort-newest">
                  <Clock className="w-4 h-4 mr-2" />
                  Newest first
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMode("popular")} data-testid="sort-popular">
                  <Flame className="w-4 h-4 mr-2" />
                  Most popular
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortMode("random")} data-testid="sort-random">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Shuffle
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setMediaOnly(!mediaOnly)}
                  data-testid="filter-media-only"
                >
                  <ImageIcon className="w-4 h-4 mr-2" />
                  {mediaOnly ? "Show all posts" : "Media only"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          <CreatePostModal onPostCreated={refreshPosts} />
        </div>
      </div>

      {activeTab === "following" && following.length === 0 ? (
        <div className="text-center py-12" data-testid="empty-following-feed">
          <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-muted-foreground font-medium">Follow people to see their posts here</p>
          <p className="text-sm text-muted-foreground/70 mt-1">Discover creators in the feed or explore page</p>
        </div>
      ) : feedWithAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {feedWithAds.map((item, idx) => {
            if ("isAd" in item && item.isAd) {
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
