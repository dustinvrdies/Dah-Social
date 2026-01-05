import { useState, useEffect, useMemo } from "react";
import { useAuth } from "./AuthProvider";
import { getPosts } from "@/lib/posts";
import { initialFeed } from "@/lib/feedData";
import { getHidden } from "@/lib/moderation";
import { Post, AdPost } from "@/lib/postTypes";
import { getAds } from "@/lib/ads";
import { PostRenderer } from "./PostRenderer";
import { CreatePostModal } from "./CreatePostModal";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Users, TrendingUp } from "lucide-react";

const AD_FREQUENCY = 5;

export function Feed() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("foryou");

  useEffect(() => {
    setPosts(getPosts(initialFeed));
    if (session) {
      setHidden(getHidden(session.username));
    }
  }, [session]);

  const visiblePosts = posts.filter((p) => !hidden.includes(p.id));

  const feedWithAds = useMemo(() => {
    const ads = getAds();
    if (ads.length === 0) return visiblePosts;
    
    const result: Post[] = [];
    let adIndex = 0;

    visiblePosts.forEach((post, i) => {
      result.push(post);
      if ((i + 1) % AD_FREQUENCY === 0) {
        result.push(ads[adIndex % ads.length] as unknown as Post);
        adIndex++;
      }
    });

    return result;
  }, [visiblePosts]);

  return (
    <div className="space-y-4">
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
        
        <CreatePostModal onPostCreated={setPosts} />
      </div>

      {feedWithAds.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No posts yet. Create the first one!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {feedWithAds.map((post, idx) => (
            <PostRenderer key={`${post.id}-${idx}`} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
