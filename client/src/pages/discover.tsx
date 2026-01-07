import { useState, useMemo } from "react";
import { Link } from "wouter";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getAllPosts } from "@/lib/feedData";
import { Post } from "@/lib/postTypes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, TrendingUp, Hash, Users, Play, Image, ShoppingBag, Flame, Sparkles } from "lucide-react";

const trendingHashtags = [
  { tag: "thriftfinds", count: 12500, trend: "+45%" },
  { tag: "vintagestyle", count: 8900, trend: "+32%" },
  { tag: "dahcreators", count: 7600, trend: "+28%" },
  { tag: "fleamarket", count: 6200, trend: "+19%" },
  { tag: "sustainable", count: 5400, trend: "+15%" },
  { tag: "retrovibes", count: 4800, trend: "+12%" },
  { tag: "tradingcommunity", count: 3900, trend: "+8%" },
  { tag: "handmade", count: 3200, trend: "+5%" },
];

const trendingCreators = [
  { username: "maya_creates", displayName: "Maya Chen", followers: 45600, category: "Art" },
  { username: "mike_flips", displayName: "Mike Thompson", followers: 38900, category: "Flipping" },
  { username: "sarah_thrifts", displayName: "Sarah Miller", followers: 32400, category: "Fashion" },
  { username: "techie_marcus", displayName: "Marcus Williams", followers: 28700, category: "Tech" },
  { username: "jenna_vintage", displayName: "Jenna Park", followers: 21500, category: "Vintage" },
  { username: "alex_trades", displayName: "Alex Rivera", followers: 18200, category: "Trading" },
];

const trendingSounds = [
  { id: "s1", name: "Original Sound - Thrift Queen", uses: 4500, duration: "0:15" },
  { id: "s2", name: "Vintage Vibes Beat", uses: 3200, duration: "0:30" },
  { id: "s3", name: "Cash Register Cha-Ching", uses: 2800, duration: "0:05" },
  { id: "s4", name: "Flea Market Flow", uses: 2100, duration: "0:20" },
  { id: "s5", name: "Haul Reveal Music", uses: 1900, duration: "0:25" },
];

function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("foryou");

  const posts = useMemo(() => getAllPosts(), []);

  const mediaPosts = useMemo(() => {
    return posts.filter((p) => {
      if (p.type === "video") return true;
      if (p.type === "text" && (p as any).media) return true;
      if (p.type === "listing" && (p as any).media) return true;
      return false;
    });
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!searchQuery) return mediaPosts;
    const q = searchQuery.toLowerCase();
    return mediaPosts.filter((p) => {
      if (p.type === "text") return p.content.toLowerCase().includes(q);
      if (p.type === "video") return (p.caption || "").toLowerCase().includes(q);
      if (p.type === "listing") return p.title.toLowerCase().includes(q);
      return false;
    });
  }, [mediaPosts, searchQuery]);

  return (
    <main className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6" />
            Discover
          </h1>
          <p className="text-muted-foreground">Explore trending content, creators, and sounds</p>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search posts, creators, hashtags, sounds..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 h-12 text-lg"
            data-testid="input-discover-search"
          />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="foryou" className="gap-1">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">For You</span>
          </TabsTrigger>
          <TabsTrigger value="trending" className="gap-1">
            <TrendingUp className="w-4 h-4" />
            <span className="hidden sm:inline">Trending</span>
          </TabsTrigger>
          <TabsTrigger value="hashtags" className="gap-1">
            <Hash className="w-4 h-4" />
            <span className="hidden sm:inline">Hashtags</span>
          </TabsTrigger>
          <TabsTrigger value="creators" className="gap-1">
            <Users className="w-4 h-4" />
            <span className="hidden sm:inline">Creators</span>
          </TabsTrigger>
          <TabsTrigger value="sounds" className="gap-1">
            <Play className="w-4 h-4" />
            <span className="hidden sm:inline">Sounds</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="foryou" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredPosts.slice(0, 20).map((post, idx) => (
              <Link key={post.id} href={post.type === "video" ? "/video" : "/"}>
                <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity">
                  {post.type === "video" ? (
                    <>
                      <video src={(post as any).src} className="w-full h-full object-cover" muted preload="metadata" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
                        <Play className="w-3 h-3" />
                        {formatCount(Math.floor(Math.random() * 50000 + 1000))}
                      </div>
                    </>
                  ) : (
                    <>
                      <img src={(post as any).media} alt="" className="w-full h-full object-cover" />
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white text-xs">
                        <Image className="w-3 h-3" />
                      </div>
                    </>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="trending" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {filteredPosts
              .sort(() => Math.random() - 0.5)
              .slice(0, 15)
              .map((post, idx) => (
                <Link key={post.id} href={post.type === "video" ? "/video" : "/"}>
                  <div className="aspect-[3/4] bg-muted rounded-lg overflow-hidden relative cursor-pointer hover:opacity-90 transition-opacity">
                    {idx < 3 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 border-0 text-white z-10">
                        <Flame className="w-3 h-3 mr-1" />
                        Hot
                      </Badge>
                    )}
                    {post.type === "video" ? (
                      <video src={(post as any).src} className="w-full h-full object-cover" muted preload="metadata" />
                    ) : (
                      <img src={(post as any).media} alt="" className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-2 left-2 right-2 text-white text-xs">
                      <p className="truncate">@{post.user}</p>
                    </div>
                  </div>
                </Link>
              ))}
          </div>
        </TabsContent>

        <TabsContent value="hashtags" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {trendingHashtags.map((hashtag, idx) => (
              <Card key={hashtag.tag} className="p-4 hover-elevate cursor-pointer" data-testid={`card-hashtag-${hashtag.tag}`}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Hash className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">#{hashtag.tag}</p>
                    <p className="text-sm text-muted-foreground">{formatCount(hashtag.count)} posts</p>
                  </div>
                  <Badge variant="secondary" className="text-green-500">
                    {hashtag.trend}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="creators" className="mt-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingCreators.map((creator, idx) => (
              <Link key={creator.username} href={`/profile/${creator.username}`}>
                <Card className="p-4 hover-elevate cursor-pointer" data-testid={`card-creator-${creator.username}`}>
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar className="w-14 h-14">
                        <AvatarFallback className="bg-dah-gradient text-white font-medium">
                          {creator.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      {idx < 3 && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{creator.displayName}</p>
                      <p className="text-sm text-muted-foreground">@{creator.username}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">{creator.category}</Badge>
                        <span className="text-xs text-muted-foreground">{formatCount(creator.followers)} followers</span>
                      </div>
                    </div>
                    <Button size="sm">Follow</Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sounds" className="mt-6">
          <div className="space-y-3">
            {trendingSounds.map((sound, idx) => (
              <Card key={sound.id} className="p-4 hover-elevate cursor-pointer" data-testid={`card-sound-${sound.id}`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-lg bg-dah-gradient flex items-center justify-center">
                    <Play className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{sound.name}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{sound.duration}</span>
                      <span>{formatCount(sound.uses)} videos</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Use Sound
                  </Button>
                </div>
              </Card>
            ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </main>
  );
}
