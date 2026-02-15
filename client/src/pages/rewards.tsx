import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getCheckinState, canCheckinToday, performCheckin, canSpinToday, spinWheel, getSpinPrizes, getStreakRewards } from "@/lib/checkin";
import { getUserLevel, getLevelProgress, getRankTitles } from "@/lib/levels";
import { getUserBadges, checkAndUnlockBadges } from "@/lib/badges";
import { getReferralState, getReferralCode, applyReferralCode, hasUsedReferral } from "@/lib/referrals";
import { getWallet } from "@/lib/dahCoins";
import {
  CalendarCheck,
  Flame,
  Coins,
  Gift,
  Trophy,
  Star,
  Zap,
  Crown,
  Award,
  TrendingUp,
  Users,
  Heart,
  Copy,
  Check,
  Lock,
  Sparkles,
  RotateCcw,
} from "lucide-react";

const badgeIcons: Record<string, typeof Star> = {
  star: Star, flame: Flame, coins: Coins, gem: Sparkles, crown: Crown,
  users: Users, "trending-up": TrendingUp, heart: Heart, zap: Zap,
  award: Award, calendar: CalendarCheck,
};

function SpinWheelVisual({ spinning, targetIndex, onComplete }: { spinning: boolean; targetIndex: number; onComplete: () => void }) {
  const prizes = getSpinPrizes();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!spinning) return;
    const segAngle = 360 / prizes.length;
    const targetAngle = 360 * 5 + (360 - targetIndex * segAngle - segAngle / 2);
    let start: number | null = null;
    const duration = 4000;

    function animate(ts: number) {
      if (!start) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setRotation(eased * targetAngle);
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    }
    requestAnimationFrame(animate);
  }, [spinning, targetIndex]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = canvas.width;
    const center = size / 2;
    const radius = center - 4;

    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.translate(-center, -center);

    const segAngle = (2 * Math.PI) / prizes.length;
    const colors = ["#14b8a6", "#0ea5e9", "#8b5cf6", "#f59e0b", "#ef4444", "#22c55e", "#ec4899", "#6366f1"];

    prizes.forEach((prize, i) => {
      const startAngle = i * segAngle;
      const endAngle = startAngle + segAngle;

      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(startAngle + segAngle / 2);
      ctx.fillStyle = "#fff";
      ctx.font = "bold 11px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(prize.label, radius * 0.65, 4);
      ctx.restore();
    });

    ctx.restore();

    ctx.beginPath();
    ctx.moveTo(center - 10, 8);
    ctx.lineTo(center + 10, 8);
    ctx.lineTo(center, 28);
    ctx.closePath();
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.5)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [rotation, prizes]);

  return (
    <div className="relative flex justify-center">
      <canvas ref={canvasRef} width={260} height={260} className="rounded-full" />
    </div>
  );
}

