import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowDownCircle, Info } from "lucide-react";

interface CreatorWalletProps {
  balance: number;
}

export function CreatorWallet({ balance }: CreatorWalletProps) {
  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Creator Earnings</CardTitle>
        <Wallet className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{balance} DAH</div>
        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <Info className="w-3 h-3" />
          Min. withdrawal: 100 Coins
        </p>
        <Button 
          variant="secondary" 
          size="sm" 
          className="w-full mt-4 gap-2"
          disabled={balance < 100}
        >
          <ArrowDownCircle className="w-4 h-4" />
          Withdraw
        </Button>
      </CardContent>
    </Card>
  );
}
