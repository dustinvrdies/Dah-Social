import { Button } from "@/components/ui/button";
import { SiStripe } from "react-icons/si";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface PayoutRequestProps {
  balance: number;
}

export function PayoutRequest({ balance }: PayoutRequestProps) {
  return (
    <Card className="border-secondary/20 bg-secondary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Stripe Connect</CardTitle>
        <SiStripe className="h-5 w-5 text-secondary" />
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground">Available for payout</p>
          <div className="text-2xl font-bold">${(balance / 10).toFixed(2)}</div>
        </div>
        <Button 
          className="w-full bg-secondary hover:bg-secondary/90 gap-2"
          disabled={balance < 500}
          data-testid="button-request-payout"
        >
          Request Payout
        </Button>
        {balance < 500 && (
          <p className="text-[10px] text-center text-muted-foreground">
            Min. payout: $50.00 (500 Coins)
          </p>
        )}
      </CardContent>
    </Card>
  );
}
