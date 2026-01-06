import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Coins, TrendingUp, Clock, Flame, DollarSign, Info } from "lucide-react";
import { getEarningDashboard, getLoginStreak } from "@/lib/earningSystem";
import { useAuth } from "@/components/AuthProvider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function EarningsDashboard() {
  const { session } = useAuth();
  const [dashboard, setDashboard] = useState<ReturnType<typeof getEarningDashboard> | null>(null);

  useEffect(() => {
    if (session) {
      setDashboard(getEarningDashboard(session.username));
    }
  }, [session]);

  if (!session || !dashboard) return null;

  const dailyProgress = (dashboard.limits.dailyUsed / dashboard.limits.dailyCap) * 100;
  const monthlyProgress = (dashboard.limits.monthlyUsed / dashboard.limits.monthlyCap) * 100;

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary" />
          Earnings Dashboard
        </CardTitle>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              Earn DAH Coins by interacting with the platform. Coins are tied to platform revenue and can be redeemed for real payouts.
            </p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <DollarSign className="w-3 h-3" />
              Available Balance
            </div>
            <div className="text-2xl font-bold text-primary">
              {dashboard.wallet.available.toLocaleString()}
            </div>
            <div className="text-[10px] text-muted-foreground">
              ~${(dashboard.wallet.available / 10).toFixed(2)} USD
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Flame className="w-3 h-3" />
              Login Streak
            </div>
            <div className="text-2xl font-bold">
              {dashboard.streak}
              <span className="text-sm font-normal text-muted-foreground ml-1">days</span>
            </div>
            {dashboard.streak > 0 && dashboard.streak % 7 === 0 && (
              <Badge variant="secondary" className="text-[10px]">Streak Bonus!</Badge>
            )}
          </div>
        </div>

        <div className="space-y-3 pt-2 border-t border-border/50">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Daily Limit
              </span>
              <span className="font-medium">
                {dashboard.limits.dailyUsed}/{dashboard.limits.dailyCap}
              </span>
            </div>
            <Progress value={dailyProgress} className="h-1.5" />
          </div>
          
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Monthly Limit
              </span>
              <span className="font-medium">
                {dashboard.limits.monthlyUsed}/{dashboard.limits.monthlyCap}
              </span>
            </div>
            <Progress value={monthlyProgress} className="h-1.5" />
          </div>
        </div>

        <div className="pt-2 border-t border-border/50">
          <div className="text-[10px] text-muted-foreground mb-2">Earning Rates</div>
          <div className="grid grid-cols-2 gap-1 text-[10px]">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Post</span>
              <span>+{dashboard.rates.post_created}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Video</span>
              <span>+{dashboard.rates.video_posted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Listing</span>
              <span>+{dashboard.rates.listing_created}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Like</span>
              <span>+{dashboard.rates.like_given}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Comment</span>
              <span>+{dashboard.rates.comment_posted}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Daily Login</span>
              <span>+{dashboard.rates.daily_login}</span>
            </div>
          </div>
        </div>

        {dashboard.wallet.lockedForCollege > 0 && (
          <div className="pt-2 border-t border-border/50">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Locked for College</span>
              <Badge variant="outline" className="text-[10px]">
                {dashboard.wallet.lockedForCollege} coins
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
