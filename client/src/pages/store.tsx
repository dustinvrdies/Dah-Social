import { useState, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getWallet } from "@/lib/dahCoins";
import {
  rewardItems,
  redeemItem,
  getRedemptions,
  getFeaturedItems,
  getTierColor,
  type RewardItem,
  type RewardCategory,
  type Redemption,
} from "@/lib/rewardsStore";
import {
  ShoppingCart,
  Coins,
  Gift,
  CreditCard,
  Coffee,
  Smartphone,
  Car,
  TrendingUp,
  Eye,
  Star,
  Zap,
  Award,
  Palette,
  Sparkles,
  Type,
  CheckCircle,
  Tag,
  Megaphone,
  Users,
  LayoutGrid,
  Play,
  UtensilsCrossed,
  History,
  Package,
} from "lucide-react";

const iconMap: Record<string, typeof Star> = {
  "shopping-cart": ShoppingCart,
  coffee: Coffee,
  "credit-card": CreditCard,
  car: Car,
  smartphone: Smartphone,
  play: Play,
  utensils: UtensilsCrossed,
  award: Award,
  palette: Palette,
  sparkles: Sparkles,
  type: Type,
  sticker: Gift,
  "check-circle": CheckCircle,
  "trending-up": TrendingUp,
  eye: Eye,
  star: Star,
  zap: Zap,
  coins: Coins,
  tag: Tag,
  megaphone: Megaphone,
  users: Users,
  layout: LayoutGrid,
};

const categoryLabels: Record<RewardCategory, { label: string; description: string; icon: typeof Star }> = {
  "gift-cards": { label: "Gift Cards", description: "Redeem for real gift cards", icon: CreditCard },
  "dah-products": { label: "DAH Products", description: "Exclusive platform items", icon: Sparkles },
  boosts: { label: "Boosts", description: "Amplify your reach", icon: TrendingUp },
  promos: { label: "Promos", description: "Promote your content", icon: Megaphone },
};

const tierLabels: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

function RewardCard({ item, onRedeem, canAfford }: { item: RewardItem; onRedeem: (item: RewardItem) => void; canAfford: boolean }) {
  const Icon = iconMap[item.icon] || Gift;
  const tierColor = getTierColor(item.tier);

  return (
    <Card
      className="p-4 flex flex-col gap-3 hover-elevate cursor-pointer relative"
      onClick={() => onRedeem(item)}
      data-testid={`reward-card-${item.id}`}
    >
      {item.featured && (
        <Badge className="absolute top-2 right-2 text-[10px] bg-primary/10 text-primary border-primary/20">
          Popular
        </Badge>
      )}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-lg bg-muted/60 flex items-center justify-center flex-shrink-0">
          <Icon className={`w-5 h-5 ${tierColor}`} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm leading-tight">{item.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-1">
          <Coins className="w-3.5 h-3.5 text-primary" />
          <span className="font-bold text-sm tabular-nums">{item.price.toLocaleString()}</span>
        </div>
        <Badge variant={canAfford ? "default" : "outline"} className={`text-[10px] ${canAfford ? "" : "opacity-50"}`}>
          {tierLabels[item.tier]}
        </Badge>
      </div>
    </Card>
  );
}

