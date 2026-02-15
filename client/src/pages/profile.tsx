import { useEffect, useState } from "react";
import { useRoute, Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { DraggableProfileBlocks } from "@/components/DraggableProfileBlocks";
import { ProfileThemeProvider } from "@/components/ProfileThemeProvider";
import { ProfileThemeSwitcher } from "@/components/ProfileThemeSwitcher";
import { WalletSummary } from "@/components/WalletSummary";
import { EarningsDashboard } from "@/components/EarningsDashboard";
import { CreatorAnalytics } from "@/components/CreatorAnalytics";
import { PayoutRequest } from "@/components/PayoutRequest";
import { RevenueSplitPreview } from "@/components/RevenueSplitPreview";
import { KYCStatus } from "@/components/KYCStatus";
import { PrivacyControls } from "@/components/PrivacyControls";
import { OnboardingChecklist } from "@/components/OnboardingChecklist";
import { useAuth } from "@/components/AuthProvider";
import { isBotUser, getBotUser } from "@/lib/botUsers";
import { recordDailyLogin } from "@/lib/earningSystem";
import { defaultTheme, ProfileTheme } from "@/lib/profileTheme";
import { follow, unfollow, isFollowing, getFollowers, getFollowing } from "@/lib/follows";
import { getReputation } from "@/lib/reputation";
import { getWallet } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { getUserProfile, updateUserProfile } from "@/lib/profileData";
import { getUserLevel } from "@/lib/levels";
import { getUserBadges } from "@/lib/badges";
import { getAllPosts } from "@/lib/feedData";
import type { Post } from "@/lib/postTypes";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Settings, Grid3X3, Video, ShoppingBag, Bookmark, Star, ShieldCheck, MessageCircle, Share2, BadgeCheck, Pencil, Award, TrendingUp, Flame, Coins, Zap, Calendar, Gem, Crown, Users as UsersIcon, type LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const STORAGE_KEY = "dah.profile.theme";

const badgeIconMap: Record<string, LucideIcon> = {
  star: Star,
  flame: Flame,
  calendar: Calendar,
  coins: Coins,
  gem: Gem,
  crown: Crown,
  users: UsersIcon,
  award: Award,
  trending: TrendingUp,
  zap: Zap,
};

function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No posts yet</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.slice(0, 18).map((p) => {
        const hasMedia = p.type === "text" && p.media;
        return (
          <div key={p.id} className="aspect-square bg-muted/30 rounded-md flex items-center justify-center cursor-pointer overflow-hidden relative group" data-testid={`post-grid-${p.id}`}>
            {hasMedia ? (
              <>
                <img src={p.media} alt="" className="w-full h-full object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <p className="text-white text-xs p-2 line-clamp-3 text-center">{p.content}</p>
                </div>
              </>
            ) : (
              <span className="text-xs text-muted-foreground p-2 line-clamp-4 text-center">{p.type === "text" ? p.content : ""}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function VideoGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No videos yet</p>;
  }
  return (
    <div className="grid grid-cols-3 gap-1">
      {posts.slice(0, 9).map((p) => (
        <div key={p.id} className="aspect-[9/16] bg-muted/30 rounded-md flex items-center justify-center cursor-pointer overflow-hidden relative" data-testid={`video-grid-${p.id}`}>
          {p.type === "video" && p.src ? (
            <video src={p.src} className="w-full h-full object-cover" muted />
          ) : (
            <Video className="w-8 h-8 text-muted-foreground/50" />
          )}
          <div className="absolute bottom-1 left-1 right-1">
            <p className="text-[10px] text-white/80 truncate">{p.type === "video" ? p.caption : ""}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ListingGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return <p className="text-center text-muted-foreground py-8">No listings yet</p>;
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {posts.slice(0, 9).map((p) => (
        <Card key={p.id} className="overflow-hidden cursor-pointer" data-testid={`listing-grid-${p.id}`}>
          <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
            {p.type === "listing" && p.media ? (
              <img src={p.media} alt="" className="w-full h-full object-cover" loading="lazy" />
            ) : (
              <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
            )}
          </div>
          <div className="p-2">
            <p className="text-xs font-medium truncate">{p.type === "listing" ? p.title : ""}</p>
            <p className="text-xs text-primary font-bold">{p.type === "listing" ? `$${p.price}` : ""}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}

function MutualFollowers({ myUsername, profileUsername }: { myUsername: string; profileUsername: string }) {
  const myFollowing = getFollowing(myUsername);
  const theirFollowers = getFollowers(profileUsername);
  const mutuals = myFollowing.filter(u => theirFollowers.includes(u));

  if (mutuals.length === 0) return null;

  return (
    <Card className="p-3" data-testid="card-mutual-followers">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {mutuals.slice(0, 3).map(u => (
            <Avatar key={u} className="w-6 h-6 border-2 border-background">
              <AvatarFallback className="text-[8px]">{u.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          Followed by{" "}
          <Link href={`/profile/${mutuals[0]}`} className="text-foreground font-medium">@{mutuals[0]}</Link>
          {mutuals.length === 2 && (
            <> and <Link href={`/profile/${mutuals[1]}`} className="text-foreground font-medium">@{mutuals[1]}</Link></>
          )}
          {mutuals.length > 2 && (
            <> and {mutuals.length - 1} others you follow</>
          )}
        </p>
      </div>
    </Card>
  );
}

function ActivityStats({ posts, username, followers }: { posts: Post[]; username: string; followers: string[] }) {
  const totalLikes = posts.reduce((sum, p) => {
    const engagement = JSON.parse(localStorage.getItem(`dah.engagement.${p.id}`) || "{}");
    return sum + (engagement.likes || 0);
  }, 0);
  const totalComments = posts.reduce((sum, p) => {
    const comments = JSON.parse(localStorage.getItem(`dah.comments.${p.id}`) || "[]");
    return sum + (Array.isArray(comments) ? comments.length : 0);
  }, 0);
  const joinDate = localStorage.getItem(`dah.joinDate.${username}`) || new Date().toISOString();

  const stats = [
    { label: "Total Likes", value: totalLikes.toLocaleString(), icon: Star },
    { label: "Comments", value: totalComments.toLocaleString(), icon: MessageCircle },
    { label: "Posts", value: posts.length.toString(), icon: Grid3X3 },
    { label: "Followers", value: followers.length.toString(), icon: UsersIcon },
  ];

  return (
    <div className="grid grid-cols-4 gap-2" data-testid="activity-stats">
      {stats.map(s => {
        const SIcon = s.icon;
        return (
          <Card key={s.label} className="p-3 text-center">
            <SIcon className="w-4 h-4 text-primary mx-auto mb-1" />
            <p className="font-bold text-sm tabular-nums">{s.value}</p>
            <p className="text-[10px] text-muted-foreground">{s.label}</p>
          </Card>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const [, params] = useRoute("/profile/:username");
  const username = (params?.username || "unknown").trim().toLowerCase();
  const { session } = useAuth();

  const { toast } = useToast();
  const [theme, setTheme] = useState<ProfileTheme>(defaultTheme);
  const [following, setFollowingState] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [editOpen, setEditOpen] = useState(false);

  const [rep, setRep] = useState(() => getReputation(username));
  const [followers, setFollowers] = useState<string[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [wallet, setWallet] = useState(() => getWallet(username));
  const [profile, setProfile] = useState(() => getUserProfile(username));
  const [editForm, setEditForm] = useState({ displayName: "", bio: "", avatarUrl: "", location: "", website: "" });
  const levelInfo = getUserLevel(username);
  const badges = getUserBadges(username);
  const unlockedBadges = badges.filter(b => b.unlockedAt !== null);

  const userPosts = getAllPosts().filter(p => 'user' in p && p.user === username);

  const isOwnProfile = session?.username === username;

  const { data: verificationData } = useQuery<{
    verification: { emailVerified: boolean; phoneVerified: boolean; idVerified: boolean; kycLevel: number };
  }>({
    queryKey: ["/api/verification/status"],
    enabled: isOwnProfile,
  });
  const kycLevel = verificationData?.verification?.kycLevel ?? 0;
  
  useEffect(() => {
    setRep(getReputation(username));
    setFollowers(getFollowers(username));
    setFollowingList(getFollowing(username));
    setWallet(getWallet(username));
    setProfile(getUserProfile(username));
  }, [username]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTheme(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (!session) return;
    setFollowingState(isFollowing(session.username, username));
  }, [session, username]);

  const canFollow = session && session.username !== username;

  const openEditDialog = () => {
    setEditForm({
      displayName: profile.displayName,
      bio: profile.bio,
      avatarUrl: profile.avatarUrl,
      location: profile.location,
      website: profile.website,
    });
    setEditOpen(true);
  };

  const saveProfile = () => {
    const updated = updateUserProfile(username, editForm);
    setProfile(updated);
    setEditOpen(false);
    toast({ title: "Profile updated", description: "Your changes have been saved." });
  };

  const toggleFollow = () => {
    if (!session) return;
    if (following) {
      unfollow(session.username, username);
      setFollowingState(false);
    } else {
      follow(session.username, username);
      setFollowingState(true);
      pushNotification(username, {
        username,
        type: "follow",
        message: `@${session.username} followed you.`,
      });
    }
  };

  const postCount = userPosts.length;

  return (
    <ProfileThemeProvider theme={theme}>
      <PageLayout>
        <div className={`${theme.background}`}>
        <div className="max-w-4xl mx-auto">
          <div className="h-32 bg-dah-gradient opacity-50" />
          
          <div className="px-6 -mt-16">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">
              <div className="ring-gradient-dah p-[3px] rounded-full">
                <Avatar className="w-32 h-32 border-4 border-background">
                  <AvatarImage src={profile.avatarUrl || undefined} />
                  <AvatarFallback className="bg-card text-3xl font-bold">
                    {(profile.displayName || username).slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <div>
                    <h1 className={`text-2xl font-bold ${theme.accent}`} data-testid="text-profile-username">
                      {profile.displayName || username}
                    </h1>
                    <span className="text-sm text-muted-foreground" data-testid="text-profile-handle">@{username}</span>
                  </div>
                  {isOwnProfile && kycLevel >= 1 && (
                    <div className="flex items-center gap-1" data-testid="badge-verified-email">
                      <BadgeCheck className="w-5 h-5 text-blue-400" />
                    </div>
                  )}
                  {isOwnProfile && kycLevel >= 3 && (
                    <div className="flex items-center gap-1" data-testid="badge-verified-id">
                      <ShieldCheck className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                  {rep.verifiedSales > 0 && (
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ShieldCheck className="w-4 h-4 text-primary" />
                      Verified Seller
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className={`font-bold ${theme.text}`}>{postCount}</span>
                    <span className="text-muted-foreground ml-1">posts</span>
                  </div>
                  <div>
                    <span className={`font-bold ${theme.text}`}>{followers.length}</span>
                    <span className="text-muted-foreground ml-1">followers</span>
                  </div>
                  <div>
                    <span className={`font-bold ${theme.text}`}>{followingList.length}</span>
                    <span className="text-muted-foreground ml-1">following</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className={`font-bold ${theme.text}`}>{rep.score}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {canFollow && (
                  <>
                    <Button
                      variant={following ? "outline" : "default"}
                      className={following ? "" : "bg-dah-gradient-strong"}
                      onClick={toggleFollow}
                      data-testid="button-follow"
                    >
                      {following ? "Following" : "Follow"}
                    </Button>
                    <Button variant="outline" size="icon" data-testid="button-message">
                      <MessageCircle className="w-5 h-5" />
                    </Button>
                  </>
                )}
                {isOwnProfile && (
                  <Button variant="outline" onClick={openEditDialog} data-testid="button-edit-profile">
                    <Pencil className="w-4 h-4 mr-1.5" />
                    Edit
                  </Button>
                )}
                <Button variant="outline" size="icon" data-testid="button-share-profile">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {profile.bio && (
              <p className="mt-3 text-sm max-w-lg" data-testid="text-profile-bio">{profile.bio}</p>
            )}
            {(profile.location || profile.website) && (
              <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground flex-wrap">
                {profile.location && <span data-testid="text-profile-location">{profile.location}</span>}
                {profile.website && <a href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline" data-testid="link-profile-website">{profile.website}</a>}
              </div>
            )}

            <div className="flex items-center gap-3 mt-3 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Zap className="w-3 h-3" />
                Lv. {levelInfo.level} {levelInfo.title}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span>{levelInfo.xp}/{levelInfo.xpToNext} XP</span>
                <Progress value={levelInfo.xpToNext > 0 ? (levelInfo.xp / levelInfo.xpToNext) * 100 : 100} className="w-16 h-1.5" />
              </div>
              {unlockedBadges.length > 0 && (
                <div className="flex items-center gap-1">
                  {unlockedBadges.slice(0, 5).map(b => {
                    const BadgeIcon = badgeIconMap[b.icon] || Award;
                    return <BadgeIcon key={b.id} aria-label={b.name} className="w-4 h-4 text-primary" />;
                  })}
                  {unlockedBadges.length > 5 && (
                    <span className="text-xs text-muted-foreground">+{unlockedBadges.length - 5}</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="mt-6 space-y-6">
              {isOwnProfile && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={`${theme.card} p-4 space-y-4 backdrop-blur-sm`}>
                    <div className="space-y-4">
                      <WalletSummary />
                      <EarningsDashboard />
                    </div>
                  </Card>
                  <Card className={`${theme.card} p-4 space-y-4 backdrop-blur-sm`}>
                    <div className="space-y-4">
                      <CreatorAnalytics views={postCount * 124} sales={rep.verifiedSales} />
                      <RevenueSplitPreview amount={wallet.available / 10} />
                      <PayoutRequest balance={wallet.available} />
                    </div>
                  </Card>
                  <Card className={`${theme.card} p-4 md:col-span-2 backdrop-blur-sm`}>
                    <ProfileThemeSwitcher setTheme={setTheme} />
                  </Card>
                  <div className="md:col-span-1">
                    <KYCStatus />
                  </div>
                  <div className="md:col-span-1">
                    <PrivacyControls />
                  </div>
                  <div className="md:col-span-2">
                    <OnboardingChecklist />
                  </div>
                </div>
              )}
              
              <Card className={`${theme.card} p-4 backdrop-blur-sm`}>
                <DraggableProfileBlocks profileUsername={username} />
              </Card>
              
              {!isOwnProfile && session && (
                <MutualFollowers myUsername={session.username} profileUsername={username} />
              )}

              <ActivityStats posts={userPosts} username={username} followers={followers} />

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="w-full justify-start bg-transparent border-b border-border/30 rounded-none p-0">
                  <TabsTrigger 
                    value="posts" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5"
                    data-testid="tab-posts"
                  >
                    <Grid3X3 className="w-4 h-4" />
                    Posts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="videos" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5"
                    data-testid="tab-videos"
                  >
                    <Video className="w-4 h-4" />
                    Videos
                  </TabsTrigger>
                  <TabsTrigger 
                    value="shop" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5"
                    data-testid="tab-shop"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Shop
                  </TabsTrigger>
                  {isOwnProfile && (
                    <TabsTrigger 
                      value="saved" 
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent gap-1.5"
                      data-testid="tab-saved"
                    >
                      <Bookmark className="w-4 h-4" />
                      Saved
                    </TabsTrigger>
                  )}
                </TabsList>
                
                <TabsContent value="posts" className="mt-4">
                  <PostGrid posts={userPosts.filter(p => p.type !== "video" && p.type !== "listing")} />
                </TabsContent>
                
                <TabsContent value="videos" className="mt-4">
                  <VideoGrid posts={userPosts.filter(p => p.type === "video")} />
                </TabsContent>
                
                <TabsContent value="shop" className="mt-4">
                  <ListingGrid posts={userPosts.filter(p => p.type === "listing")} />
                </TabsContent>
                
                <TabsContent value="saved" className="mt-4">
                  <p className="text-center text-muted-foreground py-8">
                    Your saved posts will appear here
                  </p>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        </div>

        <Dialog open={editOpen} onOpenChange={setEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Profile</DialogTitle>
              <DialogDescription>Update your profile information</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Display Name</label>
                <Input
                  value={editForm.displayName}
                  onChange={(e) => setEditForm(f => ({ ...f, displayName: e.target.value }))}
                  placeholder="Your display name"
                  data-testid="input-edit-displayname"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Bio</label>
                <Textarea
                  value={editForm.bio}
                  onChange={(e) => setEditForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="Tell us about yourself..."
                  rows={3}
                  data-testid="input-edit-bio"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Avatar URL</label>
                <Input
                  value={editForm.avatarUrl}
                  onChange={(e) => setEditForm(f => ({ ...f, avatarUrl: e.target.value }))}
                  placeholder="https://example.com/avatar.jpg"
                  data-testid="input-edit-avatar"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={editForm.location}
                  onChange={(e) => setEditForm(f => ({ ...f, location: e.target.value }))}
                  placeholder="City, Country"
                  data-testid="input-edit-location"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Website</label>
                <Input
                  value={editForm.website}
                  onChange={(e) => setEditForm(f => ({ ...f, website: e.target.value }))}
                  placeholder="yoursite.com"
                  data-testid="input-edit-website"
                />
              </div>
              <div className="flex items-center gap-2 justify-end">
                <Button variant="outline" onClick={() => setEditOpen(false)} data-testid="button-cancel-edit">Cancel</Button>
                <Button onClick={saveProfile} data-testid="button-save-profile">Save Changes</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </PageLayout>
    </ProfileThemeProvider>
  );
}
