import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Coins, Flame, DollarSign, Info } from "lucide-react";
import { getEarningDashboard } from "@/lib/earningSystem";
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

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between gap-1 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Coins className="w-4 h-4 text-primary" />
          DAH Coins
        </CardTitle>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">
              DAH Coins are earned as you use the platform. Just keep engaging naturally and your balance grows over time.
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