function RedemptionHistory({ redemptions }: { redemptions: Redemption[] }) {
  if (redemptions.length === 0) {
    return (
      <div className="text-center py-8">
        <Package className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">No redemptions yet</p>
        <p className="text-xs text-muted-foreground/70 mt-1">Browse the store and start redeeming!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {redemptions.map((r) => (
        <Card key={r.id} className="p-3 flex items-center gap-3" data-testid={`redemption-${r.id}`}>
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
            {r.category === "gift-cards" ? <CreditCard className="w-4 h-4 text-primary" /> :
             r.category === "dah-products" ? <Sparkles className="w-4 h-4 text-primary" /> :
             r.category === "boosts" ? <TrendingUp className="w-4 h-4 text-primary" /> :
             <Megaphone className="w-4 h-4 text-primary" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{r.itemName}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] text-muted-foreground">
                {new Date(r.redeemedAt).toLocaleDateString()}
              </span>
              {r.code && (
                <span className="text-[10px] font-mono bg-muted/50 px-1.5 py-0.5 rounded">{r.code}</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Coins className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground tabular-nums">{r.price}</span>
          </div>
          <Badge variant="outline" className="text-[10px] flex-shrink-0">
            {r.status === "pending" ? "Processing" : r.status === "fulfilled" ? "Active" : "Delivered"}
          </Badge>
        </Card>
      ))}
    </div>
  );
}

export default function StorePage() {
  const { session } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<"featured" | RewardCategory | "history">("featured");
  const [confirmItem, setConfirmItem] = useState<RewardItem | null>(null);
  const [successRedemption, setSuccessRedemption] = useState<Redemption | null>(null);
  const [walletRefresh, setWalletRefresh] = useState(0);

  const wallet = useMemo(() => {
    if (!session) return { available: 0, lockedForCollege: 0, username: "" };
    return getWallet(session.username);
  }, [session, walletRefresh]);

  const redemptions = useMemo(() => {
    if (!session) return [];
    return getRedemptions(session.username);
  }, [session, walletRefresh]);

  if (!session) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">DAH Rewards Store</h2>
            <p className="text-muted-foreground mb-4">Log in to redeem your DAH Coins for rewards</p>
            <Link href="/login"><Button>Log In</Button></Link>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const displayItems = activeTab === "featured"
    ? getFeaturedItems()
    : activeTab === "history"
    ? []
    : rewardItems.filter(r => r.category === activeTab);

  const handleRedeem = (item: RewardItem) => {
    setConfirmItem(item);
  };

  const handleConfirmRedeem = () => {
    if (!confirmItem || !session) return;
    const result = redeemItem(session.username, confirmItem.id);
    setConfirmItem(null);

    if (result.success && result.redemption) {
      setSuccessRedemption(result.redemption);
      setWalletRefresh(prev => prev + 1);
    } else {
      toast({ title: "Redemption Failed", description: result.message, variant: "destructive" });
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Rewards Store</h1>
              <p className="text-sm text-muted-foreground">Redeem your DAH Coins for real rewards</p>
            </div>
          </div>
          <Card className="flex items-center gap-2 px-4 py-2">
            <Coins className="w-4 h-4 text-primary" />
            <span className="font-bold tabular-nums">{wallet.available.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">available</span>
          </Card>
        </div>

        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">Earn more coins to unlock premium rewards</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Complete quests, check in daily, play games, and engage with the community
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/rewards">
                <Button variant="outline" size="sm" className="text-xs" data-testid="button-go-rewards">
                  <Gift className="w-3.5 h-3.5 mr-1" /> Daily Rewards
                </Button>
              </Link>
              <Link href="/quests">
                <Button variant="outline" size="sm" className="text-xs" data-testid="button-go-quests">
                  <Zap className="w-3.5 h-3.5 mr-1" /> Quests
                </Button>
              </Link>
            </div>
          </div>
        </Card>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="bg-muted/40 w-auto inline-flex">
              <TabsTrigger value="featured" className="gap-1.5 text-xs" data-testid="tab-featured">
                <Star className="w-3.5 h-3.5" /> Featured
              </TabsTrigger>
              <TabsTrigger value="gift-cards" className="gap-1.5 text-xs" data-testid="tab-gift-cards">
                <CreditCard className="w-3.5 h-3.5" /> Gift Cards
              </TabsTrigger>
              <TabsTrigger value="dah-products" className="gap-1.5 text-xs" data-testid="tab-dah-products">
                <Sparkles className="w-3.5 h-3.5" /> DAH Products
              </TabsTrigger>
              <TabsTrigger value="boosts" className="gap-1.5 text-xs" data-testid="tab-boosts">
                <TrendingUp className="w-3.5 h-3.5" /> Boosts
              </TabsTrigger>
              <TabsTrigger value="promos" className="gap-1.5 text-xs" data-testid="tab-promos">
                <Megaphone className="w-3.5 h-3.5" /> Promos
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5 text-xs" data-testid="tab-history">
                <History className="w-3.5 h-3.5" /> History
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {activeTab === "history" ? (
          <RedemptionHistory redemptions={redemptions} />
        ) : (
          <>
            {activeTab !== "featured" && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {(() => {
                  const cat = categoryLabels[activeTab as RewardCategory];
                  if (!cat) return null;
                  const CatIcon = cat.icon;
                  return (
                    <>
                      <CatIcon className="w-4 h-4" />
                      <span>{cat.description}</span>
                    </>
                  );
                })()}
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {displayItems.map((item) => (
                <RewardCard
                  key={item.id}
                  item={item}
                  onRedeem={handleRedeem}
                  canAfford={wallet.available >= item.price}
                />
              ))}
            </div>
            {displayItems.length === 0 && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No items in this category</p>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!confirmItem} onOpenChange={() => setConfirmItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Redemption</DialogTitle>
            <DialogDescription>Review your reward before redeeming</DialogDescription>
          </DialogHeader>
          {confirmItem && (
            <div className="space-y-4 py-2">
              <div className="flex items-center gap-3">
                {(() => {
                  const Icon = iconMap[confirmItem.icon] || Gift;
                  return (
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                  );
                })()}
                <div>
                  <p className="font-semibold">{confirmItem.name}</p>
                  <p className="text-sm text-muted-foreground">{confirmItem.description}</p>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Cost</span>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-bold">{confirmItem.price.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Your balance</span>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium tabular-nums">{wallet.available.toLocaleString()}</span>
                </div>
              </div>

              {wallet.available < confirmItem.price && (
                <p className="text-sm text-destructive text-center">
                  You need {(confirmItem.price - wallet.available).toLocaleString()} more coins
                </p>
              )}

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Balance after</span>
                <span className={`font-medium tabular-nums ${wallet.available >= confirmItem.price ? "" : "text-destructive"}`}>
                  {Math.max(0, wallet.available - confirmItem.price).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmItem(null)}>Cancel</Button>
            <Button
              onClick={handleConfirmRedeem}
              disabled={!confirmItem || wallet.available < (confirmItem?.price || 0)}
              data-testid="button-confirm-redeem"
            >
              <Coins className="w-4 h-4 mr-1.5" />
              Redeem Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!successRedemption} onOpenChange={() => setSuccessRedemption(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Redemption Successful!
            </DialogTitle>
            <DialogDescription>Your reward has been processed</DialogDescription>
          </DialogHeader>
          {successRedemption && (
            <div className="text-center py-4 space-y-3">
              <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                <Gift className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="font-semibold text-lg">{successRedemption.itemName}</p>
                <p className="text-sm text-muted-foreground">-{successRedemption.price.toLocaleString()} DAH Coins</p>
              </div>
              {successRedemption.code && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Your redemption code</p>
                  <p className="font-mono font-bold text-lg tracking-wide">{successRedemption.code}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">Save this code - you can find it in your redemption history</p>
                </div>
              )}
              {!successRedemption.code && (
                <p className="text-sm text-muted-foreground">
                  {successRedemption.category === "boosts" ? "Your boost is now active!" :
                   successRedemption.category === "promos" ? "Your promotion has been applied!" :
                   "Your item has been added to your account!"}
                </p>
              )}
            </div>
          )}
          <Button className="w-full" onClick={() => setSuccessRedemption(null)}>
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
