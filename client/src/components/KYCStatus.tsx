import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface KYCStatusProps {
  status?: "unverified" | "pending" | "verified";
}

export function KYCStatus({ status = "unverified" }: KYCStatusProps) {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Identity Verification</CardTitle>
        <ShieldCheck className={`w-4 h-4 ${status === 'verified' ? 'text-green-500' : 'text-muted-foreground'}`} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current Status</span>
          <Badge variant={status === 'verified' ? 'default' : 'secondary'} className="capitalize">
            {status}
          </Badge>
        </div>
        {status !== "verified" && (
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs">
            <UserCheck className="w-3 h-3" />
            Verify Identity
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
