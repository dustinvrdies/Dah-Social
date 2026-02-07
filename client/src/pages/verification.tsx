import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Mail,
  Phone,
  UserCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  Loader2,
  ArrowLeft,
  BadgeCheck,
} from "lucide-react";
import { Link } from "wouter";

type VerificationStatus = {
  verification: {
    userId?: string;
    email?: string | null;
    emailVerified: boolean;
    emailVerifiedAt?: string | null;
    phone?: string | null;
    phoneVerified: boolean;
    phoneVerifiedAt?: string | null;
    realName?: string | null;
    idVerified: boolean;
    idVerifiedAt?: string | null;
    kycLevel: number;
  };
  consent: {
    termsAccepted: boolean;
    termsAcceptedAt?: string | null;
    privacyAccepted: boolean;
    privacyAcceptedAt?: string | null;
    parentalConsentAcknowledged: boolean;
  } | null;
};

export default function VerificationPage() {
  const { session } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [verificationCode, setVerificationCode] = useState("");

  if (!session) {
    navigate("/login");
    return null;
  }

  const { data, isLoading } = useQuery<VerificationStatus>({
    queryKey: ["/api/verification/status"],
  });

  const sendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/email/send", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Code sent!", description: "Check your email inbox." });
    },
    onError: (err: Error) => {
      toast({ title: "Failed", description: err.message, variant: "destructive" });
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/email/verify", { code: verificationCode });
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Email verified!", description: "Your account is now verified." });
      queryClient.invalidateQueries({ queryKey: ["/api/verification/status"] });
      setVerificationCode("");
    },
    onError: (err: Error) => {
      toast({ title: "Verification failed", description: err.message, variant: "destructive" });
    },
  });

  const verification = data?.verification;
  const consent = data?.consent;
  const kycLevel = verification?.kycLevel ?? 0;

  const getLevelLabel = (level: number) => {
    switch (level) {
      case 0: return "Unverified";
      case 1: return "Email Verified";
      case 2: return "Phone Verified";
      case 3: return "Fully Verified";
      default: return "Unknown";
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 0: return "text-muted-foreground";
      case 1: return "text-blue-400";
      case 2: return "text-purple-400";
      case 3: return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href={`/profile/${session.username}`}>
            <Button variant="ghost" size="icon" data-testid="button-back-profile">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-verification-title">Verification Center</h1>
            <p className="text-sm text-muted-foreground">Verify your identity to unlock features</p>
          </div>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <CardTitle className="text-base">Verification Level</CardTitle>
            <Badge variant={kycLevel > 0 ? "default" : "secondary"} data-testid="badge-kyc-level">
              Level {kycLevel}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className={`w-8 h-8 ${getLevelColor(kycLevel)}`} />
              <div>
                <p className={`font-semibold ${getLevelColor(kycLevel)}`}>{getLevelLabel(kycLevel)}</p>
                <p className="text-xs text-muted-foreground">
                  {kycLevel === 0 && "Verify your email to get started"}
                  {kycLevel === 1 && "Add phone verification for enhanced trust"}
                  {kycLevel === 2 && "Submit ID verification for full access"}
                  {kycLevel === 3 && "All verifications complete"}
                </p>
              </div>
            </div>

            <div className="flex gap-1">
              {[1, 2, 3].map((level) => (
                <div
                  key={level}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    level <= kycLevel ? "bg-primary" : "bg-muted"
                  }`}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              <CardTitle className="text-base">Email Verification</CardTitle>
            </div>
            {verification?.emailVerified ? (
              <Badge variant="default" className="gap-1" data-testid="badge-email-verified">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="secondary" data-testid="badge-email-pending">
                <Clock className="w-3 h-3 mr-1" /> Pending
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            {verification?.emailVerified ? (
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Your email <span className="font-medium text-foreground">{verification.email}</span> is verified.
                </p>
                {verification.emailVerifiedAt && (
                  <p className="text-xs text-muted-foreground">
                    Verified on {new Date(verification.emailVerifiedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {verification?.email ? (
                  <>
                    <p className="text-sm text-muted-foreground">
                      Verify your email <span className="font-medium text-foreground">{verification.email}</span> to
                      earn a verified badge.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => sendCodeMutation.mutate()}
                      disabled={sendCodeMutation.isPending}
                      data-testid="button-send-email-code"
                    >
                      {sendCodeMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        "Send Verification Code"
                      )}
                    </Button>
                    <div className="space-y-2">
                      <Label htmlFor="email-code">Enter 6-digit code</Label>
                      <div className="flex gap-2">
                        <Input
                          id="email-code"
                          placeholder="000000"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="text-center tracking-widest"
                          maxLength={6}
                          data-testid="input-email-code"
                        />
                        <Button
                          onClick={() => verifyCodeMutation.mutate()}
                          disabled={verifyCodeMutation.isPending || verificationCode.length !== 6}
                          data-testid="button-verify-email-code"
                        >
                          {verifyCodeMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify"}
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg">
                    <AlertCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-muted-foreground">
                      No email address on file. Please contact support to add your email.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5" />
              <CardTitle className="text-base">Phone Verification</CardTitle>
            </div>
            {verification?.phoneVerified ? (
              <Badge variant="default" className="gap-1" data-testid="badge-phone-verified">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="secondary" data-testid="badge-phone-pending">
                Not Verified
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {verification?.phoneVerified ? (
              <p className="text-sm text-muted-foreground">
                Your phone number is verified.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Phone verification adds an extra layer of trust. This feature is coming soon.
                </p>
                <Button variant="outline" disabled data-testid="button-verify-phone">
                  <Phone className="w-4 h-4 mr-2" /> Coming Soon
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
            <div className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              <CardTitle className="text-base">ID Verification (KYC)</CardTitle>
            </div>
            {verification?.idVerified ? (
              <Badge variant="default" className="gap-1" data-testid="badge-id-verified">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </Badge>
            ) : (
              <Badge variant="secondary" data-testid="badge-id-pending">
                Not Verified
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            {verification?.idVerified ? (
              <p className="text-sm text-muted-foreground">
                Your identity has been verified. You have full access to all platform features.
              </p>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  Full identity verification unlocks all marketplace features and higher earning limits.
                  This feature requires email verification first.
                </p>
                <Button
                  variant="outline"
                  disabled={!verification?.emailVerified}
                  data-testid="button-verify-id"
                >
                  <UserCheck className="w-4 h-4 mr-2" /> Coming Soon
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {consent && (
          <>
            <Separator />
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Legal Agreements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Terms of Service</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {consent.termsAcceptedAt
                      ? `Accepted ${new Date(consent.termsAcceptedAt).toLocaleDateString()}`
                      : "Not accepted"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Privacy Policy</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {consent.privacyAcceptedAt
                      ? `Accepted ${new Date(consent.privacyAcceptedAt).toLocaleDateString()}`
                      : "Not accepted"}
                  </span>
                </div>
                {consent.parentalConsentAcknowledged && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Parental Consent</span>
                    </div>
                    <span className="text-xs text-muted-foreground">Acknowledged</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </PageLayout>
  );
}
