import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, UserPlus, Flame, MessageSquare, Heart } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { isFollowing, follow, getFollowing } from "@/lib/follows";
import { useState, useMemo, useEffect } from "react";
import { getAllPosts } from "@/lib/feedData";
import { getLikes, getCommentCount } from "@/lib/engagement";
import { getReactions } from "@/lib/reactions";
import type { Post } from "@/lib/postTypes";

function getTrendingData() {
  const posts = getAllPosts();
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;

  const scored = posts
    .filter(p => p.type !== "ad")
    .map(p => {
      const likes = getLikes(p.id);
      const comments = getCommentCount(p.id);
      const reactions = getReactions(p.id);
      const recentReactions = reactions.filter(r => (now - r.timestamp) < dayMs).length;
      const total = likes.count + comments * 3 + reactions.length * 1.5 + recentReactions * 5;
      return { post: p, score: total, likes: likes.count, comments, reactions: reactions.length };
    })
    .sort((a, b) => b.score - a.score);

  return scored.slice(0, 5);
}

function getSuggestedUsers(currentUser: string | null, following: string[]) {
  const posts = getAllPosts();
  const userEngagement: Record<string, number> = {};

  for (const p of posts) {
    if (p.type === "ad") continue;
    const user = (p as any).user || "";
    if (!user || user === currentUser || following.includes(user)) continue;
    const likes = getLikes(p.id);
    const comments = getCommentCount(p.id);
    const reactions = getReactions(p.id);
    const score = likes.count + comments * 2 + reactions.length;
    userEngagement[user] = (userEngagement[user] || 0) + score;
  }

  return Object.entries(userEngagement)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([username, score]) => ({
      username,
      displayName: username.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
      score,
    }));
}

function formatNumber(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(1) + "k";
  return String(n);
}

function TrendingPosts() {
  const trending = useMemo(() => getTrendingData(), []);

  return (
    <Card data-testid="card-trending-posts">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold text-sm">Trending Now</h3>
          <Flame className="w-4 h-4 text-orange-500" />
        </div>
        <div className="space-y-3">
          {trending.map((item, i) => {
            const user = (item.post as any).user || "unknown";
            const content = (item.post as any).content || (item.post as any).caption || (item.post as any).title || "";
            const preview = content.length > 60 ? content.slice(0, 60) + "..." : content;

            return (
              <div key={item.post.id} className="flex items-start gap-2.5" data-testid={`trending-post-${i}`}>
                <span className="text-xs font-bold text-muted-foreground w-4 mt-0.5 flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user}`}>
                    <p className="text-xs font-medium text-primary cursor-pointer">@{user}</p>
                  </Link>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{preview}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <Heart className="w-2.5 h-2.5" />
                      {formatNumber(item.likes)}
                    </span>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                      <MessageSquare className="w-2.5 h-2.5" />
                      {formatNumber(item.comments)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function WhoToFollow() {
  const { session } = useAuth();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const following = useMemo(() => {
    if (!session) return [] as string[];
    return getFollowing(session.username);
  }, [session]);

  const suggested = useMemo(
    () => getSuggestedUsers(session?.username || null, following),
    [session, following]
  );

  useEffect(() => {
    if (!session || suggested.length === 0) return;
    const map: Record<string, boolean> = {};
    suggested.forEach(u => {
      if (isFollowing(session.username, u.username)) {
        map[u.username] = true;
      }
    });
    if (Object.keys(map).length > 0) {
      setFollowingState(prev => ({ ...prev, ...map }));
    }
  }, [session, suggested]);

  const handleFollow = (username: string) => {
    if (!session) return;
    follow(session.username, username);
    setFollowingState(prev => ({ ...prev, [username]: true }));
  };

  if (suggested.length === 0) return null;

  return (
    <Card data-testid="card-who-to-follow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-3">Who to Follow</h3>
        <div className="space-y-3">
          {suggested.map((user) => {
            const alreadyFollowing = followingState[user.username];
            return (
              <div key={user.username} className="flex items-center gap-3" data-testid={`suggest-user-${user.username}`}>
                <Link href={`/profile/${user.username}`}>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/profile/${user.username}`}>
                    <p className="text-sm font-medium truncate cursor-pointer">{user.displayName}</p>
                  </Link>
                  <p className="text-[10px] text-muted-foreground truncate">@{user.username}</p>
                </div>
                {!alreadyFollowing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleFollow(user.username)}
                    className="text-xs"
                    data-testid={`button-follow-${user.username}`}
                  >
                    <UserPlus className="w-3 h-3 mr-1" />
                    Follow
                  </Button>
                ) : (
                  <Badge variant="outline" className="text-[10px]">Following</Badge>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function RightSidebar() {
  return (
    <aside className="hidden lg:flex flex-col gap-4 w-72 flex-shrink-0 sticky top-16" data-testid="right-sidebar">
      <TrendingPosts />
      <WhoToFollow />
    </aside>
  );
}
