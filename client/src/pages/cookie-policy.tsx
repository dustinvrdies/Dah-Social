import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Cookie } from "lucide-react";
import { Link } from "wouter";

export default function CookiePolicyPage() {
  return (
    <PageLayout>
      <div data-testid="page-cookie-policy" className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Cookie className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Cookie Policy</h1>
          </div>
        </div>

        <Card className="p-6 space-y-8">
          <p className="text-muted-foreground" data-testid="text-last-updated">
            Last updated: February 2026
          </p>

          <section className="space-y-3" data-testid="section-what-are-cookies">
            <h2 className="text-xl font-semibold">1. What Are Cookies</h2>
            <p className="text-muted-foreground">
              Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website. They are widely used to make websites work more efficiently, provide a better user experience, and supply information to the owners of the website. Cookies allow websites to recognize your device and remember information about your visit, such as your preferences, login status, and browsing history.
            </p>
            <p className="text-muted-foreground">
              DAH Social, Inc. ("DAH Social," "we," "us," or "our") uses cookies and similar tracking technologies (such as web beacons, pixels, and local storage) on our platform ("the Platform") to provide, improve, and personalize our services. This Cookie Policy explains what cookies are, how we use them, the types of cookies we employ, and how you can manage your cookie preferences.
            </p>
            <p className="text-muted-foreground">
              By continuing to use the Platform, you consent to our use of cookies in accordance with this Cookie Policy. If you do not agree to our use of cookies, you should adjust your browser settings accordingly or refrain from using the Platform. Please note that disabling certain cookies may affect the functionality and your experience of the Platform.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-types-of-cookies">
            <h2 className="text-xl font-semibold">2. Types of Cookies We Use</h2>
            <p className="text-muted-foreground">
              DAH Social uses several categories of cookies, each serving a specific purpose. The following describes each type of cookie we use and its function:
            </p>
            <p className="text-muted-foreground">
              <strong>Essential Cookies:</strong> These cookies are strictly necessary for the operation of the Platform. They enable core functionality such as user authentication, session management, security features, and load balancing. Without these cookies, the Platform cannot function properly. Essential cookies do not require your consent under applicable privacy laws because they are necessary to provide the services you have requested.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Authentication and login session cookies that keep you signed in as you navigate the Platform</li>
              <li>Security cookies that help detect and prevent fraudulent activity, unauthorized access, and cyberattacks</li>
              <li>Load balancing cookies that distribute traffic across our servers to ensure optimal performance</li>
              <li>Cookie consent preferences that remember your cookie choices so we do not ask you repeatedly</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Functional Cookies:</strong> These cookies enable enhanced functionality and personalization features that are not strictly necessary but significantly improve your experience on the Platform. They allow us to remember your preferences, settings, and choices so you do not have to re-enter them each time you visit.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Language and locale preferences that display the Platform in your preferred language and regional format</li>
              <li>Theme preferences (such as dark mode or light mode) that persist across sessions</li>
              <li>Content display preferences, such as feed layout, notification settings, and accessibility options</li>
              <li>Recently viewed items and search history to enhance navigation and content discovery</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Analytics Cookies:</strong> These cookies collect information about how users interact with the Platform, helping us understand usage patterns, identify areas for improvement, and measure the effectiveness of our features and content. The information collected by analytics cookies is typically aggregated and anonymized.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Page view tracking to understand which areas of the Platform are most popular and how users navigate between pages</li>
              <li>Feature usage analytics that help us determine which features are most valuable and how they can be improved</li>
              <li>Performance monitoring cookies that measure load times, error rates, and other technical metrics to ensure a smooth user experience</li>
              <li>A/B testing cookies that allow us to test different versions of features and interfaces to optimize the user experience</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Advertising Cookies:</strong> These cookies are used to deliver advertisements that are relevant to you and your interests. They may also be used to limit the number of times you see an advertisement and to measure the effectiveness of advertising campaigns. Advertising cookies are typically placed by our advertising partners and third-party ad networks.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Interest-based targeting cookies that build a profile of your interests based on your browsing activity to deliver more relevant advertisements</li>
              <li>Retargeting cookies that allow our advertising partners to show you advertisements for DAH Social on other websites you visit</li>
              <li>Conversion tracking cookies that measure whether you take a desired action after seeing or clicking an advertisement</li>
              <li>Social media cookies that enable sharing functionality and may track your activity across websites for advertising purposes</li>
            </ul>
          </section>

          <section className="space-y-3" data-testid="section-third-party-cookies">
            <h2 className="text-xl font-semibold">3. Third-Party Cookies</h2>
            <p className="text-muted-foreground">
              In addition to our own cookies, DAH Social may allow certain third-party service providers to place cookies on your device when you use the Platform. These third-party cookies are used for analytics, advertising, and other services that help us operate and improve the Platform.
            </p>
            <p className="text-muted-foreground">
              Third-party cookies on our Platform may include cookies from:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Analytics providers (such as Google Analytics) that help us understand how users interact with the Platform</li>
              <li>Advertising networks that deliver targeted advertisements and measure campaign performance</li>
              <li>Social media platforms that enable content sharing and social login functionality</li>
              <li>Payment processors that facilitate secure transactions in the DAH Mall marketplace</li>
              <li>Content delivery networks (CDNs) that help deliver Platform content quickly and reliably</li>
              <li>Security and fraud prevention services that help protect users and the Platform from malicious activity</li>
            </ul>
            <p className="text-muted-foreground">
              We do not control the cookies set by third parties, and their use is governed by their respective privacy policies and cookie policies. We encourage you to review the privacy policies of these third-party service providers to understand how they collect, use, and share your information. DAH Social is not responsible for the privacy practices of third-party service providers.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-manage-cookies">
            <h2 className="text-xl font-semibold">4. How to Manage Cookies</h2>
            <p className="text-muted-foreground">
              You have several options for managing cookies on the DAH Social platform. You can control and manage cookies through your browser settings, our cookie preference center, and through third-party opt-out tools.
            </p>
            <p className="text-muted-foreground">
              <strong>Browser Settings:</strong> Most web browsers allow you to control cookies through their settings. You can typically configure your browser to block all cookies, block only third-party cookies, accept all cookies, or be notified when a cookie is set so you can decide whether to accept it. The process for managing cookies varies by browser:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Chrome: Settings &gt; Privacy and Security &gt; Cookies and other site data</li>
              <li>Firefox: Settings &gt; Privacy & Security &gt; Cookies and Site Data</li>
              <li>Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
              <li>Edge: Settings &gt; Cookies and site permissions &gt; Manage and delete cookies and site data</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Cookie Preference Center:</strong> DAH Social provides a cookie preference center accessible from the Platform's settings where you can manage your consent for different categories of non-essential cookies. You can update your preferences at any time.
            </p>
            <p className="text-muted-foreground">
              <strong>Opt-Out Tools:</strong> You can opt out of interest-based advertising by visiting the Digital Advertising Alliance's opt-out page (optout.aboutads.info), the Network Advertising Initiative's opt-out page (optout.networkadvertising.org), or the European Interactive Digital Advertising Alliance's opt-out page (youronlinechoices.eu) for users in the European Economic Area.
            </p>
            <p className="text-muted-foreground">
              Please note that blocking or deleting certain cookies may affect the functionality of the Platform. Essential cookies cannot be disabled as they are necessary for the Platform to operate. If you choose to disable cookies, some features of the Platform may not work as intended, and your experience may be degraded.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-cookie-duration">
            <h2 className="text-xl font-semibold">5. Cookie Duration</h2>
            <p className="text-muted-foreground">
              The cookies we use on DAH Social have varying lifespans depending on their purpose and type. Cookies are classified into two categories based on their duration:
            </p>
            <p className="text-muted-foreground">
              <strong>Session Cookies:</strong> These are temporary cookies that are stored in your device's memory only during your browsing session. Session cookies are automatically deleted when you close your browser. They are primarily used for essential functions such as maintaining your login state and ensuring security during your visit.
            </p>
            <p className="text-muted-foreground">
              <strong>Persistent Cookies:</strong> These cookies remain on your device for a set period of time or until you manually delete them. Persistent cookies are used to remember your preferences, provide personalized experiences, and deliver relevant advertisements across multiple sessions. The expiration period for persistent cookies varies depending on the purpose:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Authentication and preference cookies: Up to 12 months</li>
              <li>Analytics cookies: Up to 24 months</li>
              <li>Advertising and targeting cookies: Up to 12 months</li>
              <li>Cookie consent preference cookies: Up to 12 months</li>
            </ul>
            <p className="text-muted-foreground">
              We regularly review the cookies we use and their expiration periods to ensure they are appropriate and necessary. You can view and delete cookies stored on your device at any time through your browser settings.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-updates">
            <h2 className="text-xl font-semibold">6. Updates to Cookie Policy</h2>
            <p className="text-muted-foreground">
              DAH Social may update this Cookie Policy from time to time to reflect changes in our cookie practices, new technologies, regulatory requirements, or other factors. When we make material changes to this Cookie Policy, we will notify you by posting the updated policy on the Platform with a revised "Last updated" date.
            </p>
            <p className="text-muted-foreground">
              We encourage you to review this Cookie Policy periodically to stay informed about how we use cookies and similar technologies. Your continued use of the Platform after any changes to this Cookie Policy constitutes your acceptance of the updated policy.
            </p>
            <p className="text-muted-foreground">
              If we make significant changes to how we use cookies that materially affect your privacy rights, we will provide additional notice, such as an in-platform notification or a prominent banner, and may seek your renewed consent where required by applicable law.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-gdpr">
            <h2 className="text-xl font-semibold">7. GDPR & ePrivacy Compliance</h2>
            <p className="text-muted-foreground">
              DAH Social is committed to complying with the European Union's General Data Protection Regulation (GDPR), the ePrivacy Directive (Directive 2002/58/EC, as amended by Directive 2009/136/EC), and all other applicable data protection and privacy laws in the jurisdictions where we operate.
            </p>
            <p className="text-muted-foreground">
              In accordance with these regulations, DAH Social implements the following practices:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Consent:</strong> We obtain your explicit, informed, and freely given consent before placing non-essential cookies on your device. Essential cookies that are strictly necessary for the operation of the Platform do not require consent.</li>
              <li><strong>Transparency:</strong> We provide clear and comprehensive information about the cookies we use, their purposes, and their duration through this Cookie Policy and our cookie consent banner.</li>
              <li><strong>Control:</strong> You have the right to withdraw your consent to non-essential cookies at any time through our cookie preference center or your browser settings. Withdrawing consent will not affect the lawfulness of processing based on consent before its withdrawal.</li>
              <li><strong>Data Minimization:</strong> We only collect cookie data that is necessary for the specified purposes and do not use cookie data for purposes incompatible with those originally stated.</li>
              <li><strong>Data Subject Rights:</strong> Under the GDPR, you have the right to access, rectify, erase, restrict processing, port, and object to the processing of your personal data collected through cookies. To exercise these rights, please contact our Data Protection Officer at privacy@dahsocial.com.</li>
              <li><strong>Cross-Border Transfers:</strong> When cookie data is transferred outside the European Economic Area (EEA), we ensure that appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) approved by the European Commission, to protect your personal data.</li>
            </ul>
            <p className="text-muted-foreground">
              For users in the European Economic Area (EEA), United Kingdom, and other jurisdictions with similar cookie consent requirements, we display a cookie consent banner upon your first visit to the Platform. This banner allows you to accept or reject non-essential cookies and provides a link to this Cookie Policy for more information. You can change your cookie preferences at any time through our cookie preference center.
            </p>
            <p className="text-muted-foreground">
              If you have questions or concerns about our cookie practices or wish to exercise your data protection rights, please contact our Data Protection Officer at privacy@dahsocial.com or write to us at: DAH Social, Inc., Attn: Data Protection Officer.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}