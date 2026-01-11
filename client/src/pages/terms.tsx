import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Terms of Service</h1>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing or using DAH Social ("the Platform"), you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, you may not use the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. Eligibility</h2>
            <p className="text-muted-foreground">
              You must be at least 13 years old to use DAH Social. Users between 13-17 years old must have 
              parental or guardian consent. By using the Platform, you represent that you meet these requirements.
            </p>
            <p className="text-muted-foreground">
              Users aged 13-17 are subject to special protections including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>50% of earned DAH Coins are locked until age 18 for educational purposes</li>
              <li>Limited marketplace participation</li>
              <li>Enhanced content filtering</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Account Registration</h2>
            <p className="text-muted-foreground">
              When creating an account, you agree to provide accurate, current, and complete information. 
              You are responsible for maintaining the confidentiality of your account and password.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. User Conduct</h2>
            <p className="text-muted-foreground">You agree not to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Post illegal, harmful, or offensive content</li>
              <li>Harass, bully, or intimidate other users</li>
              <li>Impersonate others or misrepresent your identity</li>
              <li>Engage in fraudulent marketplace transactions</li>
              <li>Attempt to manipulate DAH Coins or platform systems</li>
              <li>Violate any applicable laws or regulations</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Virtual Currency (DAH Coins)</h2>
            <p className="text-muted-foreground">
              DAH Coins are a virtual currency with no real-world monetary value. They cannot be exchanged 
              for cash or transferred outside the Platform. DAH Coins may be earned through platform activity 
              and used for in-platform features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Marketplace</h2>
            <p className="text-muted-foreground">
              The DAH Mall facilitates transactions between users. DAH Social is not responsible for the 
              quality, safety, or legality of items listed. Users transact at their own risk.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Content Ownership</h2>
            <p className="text-muted-foreground">
              You retain ownership of content you post. By posting, you grant DAH Social a non-exclusive, 
              royalty-free license to use, display, and distribute your content on the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Termination</h2>
            <p className="text-muted-foreground">
              We reserve the right to suspend or terminate accounts that violate these terms without notice. 
              Upon termination, your access to DAH Coins and platform features will cease.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              DAH Social is provided "as is" without warranties. We are not liable for any damages arising 
              from your use of the Platform.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these terms, contact us through the Platform's support features.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}
