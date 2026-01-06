import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart3, Eye, ShoppingCart } from "lucide-react";

interface CreatorAnalyticsProps {
  views: number;
  sales: number;
}

export function CreatorAnalytics({ views, sales }: CreatorAnalyticsProps) {
  return (
    <Card className="border-border/50 bg-muted/10">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Performance</CardTitle>
        <BarChart3 className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Eye className="w-3 h-3" />
              Total Views
            </p>
            <div className="text-xl font-bold">{views.toLocaleString()}</div>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <ShoppingCart className="w-3 h-3" />
              Sales
            </p>
            <div className="text-xl font-bold">{sales}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
