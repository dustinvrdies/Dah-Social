import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPage() {
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
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Privacy Policy</h1>
          </div>
        </div>

        <Card className="p-6 space-y-6">
          <p className="text-muted-foreground">
            Last updated: January 2026
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect information you provide directly to us, including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Account information (username, email, age)</li>
              <li>Profile information (display name, bio, avatar)</li>
              <li>Content you post (text, images, videos)</li>
              <li>Marketplace listings and transactions</li>
              <li>Communications with other users</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Provide, maintain, and improve the Platform</li>
              <li>Process transactions and send related information</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Monitor and analyze trends and usage</li>
              <li>Detect, investigate, and prevent fraudulent transactions</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Age Restrictions and COPPA Compliance</h2>
            <p className="text-muted-foreground">
              DAH Social is not intended for users under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you are under 13, please do not use the Platform.
            </p>
            <p className="text-muted-foreground">
              For users aged 13-17, we require parental or guardian consent. These users have enhanced 
              privacy protections and limited access to certain features.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Information Sharing</h2>
            <p className="text-muted-foreground">
              We may share your information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>With your consent or at your direction</li>
              <li>With service providers who need access to perform services</li>
              <li>To comply with legal obligations</li>
              <li>To protect our rights, privacy, safety, or property</li>
              <li>In connection with a merger, acquisition, or sale of assets</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Data Security</h2>
            <p className="text-muted-foreground">
              We implement reasonable security measures to protect your personal information. 
              However, no method of transmission over the Internet is 100% secure. We cannot 
              guarantee absolute security of your data.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Your Rights</h2>
            <p className="text-muted-foreground">You have the right to:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your account</li>
              <li>Opt out of marketing communications</li>
              <li>Export your data</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Cookies and Tracking</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to collect information about your 
              browsing activities. You can control cookies through your browser settings.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Third-Party Services</h2>
            <p className="text-muted-foreground">
              The Platform may contain links to third-party websites or services. We are not 
              responsible for the privacy practices of these third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. Changes to This Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any 
              changes by posting the new policy on this page and updating the "Last updated" date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us through the 
              Platform's support features.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}
