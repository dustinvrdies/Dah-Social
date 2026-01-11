import { useState } from "react";
import { useLocation, Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles, Users, ShoppingBag, Video, ArrowLeft, ArrowRight, Mail, CheckCircle2, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Step = "credentials" | "legal" | "email-verify" | "complete";

interface RegisterResponse {
  user: { id: string; username: string };
  emailVerificationRequired: boolean;
  emailSent: boolean;
}

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { session, refreshSession } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<"login" | "register">("register");
  const [step, setStep] = useState<Step>("credentials");
  
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [parentalConsent, setParentalConsent] = useState(false);
  
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");

  const parsedAge = parseInt(age, 10);
  const isMinor = parsedAge >= 13 && parsedAge < 18;

  if (session) {
    navigate("/");
    return null;
  }

  const registerMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/register", {
        username: username.trim().toLowerCase(),
        password,
        email: email.trim().toLowerCase(),
        age: parsedAge,
        termsAccepted,
        privacyAccepted,
        parentalConsentAcknowledged: isMinor ? parentalConsent : undefined,
      });
      return res.json() as Promise<RegisterResponse>;
    },
    onSuccess: (data) => {
      refreshSession();
      if (data.emailVerificationRequired) {
        setStep("email-verify");
        if (data.emailSent) {
          toast({ title: "Verification code sent!", description: "Check your email inbox." });
        }
      } else {
        setStep("complete");
      }
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const loginMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/login", {
        username: username.trim().toLowerCase(),
        password,
      });
      return res.json();
    },
    onSuccess: () => {
      refreshSession();
      navigate("/");
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/email/verify", { code: verificationCode });
      return res.json();
    },
    onSuccess: () => {
      setStep("complete");
      toast({ title: "Email verified!", description: "Your account is now verified." });
    },
    onError: (err: Error) => {
      setError(err.message);
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/verification/email/send", {});
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Code resent!", description: "Check your email inbox." });
    },
    onError: (err: Error) => {
      toast({ title: "Failed to resend", description: err.message, variant: "destructive" });
    },
  });

  const handleCredentialsNext = () => {
    setError("");
    if (!username.trim()) {
      setError("Username is required");
      return;
    }
    if (username.trim().length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (!/^[a-z0-9_]+$/i.test(username.trim())) {
      setError("Username may only contain letters, numbers, and underscores");
      return;
    }
    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Invalid email address");
      return;
    }
    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 120) {
      setError("Age must be 13 or older");
      return;
    }
    setStep("legal");
  };

  const handleLegalNext = () => {
    setError("");
    if (!termsAccepted) {
      setError("You must accept the Terms of Service");
      return;
    }
    if (!privacyAccepted) {
      setError("You must accept the Privacy Policy");
      return;
    }
    if (isMinor && !parentalConsent) {
      setError("Parental consent is required for users under 18");
      return;
    }
    registerMutation.mutate();
  };

  const handleVerifyEmail = () => {
    setError("");
    if (verificationCode.length !== 6) {
      setError("Please enter the 6-digit code");
      return;
    }
    verifyEmailMutation.mutate();
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password) {
      setError("Username and password required");
      return;
    }
    loginMutation.mutate();
  };

  const features = [
    { icon: Users, title: "Connect", desc: "Follow friends and creators" },
    { icon: Video, title: "Share", desc: "Post videos and content" },
    { icon: ShoppingBag, title: "Shop", desc: "Buy and sell in the Mall" },
    { icon: Sparkles, title: "Earn", desc: "Get DAH Coins for activity" },
  ];

  const renderCredentialsStep = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Choose a username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="bg-muted/50 border-0"
          data-testid="input-username"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-muted/50 border-0"
          data-testid="input-email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="At least 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-muted/50 border-0"
          data-testid="input-password"
        />
      </div>

      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirm Password</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="bg-muted/50 border-0"
            data-testid="input-confirm-password"
          />
        </div>
      )}

      {mode === "register" && (
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            min="13"
            max="120"
            placeholder="Your age (13+)"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="bg-muted/50 border-0"
            data-testid="input-age"
          />
          {parsedAge >= 13 && parsedAge < 18 && (
            <p className="text-xs text-muted-foreground">
              Users 13-17 earn double coins: half now, half locked for college.
            </p>
          )}
        </div>
      )}

      {error && (
        <p className="text-destructive text-sm" data-testid="text-login-error">{error}</p>
      )}

      {mode === "register" ? (
        <Button 
          onClick={handleCredentialsNext} 
          className="w-full bg-dah-gradient-strong" 
          data-testid="button-next-step"
        >
          Next <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      ) : (
        <Button
          onClick={handleLogin}
          className="w-full bg-dah-gradient-strong"
          disabled={loginMutation.isPending}
          data-testid="button-login-submit"
        >
          {loginMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
        </Button>
      )}

      <div className="text-center text-sm">
        {mode === "register" ? (
          <span className="text-muted-foreground">
            Already have an account?{" "}
            <button 
              onClick={() => setMode("login")} 
              className="text-primary hover:underline"
              data-testid="button-switch-to-login"
            >
              Sign in
            </button>
          </span>
        ) : (
          <span className="text-muted-foreground">
            Don't have an account?{" "}
            <button 
              onClick={() => setMode("register")} 
              className="text-primary hover:underline"
              data-testid="button-switch-to-register"
            >
              Create one
            </button>
          </span>
        )}
      </div>
    </div>
  );

  const renderLegalStep = () => (
    <div className="space-y-4">
      <button 
        onClick={() => setStep("credentials")} 
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        data-testid="button-back-step"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="text-center space-y-2">
        <h3 className="font-semibold">Legal Agreements</h3>
        <p className="text-sm text-muted-foreground">
          Please review and accept our policies to continue
        </p>
      </div>

      <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(c) => setTermsAccepted(c === true)}
            data-testid="checkbox-terms"
          />
          <div className="space-y-1">
            <label htmlFor="terms" className="text-sm font-medium cursor-pointer">
              I accept the{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>
            </label>
            <p className="text-xs text-muted-foreground">
              By using DAH Social, you agree to our community guidelines and platform rules.
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <Checkbox
            id="privacy"
            checked={privacyAccepted}
            onCheckedChange={(c) => setPrivacyAccepted(c === true)}
            data-testid="checkbox-privacy"
          />
          <div className="space-y-1">
            <label htmlFor="privacy" className="text-sm font-medium cursor-pointer">
              I accept the{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </label>
            <p className="text-xs text-muted-foreground">
              We collect and use your data as described in our privacy policy.
            </p>
          </div>
        </div>

        {isMinor && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
            <Checkbox
              id="parental"
              checked={parentalConsent}
              onCheckedChange={(c) => setParentalConsent(c === true)}
              data-testid="checkbox-parental"
            />
            <div className="space-y-1">
              <label htmlFor="parental" className="text-sm font-medium cursor-pointer">
                Parental/Guardian Consent
              </label>
              <p className="text-xs text-muted-foreground">
                I confirm that my parent or guardian has reviewed and approved my use of DAH Social.
                As a minor, 50% of my earned DAH Coins will be locked until I turn 18.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-destructive text-sm" data-testid="text-legal-error">{error}</p>
      )}

      <Button
        onClick={handleLegalNext}
        className="w-full bg-dah-gradient-strong"
        disabled={registerMutation.isPending}
        data-testid="button-accept-create"
      >
        {registerMutation.isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>Create Account</>
        )}
      </Button>
    </div>
  );

  const renderEmailVerifyStep = () => (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-dah-gradient-strong flex items-center justify-center">
        <Mail className="w-8 h-8 text-white" />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Verify Your Email</h3>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium text-foreground">{email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Enter 6-digit code"
          value={verificationCode}
          onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="text-center text-2xl tracking-widest bg-muted/50 border-0"
          maxLength={6}
          data-testid="input-verification-code"
        />
        <p className="text-xs text-muted-foreground">Code expires in 10 minutes</p>
      </div>

      {error && (
        <p className="text-destructive text-sm" data-testid="text-verify-error">{error}</p>
      )}

      <Button
        onClick={handleVerifyEmail}
        className="w-full bg-dah-gradient-strong"
        disabled={verifyEmailMutation.isPending}
        data-testid="button-verify-email"
      >
        {verifyEmailMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Verify Email"}
      </Button>

      <div className="flex flex-col gap-2">
        <button
          onClick={() => resendCodeMutation.mutate()}
          disabled={resendCodeMutation.isPending}
          className="text-sm text-primary hover:underline disabled:opacity-50"
          data-testid="button-resend-code"
        >
          {resendCodeMutation.isPending ? "Sending..." : "Resend code"}
        </button>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-muted-foreground hover:text-foreground"
          data-testid="button-skip-verify"
        >
          Skip for now (verify later)
        </button>
      </div>
    </div>
  );

  const renderCompleteStep = () => (
    <div className="space-y-4 text-center">
      <div className="w-16 h-16 mx-auto rounded-full bg-green-500 flex items-center justify-center">
        <CheckCircle2 className="w-8 h-8 text-white" />
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-lg">Welcome to DAH!</h3>
        <p className="text-sm text-muted-foreground">
          Your account is ready. Start exploring!
        </p>
      </div>

      <Button
        onClick={() => navigate("/")}
        className="w-full bg-dah-gradient-strong"
        data-testid="button-go-home"
      >
        Go to Feed
      </Button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case "credentials":
        return renderCredentialsStep();
      case "legal":
        return renderLegalStep();
      case "email-verify":
        return renderEmailVerifyStep();
      case "complete":
        return renderCompleteStep();
    }
  };

  const getStepTitle = () => {
    if (mode === "login") return "Sign In";
    switch (step) {
      case "credentials":
        return "Create Account";
      case "legal":
        return "Legal Agreements";
      case "email-verify":
        return "Verify Email";
      case "complete":
        return "Welcome!";
    }
  };

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-200px)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient-dah">Welcome to DAH</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                The social platform where you connect, create, and earn.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-dah-gradient-strong flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{f.title}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Card className="p-6 space-y-6 border-gradient-dah">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{getStepTitle()}</h2>
              {mode === "register" && step === "credentials" && (
                <p className="text-muted-foreground text-sm">
                  Create your account to start earning DAH Coins
                </p>
              )}
            </div>

            {mode === "register" && step !== "complete" && step !== "credentials" && (
              <div className="flex justify-center gap-2">
                {["credentials", "legal", "email-verify"].map((s, i) => (
                  <div
                    key={s}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      (step === "legal" && i <= 1) || 
                      (step === "email-verify" && i <= 2) ||
                      step === s
                        ? "bg-primary"
                        : "bg-muted-foreground/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {renderStep()}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
