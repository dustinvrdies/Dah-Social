import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getWallet } from "@/lib/dahCoins";
import {
  rewardItems,
  limitedEditionItems,
  getAllItems,
  redeemItem,
  getRedemptions,
  getFeaturedItems,
  getTierColor,
  getFlashSales,
  getFlashSaleForItem,
  getFlashPrice,
  getStakes,
  createStake,
  claimStake,
  checkAndUpdateStakes,
  type RewardItem,
  type RewardCategory,
  type Redemption,
  type FlashSale,
  type CoinStake,
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
  Timer,
  Lock,
  Flame,
  Crown,
  Gem,
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

function CountdownTimer({ endTime }: { endTime: number }) {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = endTime - Date.now();
      if (diff <= 0) {
        setTimeLeft("Expired");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${h}h ${m}m ${s}s`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endTime]);

  return <span className="font-mono text-xs tabular-nums">{timeLeft}</span>;
}

function FlashSalesSection({ sales, onRedeem, wallet }: { sales: FlashSale[]; onRedeem: (item: RewardItem, flashSale: FlashSale) => void; wallet: { available: number } }) {
  if (sales.length === 0) return null;
  const allItems = getAllItems();

  return (
    <Card className="p-4 border-destructive/30 bg-gradient-to-r from-destructive/5 to-orange-500/5" data-testid="card-flash-sales">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-5 h-5 text-destructive" />
        <h3 className="font-bold text-sm">Flash Sales</h3>
        <Badge variant="destructive" className="text-[10px]">Limited Time</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {sales.map((sale) => {
          const item = allItems.find(r => r.id === sale.itemId);
          if (!item) return null;
          const flashPrice = Math.floor(item.price * (1 - sale.discountPercent / 100));
          const Icon = iconMap[item.icon] || Gift;
          const canAfford = wallet.available >= flashPrice;
          return (
            <Card
              key={sale.id}
              className="p-3 hover-elevate cursor-pointer relative overflow-visible"
              onClick={() => onRedeem(item, sale)}
              data-testid={`flash-sale-${sale.id}`}
            >
              <Badge className="absolute -top-2 -right-2 bg-destructive text-[10px]">
                -{sale.discountPercent}%
              </Badge>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-md bg-destructive/10 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{item.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Coins className="w-3 h-3 text-primary" />
                  <span className="font-bold text-sm text-primary">{flashPrice}</span>
                  <span className="text-[10px] text-muted-foreground line-through">{item.price}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1 text-destructive">
                  <Timer className="w-3 h-3" />
                  <CountdownTimer endTime={sale.endTime} />
                </div>
                <span className="text-[10px] text-muted-foreground">{sale.maxClaims - sale.claimed} left</span>
              </div>
              <Progress value={(sale.claimed / sale.maxClaims) * 100} className="h-1 mt-1.5" />
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

function StakingSection({ username, wallet, onRefresh }: { username: string; wallet: { available: number }; onRefresh: () => void }) {
  const { toast } = useToast();
  const [stakeAmount, setStakeAmount] = useState("100");
  const [stakeDuration, setStakeDuration] = useState(7);
  const [showStakeDialog, setShowStakeDialog] = useState(false);

  const stakes = useMemo(() => checkAndUpdateStakes(username), [username]);
  const activeStakes = stakes.filter(s => s.status === "active");
  const completedStakes = stakes.filter(s => s.status === "completed");

  const multiplier = stakeDuration <= 3 ? 1.1 : stakeDuration <= 7 ? 1.25 : stakeDuration <= 14 ? 1.5 : 2.0;
  const estimatedReward = Math.floor(Number(stakeAmount) * multiplier);

  const handleStake = () => {
    const result = createStake(username, Number(stakeAmount), stakeDuration);
    if (result.success) {
      toast({ title: "Coins Staked!", description: result.message });
      setShowStakeDialog(false);
      onRefresh();
    } else {
      toast({ title: "Staking Failed", description: result.message, variant: "destructive" });
    }
  };

  const handleClaim = (stakeId: string) => {
    const result = claimStake(username, stakeId);
    if (result.success) {
      toast({ title: "Stake Claimed!", description: result.message });
      onRefresh();
    } else {
      toast({ title: "Claim Failed", description: result.message, variant: "destructive" });
    }
  };

  return (
    <>
      <Card className="p-4 bg-gradient-to-r from-primary/5 to-cyan-500/5 border-primary/20" data-testid="card-staking">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-sm">Coin Staking</h3>
              <p className="text-[10px] text-muted-foreground">Lock coins to earn multiplied returns</p>
            </div>
          </div>
          <Button size="sm" onClick={() => setShowStakeDialog(true)} data-testid="button-open-stake">
            <Coins className="w-3.5 h-3.5 mr-1" />
            Stake Coins
          </Button>
        </div>

        {activeStakes.length > 0 && (
          <div className="space-y-2 mb-3">
            <p className="text-xs font-medium text-muted-foreground">Active Stakes</p>
            {activeStakes.map(stake => {
              const progress = Math.min(100, ((Date.now() - stake.startTime) / (stake.endTime - stake.startTime)) * 100);
              return (
                <div key={stake.id} className="flex items-center gap-3 p-2 bg-muted/30 rounded-md" data-testid={`stake-active-${stake.id}`}>
                  <Lock className="w-4 h-4 text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium">{stake.amount} coins ({stake.multiplier}x)</span>
                      <span className="text-[10px] text-muted-foreground">{stake.duration}d</span>
                    </div>
                    <Progress value={progress} className="h-1 mt-1" />
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-bold text-primary">{stake.reward}</p>
                    <p className="text-[10px] text-muted-foreground">reward</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {completedStakes.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-green-500">Ready to Claim</p>
            {completedStakes.map(stake => (
              <div key={stake.id} className="flex items-center gap-3 p-2 bg-green-500/5 rounded-md border border-green-500/20" data-testid={`stake-completed-${stake.id}`}>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium">{stake.amount} coins ({stake.multiplier}x)</span>
                </div>
                <Button size="sm" variant="outline" className="text-xs" onClick={() => handleClaim(stake.id)} data-testid={`button-claim-${stake.id}`}>
                  Claim {stake.reward}
                </Button>
              </div>
            ))}
          </div>
        )}

        {activeStakes.length === 0 && completedStakes.length === 0 && (
          <div className="text-center py-3">
            <p className="text-xs text-muted-foreground">No active stakes. Lock your coins to earn multiplied returns!</p>
          </div>
        )}

        <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/50">
          {[
            { days: 3, mult: "1.1x", label: "3 Days" },
            { days: 7, mult: "1.25x", label: "7 Days" },
            { days: 14, mult: "1.5x", label: "14 Days" },
            { days: 30, mult: "2.0x", label: "30 Days" },
          ].map(opt => (
            <div key={opt.days} className="text-center p-2 rounded-md bg-muted/30">
              <p className="text-xs font-bold text-primary">{opt.mult}</p>
              <p className="text-[10px] text-muted-foreground">{opt.label}</p>
            </div>
          ))}
        </div>
      </Card>

      <Dialog open={showStakeDialog} onOpenChange={setShowStakeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Stake DAH Coins
            </DialogTitle>
            <DialogDescription>Lock your coins for a set period to earn multiplied returns</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Amount to Stake</label>
              <div className="relative">
                <Coins className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                <Input
                  type="number"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  className="pl-9"
                  min={50}
                  max={wallet.available}
                  data-testid="input-stake-amount"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">Min: 50 | Available: {wallet.available.toLocaleString()}</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium">Lock Duration</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { days: 3, mult: 1.1, label: "3 Days" },
                  { days: 7, mult: 1.25, label: "7 Days" },
                  { days: 14, mult: 1.5, label: "14 Days" },
                  { days: 30, mult: 2.0, label: "30 Days" },
                ].map(opt => (
                  <Button
                    key={opt.days}
                    variant={stakeDuration === opt.days ? "default" : "outline"}
                    size="sm"
                    className="flex-col h-auto py-2 gap-0.5"
                    onClick={() => setStakeDuration(opt.days)}
                    data-testid={`button-duration-${opt.days}`}
                  >
                    <span className="text-xs font-bold">{opt.mult}x</span>
                    <span className="text-[10px]">{opt.label}</span>
                  </Button>
                ))}
              </div>
            </div>

            <Card className="p-3 bg-primary/5 border-primary/20">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">You stake</span>
                <span className="font-bold">{Number(stakeAmount).toLocaleString()} coins</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1">
                <span className="text-sm text-muted-foreground">Multiplier</span>
                <span className="font-bold text-primary">{multiplier}x</span>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1 pt-1 border-t border-primary/10">
                <span className="text-sm font-medium">You receive</span>
                <span className="font-bold text-lg text-primary">{estimatedReward.toLocaleString()} coins</span>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1 text-center">
                +{(estimatedReward - Number(stakeAmount)).toLocaleString()} profit after {stakeDuration} days
              </p>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStakeDialog(false)}>Cancel</Button>
            <Button
              onClick={handleStake}
              disabled={Number(stakeAmount) < 50 || Number(stakeAmount) > wallet.available}
              data-testid="button-confirm-stake"
            >
              <Lock className="w-4 h-4 mr-1.5" />
              Stake Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function LimitedEditionSection({ onRedeem, wallet }: { onRedeem: (item: RewardItem) => void; wallet: { available: number } }) {
  if (limitedEditionItems.length === 0) return null;

  return (
    <Card className="p-4 bg-gradient-to-r from-yellow-500/5 to-amber-500/5 border-yellow-500/20" data-testid="card-limited-edition">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-5 h-5 text-yellow-500" />
        <h3 className="font-bold text-sm">Limited Edition</h3>
        <Badge className="text-[10px] bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Exclusive</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {limitedEditionItems.map(item => {
          const Icon = iconMap[item.icon] || Gem;
          const canAfford = wallet.available >= item.price;
          const soldOut = item.stock !== null && item.stock <= 0;
          return (
            <Card
              key={item.id}
              className={`p-3 hover-elevate cursor-pointer relative ${soldOut ? "opacity-50" : ""}`}
              onClick={() => !soldOut && onRedeem(item)}
              data-testid={`le-card-${item.id}`}
            >
              {soldOut && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg z-10">
                  <Badge variant="destructive">Sold Out</Badge>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <div className="w-9 h-9 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                  <Icon className="w-4.5 h-4.5 text-yellow-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">{item.name}</p>
                  <p className="text-[10px] text-muted-foreground truncate">{item.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <Coins className="w-3 h-3 text-yellow-500" />
                  <span className="font-bold text-sm">{item.price.toLocaleString()}</span>
                </div>
                {item.stock !== null && (
                  <span className="text-[10px] text-muted-foreground">{item.stock} remaining</span>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </Card>
  );
}

function RewardCard({ item, onRedeem, canAfford, flashSale }: { item: RewardItem; onRedeem: (item: RewardItem) => void; canAfford: boolean; flashSale?: FlashSale | null }) {
  const Icon = iconMap[item.icon] || Gift;
  const tierColor = getTierColor(item.tier);
  const flashPrice = flashSale ? Math.floor(item.price * (1 - flashSale.discountPercent / 100)) : null;

  return (
    <Card
      className="p-4 flex flex-col gap-3 hover-elevate cursor-pointer relative"
      onClick={() => onRedeem(item)}
      data-testid={`reward-card-${item.id}`}
    >
      {item.featured && !flashSale && (
        <Badge className="absolute top-2 right-2 text-[10px] bg-primary/10 text-primary border-primary/20">
          Popular
        </Badge>
      )}
      {flashSale && (
        <Badge className="absolute top-2 right-2 text-[10px] bg-destructive">
          -{flashSale.discountPercent}%
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
        <div className="flex items-center gap-1.5">
          <Coins className="w-3.5 h-3.5 text-primary" />
          {flashPrice ? (
            <>
              <span className="font-bold text-sm tabular-nums text-destructive">{flashPrice.toLocaleString()}</span>
              <span className="text-[10px] text-muted-foreground line-through">{item.price.toLocaleString()}</span>
            </>
          ) : (
            <span className="font-bold text-sm tabular-nums">{item.price.toLocaleString()}</span>
          )}
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

  const [activeTab, setActiveTab] = useState<"featured" | RewardCategory | "limited" | "history">("featured");
  const [confirmItem, setConfirmItem] = useState<RewardItem | null>(null);
  const [confirmFlashSale, setConfirmFlashSale] = useState<FlashSale | null>(null);
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

  const flashSales = useMemo(() => getFlashSales(), [walletRefresh]);

  if (!session) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <ShoppingCart className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">DAH Rewards Store</h2>
            <p className="text-muted-foreground mb-4">Log in to redeem your DAH Coins for rewards</p>
            <Link href="/login"><Button data-testid="button-login-store">Log In</Button></Link>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const displayItems = activeTab === "featured"
    ? getFeaturedItems()
    : activeTab === "history" || activeTab === "limited"
    ? []
    : rewardItems.filter(r => r.category === activeTab);

  const handleRedeem = (item: RewardItem) => {
    setConfirmFlashSale(null);
    setConfirmItem(item);
  };

  const handleFlashRedeem = (item: RewardItem, sale: FlashSale) => {
    setConfirmFlashSale(sale);
    setConfirmItem(item);
  };

  const handleConfirmRedeem = () => {
    if (!confirmItem || !session) return;
    const result = redeemItem(session.username, confirmItem.id, !!confirmFlashSale);
    setConfirmItem(null);
    setConfirmFlashSale(null);

    if (result.success && result.redemption) {
      setSuccessRedemption(result.redemption);
      setWalletRefresh(prev => prev + 1);
    } else {
      toast({ title: "Redemption Failed", description: result.message, variant: "destructive" });
    }
  };

  const effectivePrice = confirmItem
    ? (confirmFlashSale ? Math.floor(confirmItem.price * (1 - confirmFlashSale.discountPercent / 100)) : confirmItem.price)
    : 0;

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-7 h-7 text-primary" />
            <div>
              <h1 className="text-2xl font-bold" data-testid="text-store-title">Rewards Store</h1>
              <p className="text-sm text-muted-foreground">Redeem your DAH Coins for real rewards</p>
            </div>
          </div>
          <Card className="flex items-center gap-2 px-4 py-2">
            <Coins className="w-4 h-4 text-primary" />
            <span className="font-bold tabular-nums" data-testid="text-wallet-balance">{wallet.available.toLocaleString()}</span>
            <span className="text-xs text-muted-foreground">available</span>
          </Card>
        </div>

        <FlashSalesSection sales={flashSales} onRedeem={handleFlashRedeem} wallet={wallet} />

        <StakingSection username={session.username} wallet={wallet} onRefresh={() => setWalletRefresh(prev => prev + 1)} />

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
              <TabsTrigger value="limited" className="gap-1.5 text-xs" data-testid="tab-limited">
                <Crown className="w-3.5 h-3.5" /> Limited
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-1.5 text-xs" data-testid="tab-history">
                <History className="w-3.5 h-3.5" /> History
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        {activeTab === "history" ? (
          <RedemptionHistory redemptions={redemptions} />
        ) : activeTab === "limited" ? (
          <LimitedEditionSection onRedeem={handleRedeem} wallet={wallet} />
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
                  canAfford={wallet.available >= (getFlashPrice(item))}
                  flashSale={getFlashSaleForItem(item.id)}
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

      <Dialog open={!!confirmItem} onOpenChange={() => { setConfirmItem(null); setConfirmFlashSale(null); }}>
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
                  {confirmFlashSale && (
                    <Badge variant="destructive" className="text-[10px] mt-1">Flash Sale -{confirmFlashSale.discountPercent}%</Badge>
                  )}
                  {confirmItem.limitedEdition && (
                    <Badge className="text-[10px] mt-1 bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Limited Edition</Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Cost</span>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-primary" />
                  {confirmFlashSale ? (
                    <>
                      <span className="font-bold text-destructive">{effectivePrice.toLocaleString()}</span>
                      <span className="text-xs text-muted-foreground line-through">{confirmItem.price.toLocaleString()}</span>
                    </>
                  ) : (
                    <span className="font-bold">{effectivePrice.toLocaleString()}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Your balance</span>
                <div className="flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium tabular-nums">{wallet.available.toLocaleString()}</span>
                </div>
              </div>

              {wallet.available < effectivePrice && (
                <p className="text-sm text-destructive text-center">
                  You need {(effectivePrice - wallet.available).toLocaleString()} more coins
                </p>
              )}

              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <span className="text-sm text-muted-foreground">Balance after</span>
                <span className={`font-medium tabular-nums ${wallet.available >= effectivePrice ? "" : "text-destructive"}`}>
                  {Math.max(0, wallet.available - effectivePrice).toLocaleString()}
                </span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setConfirmItem(null); setConfirmFlashSale(null); }}>Cancel</Button>
            <Button
              onClick={handleConfirmRedeem}
              disabled={!confirmItem || wallet.available < effectivePrice}
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
          <Button className="w-full" onClick={() => setSuccessRedemption(null)} data-testid="button-continue-shopping">
            Continue Shopping
          </Button>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