export default function RewardsPage() {
  const { session } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [checkinState, setCheckinState] = useState(() => session ? getCheckinState(session.username) : null);
  const [canCheckin, setCanCheckin] = useState(() => session ? canCheckinToday(session.username) : false);
  const [canSpin, setCanSpin] = useState(() => session ? canSpinToday(session.username) : false);
  const [spinning, setSpinning] = useState(false);
  const [spinTarget, setSpinTarget] = useState(0);
  const [spinResult, setSpinResult] = useState<{ label: string; amount: number } | null>(null);
  const [showSpinResult, setShowSpinResult] = useState(false);
  const [badges, setBadges] = useState(() => session ? getUserBadges(session.username) : []);
  const [level, setLevel] = useState(() => session ? getUserLevel(session.username) : null);
  const [referralCode, setReferralCode] = useState(() => session ? getReferralCode(session.username) : "");
  const [referralInput, setReferralInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [referralState, setReferralState] = useState(() => session ? getReferralState(session.username) : null);
  const [usedReferral, setUsedReferral] = useState(() => session ? hasUsedReferral(session.username) : false);

  const streakRewards = getStreakRewards();

  useEffect(() => {
    if (!session) return;
    const newBadges = checkAndUnlockBadges(session.username);
    if (newBadges.length > 0) {
      setBadges(getUserBadges(session.username));
      newBadges.forEach((b) => {
        toast({ title: `Badge Unlocked: ${b.name}`, description: b.description });
      });
    }
  }, [session]);

  if (!session) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Card className="p-8 text-center">
            <Gift className="w-12 h-12 text-primary mx-auto mb-3" />
            <h2 className="text-xl font-bold mb-2">Daily Rewards</h2>
            <p className="text-muted-foreground mb-4">Log in to claim your daily rewards</p>
            <Link href="/login"><Button className="bg-dah-gradient-strong">Log In</Button></Link>
          </Card>
        </div>
      </PageLayout>
    );
  }

  const handleCheckin = () => {
    if (!canCheckin) return;
    const result = performCheckin(session.username, session.age);
    setCheckinState(getCheckinState(session.username));
    setCanCheckin(false);
    setLevel(getUserLevel(session.username));
    toast({ title: `Day ${result.streak} Check-in!`, description: `+${result.reward} DAH Coins earned${result.isStreakBonus ? " - Weekly Bonus!" : ""}` });
  };

  const handleSpin = () => {
    if (!canSpin || spinning) return;
    const result = spinWheel(session.username, session.age);
    setSpinTarget(result.index);
    setSpinResult(result.prize);
    setSpinning(true);
  };

  const handleSpinComplete = () => {
    setSpinning(false);
    setCanSpin(false);
    setShowSpinResult(true);
    setLevel(getUserLevel(session.username));
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyReferral = () => {
    if (!referralInput.trim()) return;
    const result = applyReferralCode(session.username, session.age, referralInput.trim());
    toast({
      title: result.success ? "Referral Applied!" : "Error",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    });
    if (result.success) {
      setUsedReferral(true);
      setReferralInput("");
      setLevel(getUserLevel(session.username));
    }
  };

  const levelProgress = level ? getLevelProgress(session.username) : 0;
  const wallet = getWallet(session.username);
  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges = badges.filter((b) => !b.unlockedAt);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Gift className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Rewards Center</h1>
            <p className="text-sm text-muted-foreground">Check in, spin, earn badges, and level up</p>
          </div>
        </div>

        {level && (
          <Card className="p-4">
            <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-dah-gradient flex items-center justify-center">
                  <span className="text-white font-bold">{level.level}</span>
                </div>
                <div>
                  <p className="font-semibold">Level {level.level} - {level.title}</p>
                  <p className="text-xs text-muted-foreground">{level.xp} / {level.xpToNext} XP</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-primary" />
                <span className="font-bold tabular-nums">{wallet.available.toLocaleString()}</span>
              </div>
            </div>
            <Progress value={levelProgress} className="h-2" />
          </Card>
        )}

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Daily Check-in</h2>
            </div>
            {checkinState && (
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-500" />
                <span className="text-sm font-medium">{checkinState.streak} day streak</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {streakRewards.map((reward, i) => {
              const isChecked = checkinState?.weeklyCheckins[i];
              const isCurrent = checkinState ? i === (checkinState.streak % 7 === 0 ? 6 : (checkinState.streak % 7) - 1) : false;
              const isToday = canCheckin && i === (checkinState?.streak || 0) % 7;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center p-2 rounded-lg border text-center ${
                    isChecked ? "bg-primary/10 border-primary/30" : isToday ? "border-primary border-dashed" : "border-border/50"
                  }`}
                >
                  <span className="text-[10px] text-muted-foreground">Day {i + 1}</span>
                  <Coins className={`w-4 h-4 my-1 ${isChecked ? "text-primary" : "text-muted-foreground"}`} />
                  <span className="text-xs font-medium">{reward}</span>
                  {isChecked && <Check className="w-3 h-3 text-primary mt-0.5" />}
                </div>
              );
            })}
          </div>

          <Button
            className={`w-full ${canCheckin ? "bg-dah-gradient-strong" : ""}`}
            disabled={!canCheckin}
            onClick={handleCheckin}
            data-testid="button-checkin"
          >
            {canCheckin ? (
              <>
                <CalendarCheck className="w-4 h-4 mr-2" />
                Check In Now (+{streakRewards[(checkinState?.streak || 0) % 7]} Coins)
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Checked In Today
              </>
            )}
          </Button>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Daily Spin Wheel</h2>
          </div>

          <SpinWheelVisual spinning={spinning} targetIndex={spinTarget} onComplete={handleSpinComplete} />

          <Button
            className={`w-full ${canSpin ? "bg-dah-gradient-strong" : ""}`}
            disabled={!canSpin || spinning}
            onClick={handleSpin}
            data-testid="button-spin"
          >
            {spinning ? (
              <>
                <RotateCcw className="w-4 h-4 mr-2 animate-spin" /> Spinning...
              </>
            ) : canSpin ? (
              <>
                <Gift className="w-4 h-4 mr-2" /> Spin to Win!
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" /> Come Back Tomorrow
              </>
            )}
          </Button>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-lg">Badges</h2>
            </div>
            <Badge variant="outline">{unlockedBadges.length} / {badges.length}</Badge>
          </div>

          {unlockedBadges.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Unlocked</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {unlockedBadges.map((b) => {
                  const Icon = badgeIcons[b.icon] || Star;
                  return (
                    <div key={b.id} className="flex flex-col items-center p-2 rounded-lg bg-primary/5 border border-primary/20" data-testid={`badge-${b.id}`}>
                      <Icon className="w-6 h-6 text-primary mb-1" />
                      <span className="text-[10px] font-medium text-center leading-tight">{b.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {lockedBadges.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2">Locked</p>
              <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {lockedBadges.map((b) => (
                  <div key={b.id} className="flex flex-col items-center p-2 rounded-lg bg-muted/30 border border-border/30 opacity-50">
                    <Lock className="w-6 h-6 text-muted-foreground mb-1" />
                    <span className="text-[10px] font-medium text-center leading-tight">{b.name}</span>
                    <span className="text-[8px] text-muted-foreground text-center">{b.description}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Referral Program</h2>
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Your referral code</p>
              <div className="flex gap-2">
                <Input value={referralCode} readOnly className="font-mono" data-testid="input-referral-code" />
                <Button variant="outline" size="icon" onClick={handleCopyCode} data-testid="button-copy-referral">
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">Earn 50 DAH Coins for each friend who joins</p>
            </div>

            {referralState && referralState.referrals.length > 0 && (
              <div className="flex items-center gap-3">
                <Badge variant="outline">
                  {referralState.referrals.length} referral{referralState.referrals.length !== 1 ? "s" : ""}
                </Badge>
                <Badge variant="outline">
                  <Coins className="w-3 h-3 mr-1" />{referralState.totalEarned} earned
                </Badge>
              </div>
            )}

            {!usedReferral && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Have a referral code?</p>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter referral code"
                    value={referralInput}
                    onChange={(e) => setReferralInput(e.target.value)}
                    className="font-mono"
                    data-testid="input-apply-referral"
                  />
                  <Button onClick={handleApplyReferral} data-testid="button-apply-referral">Apply</Button>
                </div>
              </div>
            )}
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <p className="font-semibold text-sm">Ready to spend your coins?</p>
              <p className="text-xs text-muted-foreground mt-0.5">Redeem for gift cards, boosts, and exclusive DAH products</p>
            </div>
            <Link href="/store">
              <Button size="sm" data-testid="button-go-store">
                <Coins className="w-3.5 h-3.5 mr-1.5" />
                Rewards Store
              </Button>
            </Link>
          </div>
        </Card>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link href="/store" className="block">
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <Gift className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">Store</p>
            </Card>
          </Link>
          <Link href="/leaderboard" className="block">
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <Trophy className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">Leaderboard</p>
            </Card>
          </Link>
          <Link href="/quests" className="block">
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <Zap className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">Quests</p>
            </Card>
          </Link>
          <Link href="/games" className="block">
            <Card className="p-4 text-center hover-elevate cursor-pointer">
              <Sparkles className="w-6 h-6 text-primary mx-auto mb-1" />
              <p className="text-sm font-medium">Games</p>
            </Card>
          </Link>
        </div>
      </div>

      <Dialog open={showSpinResult} onOpenChange={setShowSpinResult}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              You Won!
            </DialogTitle>
            <DialogDescription>Your spin wheel reward</DialogDescription>
          </DialogHeader>
          {spinResult && (
            <div className="text-center py-4">
              <div className="w-20 h-20 rounded-full bg-dah-gradient flex items-center justify-center mx-auto mb-4">
                <Coins className="w-10 h-10 text-white" />
              </div>
              <p className="text-3xl font-bold text-primary mb-2">{spinResult.label}</p>
              <p className="text-muted-foreground">Added to your wallet</p>
            </div>
          )}
          <Button className="w-full" onClick={() => setShowSpinResult(false)}>Awesome!</Button>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
