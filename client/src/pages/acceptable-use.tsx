import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Gavel } from "lucide-react";
import { Link } from "wouter";

export default function AcceptableUsePage() {
  return (
    <PageLayout>
      <div data-testid="page-acceptable-use" className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Gavel className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Acceptable Use Policy</h1>
          </div>
        </div>

        <Card className="p-6 space-y-8">
          <p className="text-muted-foreground" data-testid="text-last-updated">
            Last updated: February 2026
          </p>

          <section className="space-y-3" data-testid="section-permitted-uses">
            <h2 className="text-xl font-semibold">1. Permitted Uses</h2>
            <p className="text-muted-foreground">
              DAH Social ("the Platform") is designed to provide users with a rich social experience that includes content creation and sharing, community interaction, live streaming, marketplace commerce, and virtual currency participation. This Acceptable Use Policy ("AUP") defines the boundaries of acceptable and prohibited behavior on the Platform.
            </p>
            <p className="text-muted-foreground">
              Users are permitted and encouraged to use the Platform for the following purposes:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Creating, sharing, and engaging with original content including text posts, images, videos, and live streams</li>
              <li>Building and participating in communities, groups, and avenues centered around shared interests</li>
              <li>Buying and selling goods and services through the DAH Mall marketplace in compliance with marketplace policies</li>
              <li>Earning and spending DAH Coins through legitimate platform activities as described in our Terms of Service</li>
              <li>Communicating with other users through direct messages, comments, and public interactions</li>
              <li>Discovering content, products, events, and communities through search and discovery features</li>
              <li>Personalizing your profile, preferences, and experience to suit your interests</li>
              <li>Participating in platform events, quests, challenges, and promotional activities</li>
            </ul>
            <p className="text-muted-foreground">
              All permitted uses are subject to these Terms of Service, Community Guidelines, and all other applicable Platform policies. Users must use the Platform in compliance with all applicable local, state, national, and international laws and regulations.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-prohibited-activities">
            <h2 className="text-xl font-semibold">2. Prohibited Activities</h2>
            <p className="text-muted-foreground">
              The following activities are strictly prohibited on DAH Social. Engaging in any of these activities may result in immediate enforcement action, including content removal, account suspension, or permanent termination, depending on the severity of the violation.
            </p>
            <p className="text-muted-foreground">
              <strong>System Abuse:</strong> Users must not attempt to disrupt, overload, or impair the functionality of the Platform or its infrastructure. This includes, but is not limited to, launching denial-of-service (DoS) or distributed denial-of-service (DDoS) attacks, attempting to crash or destabilize servers, exploiting vulnerabilities or bugs for unauthorized access or advantage, and any action that degrades the performance or availability of the Platform for other users.
            </p>
            <p className="text-muted-foreground">
              <strong>Scraping & Data Harvesting:</strong> Automated or manual scraping, crawling, harvesting, or extraction of data from the Platform is strictly prohibited without prior written authorization from DAH Social. This includes collecting user profiles, posts, listings, email addresses, or any other user-generated or platform-generated data for any purpose, whether commercial or non-commercial.
            </p>
            <p className="text-muted-foreground">
              <strong>Bots & Automation:</strong> The use of unauthorized bots, automated scripts, browser extensions, or third-party tools to interact with the Platform is prohibited. This includes auto-posting, auto-liking, auto-following, auto-commenting, auto-messaging, coin farming, and any other automated activity that simulates human interaction without express written permission from DAH Social.
            </p>
            <p className="text-muted-foreground">
              <strong>Spam:</strong> Unsolicited or repetitive content distribution, including bulk messaging, repetitive posting of identical or substantially similar content, chain messages, pyramid schemes, and unsolicited commercial promotions, is prohibited. This applies to all areas of the Platform including posts, comments, direct messages, marketplace listings, and live stream chats.
            </p>
            <p className="text-muted-foreground">
              <strong>Impersonation:</strong> Creating accounts, profiles, or content that impersonates or misrepresents your identity, affiliation, or association with any person, organization, or entity is prohibited. This includes creating fake accounts that mimic real individuals, using another person's name, image, or likeness without authorization, and pretending to represent a brand, company, or organization without legitimate authority to do so.
            </p>
            <p className="text-muted-foreground">
              <strong>Fraud:</strong> Any fraudulent, deceptive, or misleading activity is strictly prohibited. This includes payment fraud, marketplace fraud (such as selling counterfeit goods, failing to deliver purchased items, or misrepresenting item conditions), phishing schemes, social engineering attacks, identity theft, and any other conduct intended to deceive or defraud other users or DAH Social.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-network-security">
            <h2 className="text-xl font-semibold">3. Network & Security Rules</h2>
            <p className="text-muted-foreground">
              Users must not engage in any activity that compromises the security, integrity, or availability of the DAH Social platform, its infrastructure, or its users' data. The following security-related activities are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Attempting to gain unauthorized access to any part of the Platform, other user accounts, or DAH Social's computer systems or networks</li>
              <li>Probing, scanning, or testing the vulnerability of the Platform or any network connected to the Platform without written authorization</li>
              <li>Breaching or circumventing any security or authentication measures implemented on the Platform</li>
              <li>Intercepting, monitoring, or altering network traffic to or from the Platform without authorization</li>
              <li>Uploading, transmitting, or distributing viruses, worms, trojans, ransomware, spyware, adware, or any other malicious software or code</li>
              <li>Using the Platform to facilitate or participate in any cyberattack against third-party systems or networks</li>
              <li>Reverse-engineering, decompiling, disassembling, or otherwise attempting to discover the source code, algorithms, or architecture of the Platform</li>
              <li>Tampering with, modifying, or creating derivative works of the Platform's software, technology, or infrastructure</li>
            </ul>
            <p className="text-muted-foreground">
              If you discover a security vulnerability on the Platform, we encourage you to report it responsibly to our security team at security@dahsocial.com. Do not exploit, disclose publicly, or share details of the vulnerability with third parties before it has been addressed. DAH Social may, at its discretion, offer recognition or rewards for responsibly disclosed vulnerabilities.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-api-usage">
            <h2 className="text-xl font-semibold">4. API Usage</h2>
            <p className="text-muted-foreground">
              If DAH Social provides access to application programming interfaces (APIs), such access is subject to the following rules and any additional API-specific terms, documentation, or guidelines provided by DAH Social.
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>API access requires valid authentication credentials (API keys, tokens, or OAuth credentials) issued by DAH Social. Credentials must be kept confidential and must not be shared with unauthorized third parties.</li>
              <li>API usage is subject to rate limits, quotas, and usage restrictions as specified in the API documentation. Exceeding these limits may result in throttling, temporary suspension, or revocation of API access.</li>
              <li>API access must be used solely for the purposes described in the API documentation and in compliance with these Terms and this Acceptable Use Policy.</li>
              <li>Data obtained through the API must be handled in accordance with DAH Social's Privacy Policy and all applicable data protection laws and regulations.</li>
              <li>Users must not use the API to build applications or services that compete directly with core DAH Social features or that replicate the Platform's functionality.</li>
              <li>DAH Social reserves the right to modify, suspend, or terminate API access at any time, with or without notice, for any reason.</li>
            </ul>
            <p className="text-muted-foreground">
              Unauthorized or excessive use of APIs, including circumventing rate limits, using undocumented endpoints, or accessing APIs in violation of these terms, may result in immediate revocation of API access and further enforcement action against the user's account.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-enforcement">
            <h2 className="text-xl font-semibold">5. Enforcement Actions</h2>
            <p className="text-muted-foreground">
              DAH Social reserves the right to investigate and take enforcement action against any user who violates this Acceptable Use Policy. Enforcement actions are applied at DAH Social's sole discretion and are proportional to the severity, intent, and impact of the violation.
            </p>
            <p className="text-muted-foreground">
              Enforcement actions may include one or more of the following:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Issuing a formal warning with a detailed explanation of the violation and expected corrective behavior</li>
              <li>Removing or restricting access to specific content that violates this policy</li>
              <li>Temporarily suspending account access or specific platform features for a defined period</li>
              <li>Permanently terminating the user's account and revoking all associated privileges</li>
              <li>Forfeiture of all accumulated DAH Coins and marketplace balances associated with the account</li>
              <li>Revoking API access and associated credentials</li>
              <li>Reporting illegal activity to appropriate law enforcement authorities</li>
              <li>Pursuing legal remedies, including injunctive relief and monetary damages, for violations that cause harm to DAH Social, its users, or its infrastructure</li>
            </ul>
            <p className="text-muted-foreground">
              Users who are subject to enforcement actions will generally be notified of the action taken and the reason for the action. However, DAH Social is not obligated to provide advance notice before taking enforcement action, particularly in cases involving imminent threats to user safety, platform integrity, or illegal activity.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-reporting-violations">
            <h2 className="text-xl font-semibold">6. Reporting Violations</h2>
            <p className="text-muted-foreground">
              DAH Social relies on the active participation of our community members to identify and report violations of this Acceptable Use Policy. If you encounter any activity that you believe violates this policy, we encourage you to report it promptly so that our team can investigate and take appropriate action.
            </p>
            <p className="text-muted-foreground">
              You can report violations through the following channels:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>In-App Reporting:</strong> Use the report function available on posts, comments, messages, profiles, marketplace listings, and live streams to flag content or behavior that violates this policy</li>
              <li><strong>Email:</strong> Send a detailed report to abuse@dahsocial.com with as much context as possible, including URLs, screenshots, and a description of the violation</li>
              <li><strong>Security Issues:</strong> Report security vulnerabilities or cybersecurity-related concerns to security@dahsocial.com</li>
            </ul>
            <p className="text-muted-foreground">
              When submitting a report, please include as much relevant information as possible to help our team investigate effectively. This may include the username of the violating party, links to the offending content, timestamps, screenshots, and a description of how the activity violates this policy.
            </p>
            <p className="text-muted-foreground">
              All reports are reviewed by our trust and safety team. We take every report seriously and will investigate reported violations promptly. While we cannot guarantee a specific outcome for every report, we are committed to maintaining a safe and fair Platform for all users. Retaliation against users who report violations in good faith is strictly prohibited and may itself result in enforcement action.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}