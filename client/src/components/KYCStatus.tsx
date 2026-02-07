import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ShieldCheck, UserCheck, Mail, Phone, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface VerificationData {
  verification: {
    emailVerified: boolean;
    phoneVerified: boolean;
    idVerified: boolean;
    kycLevel: number;
  };
}

export function KYCStatus() {
  const { data } = useQuery<VerificationData>({
    queryKey: ["/api/verification/status"],
  });

  const v = data?.verification;
  const kycLevel = v?.kycLevel ?? 0;

  const statusColor = kycLevel === 0 ? "text-muted-foreground" : kycLevel >= 2 ? "text-green-500" : "text-blue-400";

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Identity Verification</CardTitle>
        <ShieldCheck className={`w-4 h-4 ${statusColor}`} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Verification Level</span>
          <Badge variant={kycLevel > 0 ? "default" : "secondary"} data-testid="badge-kyc-level">
            Level {kycLevel}
          </Badge>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3 h-3" />
              <span>Email</span>
            </div>
            {v?.emailVerified ? (
              <BadgeCheck className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-muted-foreground">Pending</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3 h-3" />
              <span>Phone</span>
            </div>
            {v?.phoneVerified ? (
              <BadgeCheck className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-muted-foreground">Not verified</span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <UserCheck className="w-3 h-3" />
              <span>ID</span>
            </div>
            {v?.idVerified ? (
              <BadgeCheck className="w-4 h-4 text-green-500" />
            ) : (
              <span className="text-muted-foreground">Not verified</span>
            )}
          </div>
        </div>

        <Link href="/verification">
          <Button variant="outline" size="sm" className="w-full gap-2 text-xs" data-testid="button-go-verification">
            <ShieldCheck className="w-3 h-3" />
            {kycLevel === 0 ? "Start Verification" : "Verification Center"}
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
