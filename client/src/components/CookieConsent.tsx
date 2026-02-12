import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "dah.cookie.consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY);
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(STORAGE_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-20 left-4 right-4 z-[60] max-w-lg mx-auto bg-card border border-border rounded-lg shadow-lg p-4 space-y-3 animate-in slide-in-from-bottom-4 fade-in duration-300"
      data-testid="cookie-consent-banner"
    >
      <div className="flex items-start gap-3">
        <Cookie className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">We use cookies</p>
          <p className="text-xs text-muted-foreground">
            We use cookies and similar technologies to improve your experience, analyze traffic, and personalize content.
            By continuing to use DAH Social, you agree to our use of cookies. Read our{" "}
            <Link href="/cookie-policy" className="text-primary hover:underline" data-testid="link-cookie-policy-banner">
              Cookie Policy
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline" data-testid="link-privacy-policy-banner">
              Privacy Policy
            </Link>{" "}
            for more details.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 justify-end">
        <Button variant="ghost" size="sm" onClick={decline} data-testid="button-cookie-decline">
          Decline
        </Button>
        <Button size="sm" onClick={accept} className="bg-dah-gradient-strong" data-testid="button-cookie-accept">
          Accept All
        </Button>
      </div>
    </div>
  );
}
