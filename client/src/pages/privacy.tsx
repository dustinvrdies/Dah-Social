import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import { Link } from "wouter";

export default function PrivacyPage() {
  return (
    <PageLayout>
      <div data-testid="page-privacy" className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
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
            Last updated: February 2026
          </p>

          <p className="text-muted-foreground">
            Welcome to DAH Social ("we," "us," "our," or the "Platform"). We are committed to protecting your privacy and ensuring you understand how we collect, use, and share your personal information. This Privacy Policy applies to all users of DAH Social, including our website, mobile applications, and related services. By using our Platform, you agree to the practices described in this Privacy Policy.
          </p>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">1. Information We Collect</h2>
            <p className="text-muted-foreground">
              We collect the following categories of information when you use DAH Social:
            </p>
            <h3 className="text-lg font-medium">Account Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Username, email address, password, and date of birth</li>
              <li>Phone number (if provided for account recovery or verification)</li>
              <li>Payment and billing information for marketplace transactions</li>
            </ul>
            <h3 className="text-lg font-medium">Profile Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Display name, bio, avatar, and profile photos</li>
              <li>Links to external websites or social media accounts</li>
              <li>Profile customization preferences and theme settings</li>
            </ul>
            <h3 className="text-lg font-medium">Content You Create</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Posts, comments, messages, and other user-generated content (text, images, videos, audio)</li>
              <li>Marketplace listings, product descriptions, and transaction details</li>
              <li>Reactions, likes, shares, and other engagement activities</li>
            </ul>
            <h3 className="text-lg font-medium">Usage Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Pages visited, features used, actions taken, and time spent on the Platform</li>
              <li>Search queries and browsing history within the Platform</li>
              <li>Interaction patterns with other users, content, and advertisements</li>
            </ul>
            <h3 className="text-lg font-medium">Device & Technical Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>IP address, browser type, operating system, and device identifiers</li>
              <li>Screen resolution, language preferences, and time zone</li>
              <li>Mobile device model, carrier information, and network type</li>
            </ul>
            <h3 className="text-lg font-medium">Cookies & Similar Technologies</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Session cookies, persistent cookies, and authentication tokens</li>
              <li>Pixels, web beacons, and local storage data</li>
              <li>Third-party analytics and advertising cookies</li>
            </ul>
            <h3 className="text-lg font-medium">Location Data</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Approximate location derived from IP address</li>
              <li>Precise location data if you grant permission (e.g., for local marketplace features)</li>
              <li>Location information embedded in photos or content you share</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">2. How We Use Your Information</h2>
            <p className="text-muted-foreground">We use the information we collect for the following purposes:</p>
            <h3 className="text-lg font-medium">Provide & Improve Services</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Operate, maintain, and improve the Platform and its features</li>
              <li>Process marketplace transactions, payments, and escrow services</li>
              <li>Facilitate communications between users</li>
              <li>Provide customer support and respond to inquiries</li>
            </ul>
            <h3 className="text-lg font-medium">Safety & Security</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Detect, prevent, and address fraud, abuse, and security threats</li>
              <li>Enforce our Terms of Service and community guidelines</li>
              <li>Verify user identity and age for compliance purposes</li>
              <li>Monitor content for safety using automated tools including AI moderation</li>
            </ul>
            <h3 className="text-lg font-medium">Analytics & Research</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Analyze trends, usage patterns, and user behavior to improve the Platform</li>
              <li>Conduct research and development for new features</li>
              <li>Measure the effectiveness of content and advertising</li>
            </ul>
            <h3 className="text-lg font-medium">Personalization</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Customize your feed, recommendations, and content discovery experience</li>
              <li>Tailor marketplace suggestions based on your interests and activity</li>
              <li>Personalize notifications and alerts</li>
            </ul>
            <h3 className="text-lg font-medium">Marketing & Communications</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Send promotional communications about features, events, and offers (with your consent where required)</li>
              <li>Display relevant advertisements based on your interests and activity</li>
              <li>Send transactional emails related to your account and purchases</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">3. Legal Basis for Processing (GDPR)</h2>
            <p className="text-muted-foreground">
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, we process your personal data based on the following legal grounds:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Consent:</strong> Where you have given us explicit consent to process your data for specific purposes, such as marketing communications, location tracking, or optional cookies. You may withdraw consent at any time.</li>
              <li><strong>Performance of a Contract:</strong> Processing necessary to fulfill our obligations under our Terms of Service, including providing the Platform, processing transactions, and managing your account.</li>
              <li><strong>Legitimate Interests:</strong> Processing necessary for our legitimate interests, such as improving the Platform, preventing fraud, ensuring security, and conducting analytics, provided these interests are not overridden by your rights and freedoms.</li>
              <li><strong>Legal Obligation:</strong> Processing necessary to comply with applicable laws, regulations, legal processes, or enforceable governmental requests, including tax obligations, anti-money laundering requirements, and law enforcement requests.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">4. Information Sharing & Disclosure</h2>
            <p className="text-muted-foreground">
              We do not sell your personal information. We may share your information in the following circumstances:
            </p>
            <h3 className="text-lg font-medium">Service Providers</h3>
            <p className="text-muted-foreground">
              We share information with trusted third-party service providers who perform services on our behalf, including hosting, payment processing, email delivery, analytics, customer support, and content moderation. These providers are contractually obligated to use your data only as directed by us and in accordance with this Privacy Policy.
            </p>
            <h3 className="text-lg font-medium">Legal Requirements</h3>
            <p className="text-muted-foreground">
              We may disclose your information if required by law, subpoena, court order, or governmental regulation, or when we believe in good faith that disclosure is necessary to protect our rights, your safety, the safety of others, investigate fraud, or respond to a government request.
            </p>
            <h3 className="text-lg font-medium">Business Transfers</h3>
            <p className="text-muted-foreground">
              In the event of a merger, acquisition, reorganization, bankruptcy, or sale of all or a portion of our assets, your personal information may be transferred as part of that transaction. We will notify you via email and/or a prominent notice on the Platform of any change in ownership or uses of your personal information.
            </p>
            <h3 className="text-lg font-medium">With Your Consent</h3>
            <p className="text-muted-foreground">
              We may share your information with third parties when you have given us explicit consent to do so, such as when you choose to connect your account with a third-party service.
            </p>
            <h3 className="text-lg font-medium">Aggregated & De-identified Data</h3>
            <p className="text-muted-foreground">
              We may share aggregated or de-identified information that cannot reasonably be used to identify you, for purposes including industry analysis, research, marketing, and demographic profiling.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">5. Children's Privacy & COPPA Compliance</h2>
            <p className="text-muted-foreground">
              DAH Social takes children's privacy seriously and complies with the Children's Online Privacy Protection Act (COPPA) and similar international regulations.
            </p>
            <h3 className="text-lg font-medium">Age Requirement</h3>
            <p className="text-muted-foreground">
              DAH Social is not intended for children under 13 years of age. We do not knowingly collect, use, or disclose personal information from children under 13. If we discover that we have collected personal information from a child under 13, we will promptly delete that information from our systems.
            </p>
            <h3 className="text-lg font-medium">Parental Consent for Ages 13-17</h3>
            <p className="text-muted-foreground">
              Users between the ages of 13 and 17 require verifiable parental or guardian consent to create and maintain an account. Parents or guardians may be asked to confirm their consent via email verification, signed consent forms, or other legally acceptable methods.
            </p>
            <h3 className="text-lg font-medium">Data Minimization for Minors</h3>
            <p className="text-muted-foreground">
              For users under 18, we apply data minimization principles. We collect only the information strictly necessary to provide core Platform services and limit the use of personal data for advertising and profiling purposes. Location tracking and targeted advertising are disabled by default for minor users.
            </p>
            <h3 className="text-lg font-medium">Parental Controls</h3>
            <p className="text-muted-foreground">
              Parents and guardians of minor users have the right to: review their child's personal information; request deletion of their child's data; refuse further collection of their child's data; restrict access to certain Platform features including marketplace, live streaming, and direct messaging; and manage privacy settings on behalf of their child. To exercise these rights, please contact our Data Protection Officer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">6. Data Retention</h2>
            <h3 className="text-lg font-medium">Retention Periods</h3>
            <p className="text-muted-foreground">
              We retain your personal information for as long as your account is active or as needed to provide you with our services. Specific retention periods include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Account data: Retained for the duration of your account and up to 30 days after deletion request</li>
              <li>Transaction records: Retained for 7 years to comply with financial and tax regulations</li>
              <li>Usage logs and analytics: Retained for up to 24 months</li>
              <li>Security logs: Retained for up to 12 months</li>
              <li>Backup data: Removed from backups within 90 days of account deletion</li>
            </ul>
            <h3 className="text-lg font-medium">Account Deletion Process</h3>
            <p className="text-muted-foreground">
              You may request deletion of your account at any time through your account settings or by contacting us. Upon receiving a deletion request, we will: deactivate your account within 24 hours; begin permanent deletion of your personal data within 30 days; remove your content from public view immediately; retain only data required by law or legitimate business purposes (such as transaction records); and send you a confirmation once the deletion process is complete. Please note that some information may persist in our backups for up to 90 days and in anonymized or aggregated form indefinitely.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">7. Data Security</h2>
            <p className="text-muted-foreground">
              We implement comprehensive technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
            </p>
            <h3 className="text-lg font-medium">Encryption</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>All data transmitted between your device and our servers is encrypted using TLS 1.2 or higher</li>
              <li>Sensitive personal data is encrypted at rest using AES-256 encryption</li>
              <li>Passwords are hashed using industry-standard bcrypt algorithms and are never stored in plaintext</li>
              <li>Payment information is processed through PCI DSS-compliant payment processors</li>
            </ul>
            <h3 className="text-lg font-medium">Access Controls</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Access to personal data is restricted to authorized personnel on a need-to-know basis</li>
              <li>Multi-factor authentication is required for internal systems access</li>
              <li>Regular access reviews and audit logging are conducted</li>
              <li>Employee training on data protection and privacy practices</li>
            </ul>
            <h3 className="text-lg font-medium">Incident Response</h3>
            <p className="text-muted-foreground">
              In the event of a data breach, we will: notify affected users within 72 hours as required by GDPR and applicable state laws; notify relevant supervisory authorities as required by law; conduct a thorough investigation and implement corrective measures; and provide affected users with information about steps they can take to protect themselves. While we strive to protect your data, no method of electronic transmission or storage is completely secure. We encourage you to use strong, unique passwords and enable two-factor authentication on your account.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">8. Your Rights & Choices</h2>
            <p className="text-muted-foreground">
              Depending on your location, you may have the following rights regarding your personal information:
            </p>
            <h3 className="text-lg font-medium">GDPR Rights (EEA, UK, Switzerland)</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Right of Access:</strong> Request a copy of the personal data we hold about you</li>
              <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete personal data</li>
              <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data under certain circumstances</li>
              <li><strong>Right to Data Portability:</strong> Receive your personal data in a structured, commonly used, machine-readable format and transfer it to another controller</li>
              <li><strong>Right to Restrict Processing:</strong> Request restriction of processing of your personal data in certain situations</li>
              <li><strong>Right to Object:</strong> Object to processing of your personal data based on legitimate interests or for direct marketing purposes</li>
              <li><strong>Right to Withdraw Consent:</strong> Withdraw previously given consent at any time without affecting the lawfulness of processing based on consent before withdrawal</li>
              <li><strong>Right to Lodge a Complaint:</strong> File a complaint with your local data protection supervisory authority</li>
            </ul>
            <h3 className="text-lg font-medium">CCPA Rights (California Residents)</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected, the sources, purposes, and third parties with whom we share it</li>
              <li><strong>Right to Delete:</strong> Request deletion of your personal information, subject to certain exceptions</li>
              <li><strong>Right to Opt-Out:</strong> Opt out of the sale or sharing of your personal information (note: DAH Social does not sell personal information)</li>
              <li><strong>Right to Non-Discrimination:</strong> You will not be discriminated against for exercising any of your CCPA rights. We will not deny services, charge different prices, or provide a different quality of service based on your exercise of these rights</li>
            </ul>
            <h3 className="text-lg font-medium">Exercising Your Rights</h3>
            <p className="text-muted-foreground">
              To exercise any of these rights, you may: use the privacy controls in your account settings; contact our Data Protection Officer at the details provided below; or submit a verifiable consumer request through our Platform. We will respond to your request within 30 days (or sooner if required by applicable law). We may need to verify your identity before processing your request. If we cannot verify your identity, we may request additional information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">9. International Data Transfers</h2>
            <p className="text-muted-foreground">
              DAH Social operates globally, and your personal information may be transferred to, stored, and processed in countries other than your country of residence, including the United States and other jurisdictions where our servers and service providers are located.
            </p>
            <p className="text-muted-foreground">
              When we transfer personal data outside the EEA, UK, or Switzerland, we ensure adequate safeguards are in place, including: Standard Contractual Clauses (SCCs) approved by the European Commission; adequacy decisions by the European Commission for recipient countries; binding corporate rules for intra-group transfers; and your explicit consent where appropriate. You may request a copy of the safeguards we use for international data transfers by contacting our Data Protection Officer.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">10. Cookies & Tracking Technologies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar tracking technologies to enhance your experience on DAH Social. The types of cookies we use include:
            </p>
            <h3 className="text-lg font-medium">Essential Cookies</h3>
            <p className="text-muted-foreground">
              Required for the Platform to function properly. These include authentication cookies, security cookies, and session management cookies. These cannot be disabled.
            </p>
            <h3 className="text-lg font-medium">Performance & Analytics Cookies</h3>
            <p className="text-muted-foreground">
              Help us understand how users interact with the Platform by collecting anonymized usage data. These cookies allow us to measure and improve Platform performance.
            </p>
            <h3 className="text-lg font-medium">Functionality Cookies</h3>
            <p className="text-muted-foreground">
              Remember your preferences and settings, such as language, theme, and display options, to provide a personalized experience.
            </p>
            <h3 className="text-lg font-medium">Advertising & Targeting Cookies</h3>
            <p className="text-muted-foreground">
              Used to deliver relevant advertisements based on your interests and to measure advertising campaign effectiveness. These cookies may be set by our advertising partners.
            </p>
            <h3 className="text-lg font-medium">Managing Cookies</h3>
            <p className="text-muted-foreground">
              You can manage your cookie preferences through your browser settings or through our cookie consent banner. Please note that disabling certain cookies may limit your ability to use some features of the Platform. Most browsers allow you to block or delete cookies. For more information, visit your browser's help documentation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">11. Third-Party Links & Services</h2>
            <p className="text-muted-foreground">
              The Platform may contain links to third-party websites, services, and applications that are not operated by us. These include social media platforms, payment processors, analytics providers, and external marketplace sellers. We are not responsible for the privacy practices, content, or security of these third-party services.
            </p>
            <p className="text-muted-foreground">
              We encourage you to review the privacy policies of any third-party services before providing them with your personal information. When you interact with third-party integrations within our Platform (such as connecting external accounts), we will clearly disclose what information is being shared and obtain your consent before doing so.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">12. Marketing Communications</h2>
            <p className="text-muted-foreground">
              We may send you marketing communications about features, products, events, and promotions that may interest you. You have full control over the marketing communications you receive.
            </p>
            <h3 className="text-lg font-medium">Opt-Out Process</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Click the "unsubscribe" link at the bottom of any marketing email</li>
              <li>Adjust your notification preferences in your account settings</li>
              <li>Contact us directly to opt out of all marketing communications</li>
            </ul>
            <p className="text-muted-foreground">
              Please note that even after opting out of marketing communications, you will continue to receive transactional messages related to your account, security alerts, and important Platform updates that are necessary for providing our services.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">13. Changes to This Privacy Policy</h2>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technologies, legal requirements, or other factors. When we make material changes to this Privacy Policy:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>We will provide at least 30 days' advance notice before the changes take effect</li>
              <li>We will notify you via email to the address associated with your account</li>
              <li>We will post a prominent notice on the Platform</li>
              <li>We will update the "Last updated" date at the top of this policy</li>
              <li>For material changes affecting your rights, we may require you to re-consent</li>
            </ul>
            <p className="text-muted-foreground">
              We encourage you to review this Privacy Policy periodically to stay informed about how we protect your information. Your continued use of the Platform after the effective date of any changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">14. Data Protection Officer & Contact</h2>
            <p className="text-muted-foreground">
              We have appointed a Data Protection Officer (DPO) to oversee our data protection practices and ensure compliance with applicable privacy laws.
            </p>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, you may contact us through the following channels:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Data Protection Officer: privacy@dahsocial.com</li>
              <li>General Inquiries: support@dahsocial.com</li>
              <li>Platform Support: Use the in-app support and help center features</li>
              <li>Mail: DAH Social, Attn: Privacy Team, [Registered Address]</li>
            </ul>
            <p className="text-muted-foreground">
              We will acknowledge receipt of your inquiry within 48 hours and aim to respond substantively within 30 days.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">15. California Residents (CCPA Disclosures)</h2>
            <p className="text-muted-foreground">
              If you are a California resident, the California Consumer Privacy Act (CCPA) and California Privacy Rights Act (CPRA) provide you with additional rights regarding your personal information.
            </p>
            <h3 className="text-lg font-medium">Categories of Personal Information Collected</h3>
            <p className="text-muted-foreground">
              In the preceding 12 months, we have collected the following categories of personal information as defined by the CCPA: identifiers (name, email, IP address); personal information under California Civil Code Section 1798.80 (name, address, phone number); characteristics of protected classifications (age, gender); commercial information (transaction history, marketplace activity); internet or electronic network activity (browsing history, Platform interactions); geolocation data; audio, electronic, visual, or similar information (photos, videos, voice recordings); professional or employment-related information (if provided in profile); inferences drawn from the above categories.
            </p>
            <h3 className="text-lg font-medium">Sale of Personal Information</h3>
            <p className="text-muted-foreground">
              DAH Social does not sell your personal information as defined under the CCPA/CPRA. We do not exchange your personal data for monetary consideration. If we ever change this practice, we will update this policy and provide you with the right to opt out.
            </p>
            <h3 className="text-lg font-medium">Shine the Light Law</h3>
            <p className="text-muted-foreground">
              Under California's "Shine the Light" law (Civil Code Section 1798.83), California residents may request information about our disclosure of personal information to third parties for their direct marketing purposes. To make such a request, please contact our Data Protection Officer.
            </p>
            <h3 className="text-lg font-medium">Do Not Track Signals</h3>
            <p className="text-muted-foreground">
              Our Platform currently responds to "Do Not Track" browser signals. When we detect a Do Not Track signal, we limit the collection of browsing activity data used for targeted advertising purposes.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold">16. European Users (GDPR Disclosures)</h2>
            <p className="text-muted-foreground">
              If you are located in the European Economic Area (EEA), United Kingdom, or Switzerland, you have additional rights under the General Data Protection Regulation (GDPR) and equivalent local legislation.
            </p>
            <h3 className="text-lg font-medium">Data Controller</h3>
            <p className="text-muted-foreground">
              DAH Social is the data controller responsible for your personal data. Our Data Protection Officer can be reached at privacy@dahsocial.com.
            </p>
            <h3 className="text-lg font-medium">Supervisory Authority</h3>
            <p className="text-muted-foreground">
              You have the right to lodge a complaint with your local data protection supervisory authority if you believe that our processing of your personal information violates applicable data protection law. A list of EU data protection authorities is available at the European Data Protection Board website. For UK residents, you may contact the Information Commissioner's Office (ICO). For Swiss residents, you may contact the Federal Data Protection and Information Commissioner (FDPIC).
            </p>
            <h3 className="text-lg font-medium">Data Processing Agreements</h3>
            <p className="text-muted-foreground">
              We have entered into Data Processing Agreements (DPAs) with all third-party service providers who process personal data on our behalf, ensuring they meet GDPR requirements for data protection, security, and confidentiality.
            </p>
            <h3 className="text-lg font-medium">Automated Decision-Making</h3>
            <p className="text-muted-foreground">
              We may use automated decision-making, including profiling, for content moderation and fraud detection purposes. You have the right to not be subject to a decision based solely on automated processing that produces legal effects or similarly significant effects concerning you. You may request human review of any automated decisions by contacting our Data Protection Officer.
            </p>
            <h3 className="text-lg font-medium">Data Protection Impact Assessments</h3>
            <p className="text-muted-foreground">
              We conduct Data Protection Impact Assessments (DPIAs) for processing activities that are likely to result in a high risk to the rights and freedoms of individuals, in accordance with Article 35 of the GDPR.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}
