import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, UserPlus } from "lucide-react";
import { useAuth } from "./AuthProvider";
import { isFollowing, follow } from "@/lib/follows";
import { useState } from "react";

const trendingItems = [
  { rank: 1, name: "Neon Visors", change: "+240%", volume: "Volume" },
  { rank: 2, name: "Neon Visors", change: "+240%", volume: "Volume" },
  { rank: 3, name: "Neon Visors", change: "+240%", volume: "Volume" },
];

const suggestedUsers = [
  { username: "neon_vixen", displayName: "Vixen" },
  { username: "glitch_god", displayName: "Glitch" },
  { username: "cyber_maya", displayName: "Maya" },
  { username: "techie_marcus", displayName: "Marcus" },
];

function MarketTrends() {
  return (
    <Card data-testid="card-market-trends">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h3 className="font-semibold text-sm">Market Trends</h3>
          <TrendingUp className="w-4 h-4 text-primary" />
        </div>
        <div className="space-y-3">
          {trendingItems.map((item, i) => (
            <div key={i} className="flex items-center gap-3" data-testid={`trend-item-${i}`}>
              <span className="text-xs font-bold text-muted-foreground w-4">#{item.rank}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.name}</p>
                <p className="text-[10px] text-muted-foreground">{item.change} {item.volume}</p>
              </div>
            </div>
          ))}
        </div>
        <Link href="/mall">
          <Button variant="default" size="sm" className="w-full mt-3" data-testid="button-visit-mall">
            Visit Mall
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

function WhoToFollow() {
  const { session } = useAuth();
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const handleFollow = (username: string) => {
    if (!session) return;
    follow(session.username, username);
    setFollowingState(prev => ({ ...prev, [username]: true }));
  };

  return (
    <Card data-testid="card-who-to-follow">
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm mb-3">Who to Follow</h3>
        <div className="space-y-3">
          {suggestedUsers.map((user) => {
            const alreadyFollowing = followingState[user.username] || (session && isFollowing(session.username, user.username));
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
      <MarketTrends />
      <WhoToFollow />
    </aside>
  );
}
