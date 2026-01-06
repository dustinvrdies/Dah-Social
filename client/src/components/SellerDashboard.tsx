import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";

export function SellerDashboard() {
  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold">Seller Dashboard</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-2">
        <div className="p-3 bg-muted/20 rounded-lg space-y-1">
          <div className="text-muted-foreground"><ShoppingBag className="w-3.5 h-3.5" /></div>
          <div className="text-lg font-bold">12</div>
          <div className="text-[10px] uppercase text-muted-foreground">Listings</div>
        </div>
        <div className="p-3 bg-muted/20 rounded-lg space-y-1">
          <div className="text-green-500"><TrendingUp className="w-3.5 h-3.5" /></div>
          <div className="text-lg font-bold">4</div>
          <div className="text-[10px] uppercase text-muted-foreground">Sales</div>
        </div>
        <div className="p-3 bg-muted/20 rounded-lg space-y-1">
          <div className="text-red-500"><AlertCircle className="w-3.5 h-3.5" /></div>
          <div className="text-lg font-bold">0</div>
          <div className="text-[10px] uppercase text-muted-foreground">Disputes</div>
        </div>
      </CardContent>
    </Card>
  );
}
