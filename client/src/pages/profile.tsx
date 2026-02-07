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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Grid3X3, Video, ShoppingBag, Bookmark, Star, ShieldCheck, MessageCircle, Share2, BadgeCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const STORAGE_KEY = "dah.profile.theme";

export default function ProfilePage() {
  const [, params] = useRoute("/profile/:username");
  const username = (params?.username || "unknown").trim().toLowerCase();
  const { session } = useAuth();

  const [theme, setTheme] = useState<ProfileTheme>(defaultTheme);
  const [following, setFollowingState] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const [rep, setRep] = useState(() => getReputation(username));
  const [followers, setFollowers] = useState<string[]>([]);
  const [followingList, setFollowingList] = useState<string[]>([]);
  const [wallet, setWallet] = useState(() => getWallet(username));

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

  const postCount = Math.floor(Math.random() * 100) + 10;

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
                  <AvatarImage src={undefined} />
                  <AvatarFallback className="bg-card text-3xl font-bold">
                    {username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className={`text-2xl font-bold ${theme.accent}`} data-testid="text-profile-username">
                    @{username}
                  </h1>
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
                  <Button variant="outline" size="icon" data-testid="button-settings">
                    <Settings className="w-5 h-5" />
                  </Button>
                )}
                <Button variant="outline" size="icon" data-testid="button-share-profile">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
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
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="aspect-square bg-muted/30 rounded-md flex items-center justify-center hover-elevate cursor-pointer"
                      >
                        <span className="text-muted-foreground text-xs">Post {i + 1}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="videos" className="mt-4">
                  <div className="grid grid-cols-3 gap-1">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="aspect-[9/16] bg-muted/30 rounded-md flex items-center justify-center hover-elevate cursor-pointer"
                      >
                        <Video className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="shop" className="mt-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <div 
                        key={i} 
                        className="aspect-square bg-muted/30 rounded-md flex items-center justify-center hover-elevate cursor-pointer"
                      >
                        <ShoppingBag className="w-8 h-8 text-muted-foreground/50" />
                      </div>
                    ))}
                  </div>
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
      </PageLayout>
    </ProfileThemeProvider>
  );
}
