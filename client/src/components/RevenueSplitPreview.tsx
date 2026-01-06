import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PieChart, DollarSign, Wallet } from "lucide-react";

interface RevenueSplitPreviewProps {
  amount: number;
}

export function RevenueSplitPreview({ amount }: RevenueSplitPreviewProps) {
  const platformFee = amount * 0.4;
  const creatorEarnings = amount * 0.6;

  return (
    <Card className="border-border/50 bg-muted/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Revenue Split Preview</CardTitle>
        <PieChart className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSign className="w-3 h-3" />
            Gross Revenue
          </div>
          <span className="font-bold">${amount.toFixed(2)}</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Platform Fee (40%)</span>
            <span className="text-red-500">-${platformFee.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Your Earnings (60%)</span>
            <span className="text-green-500 font-bold">+${creatorEarnings.toFixed(2)}</span>
          </div>
        </div>
        <div className="pt-2 border-t border-border/50">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-primary" />
              <span className="font-semibold">Estimated Net</span>
            </div>
            <span className="text-primary font-bold">${creatorEarnings.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
