import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ScrollText } from "lucide-react";
import { Link } from "wouter";

export default function DMCAPage() {
  return (
    <PageLayout>
      <div data-testid="page-dmca" className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <ScrollText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">DMCA & Copyright Policy</h1>
          </div>
        </div>

        <Card className="p-6 space-y-8">
          <p className="text-muted-foreground" data-testid="text-last-updated">
            Last updated: February 2026
          </p>

          <section className="space-y-3" data-testid="section-overview">
            <h2 className="text-xl font-semibold">1. DMCA Overview</h2>
            <p className="text-muted-foreground">
              DAH Social, Inc. ("DAH Social," "we," "us," or "our") respects the intellectual property rights of others and expects all users of the Platform to do the same. In accordance with the Digital Millennium Copyright Act of 1998 ("DMCA"), Title 17, United States Code, Section 512, we have implemented procedures for receiving and responding to notifications of claimed copyright infringement.
            </p>
            <p className="text-muted-foreground">
              This DMCA & Copyright Policy describes how copyright owners can submit takedown notices when they believe their copyrighted works have been infringed on the DAH Social platform, and how affected users can submit counter-notifications if they believe content was removed in error.
            </p>
            <p className="text-muted-foreground">
              DAH Social acts as an online service provider and hosts user-generated content. We do not monitor, review, or edit user content prior to posting. However, upon receiving a valid DMCA takedown notice, we will promptly remove or disable access to the allegedly infringing material and take appropriate action against repeat infringers in accordance with the DMCA and our internal policies.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-takedown">
            <h2 className="text-xl font-semibold">2. Filing a DMCA Takedown Notice</h2>
            <p className="text-muted-foreground">
              If you are a copyright owner, or are authorized to act on behalf of a copyright owner, and you believe that your copyrighted work has been copied, used, or distributed on the DAH Social platform in a way that constitutes copyright infringement, you may submit a written DMCA takedown notice to our designated copyright agent.
            </p>
            <p className="text-muted-foreground">
              Your DMCA takedown notice must include all of the following elements to be considered valid under 17 U.S.C. Section 512(c)(3):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>A physical or electronic signature of the copyright owner or a person authorized to act on behalf of the copyright owner</li>
              <li>Identification of the copyrighted work claimed to have been infringed, or if multiple copyrighted works are covered by a single notification, a representative list of such works</li>
              <li>Identification of the material that is claimed to be infringing or to be the subject of infringing activity, and information reasonably sufficient to permit DAH Social to locate the material on the Platform (such as the URL or direct link to the content)</li>
              <li>Information reasonably sufficient to permit DAH Social to contact the complaining party, including your name, mailing address, telephone number, and email address</li>
              <li>A statement that the complaining party has a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that the complaining party is authorized to act on behalf of the owner of an exclusive right that is allegedly infringed</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Designated Copyright Agent:</strong> DMCA takedown notices should be sent to our designated copyright agent at the following address:
            </p>
            <p className="text-muted-foreground ml-4">
              DAH Social, Inc.<br />
              Attn: DMCA Copyright Agent<br />
              Email: dmca@dahsocial.com<br />
              Subject Line: DMCA Takedown Notice
            </p>
            <p className="text-muted-foreground">
              Please note that under 17 U.S.C. Section 512(f), any person who knowingly makes material misrepresentations in a DMCA takedown notice may be subject to liability for damages, including costs and attorneys' fees, incurred by the alleged infringer or by DAH Social.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-counter-notification">
            <h2 className="text-xl font-semibold">3. Counter-Notification Process</h2>
            <p className="text-muted-foreground">
              If you believe that your content was removed or disabled as a result of a mistake or misidentification of the material to be removed or disabled, you may submit a written counter-notification to our designated copyright agent. The counter-notification process is designed to protect users whose content has been wrongfully removed due to an erroneous or fraudulent DMCA takedown notice.
            </p>
            <p className="text-muted-foreground">
              Your counter-notification must include all of the following elements to be considered valid under 17 U.S.C. Section 512(g):
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Your physical or electronic signature</li>
              <li>Identification of the material that has been removed or to which access has been disabled, and the location at which the material appeared before it was removed or disabled</li>
              <li>A statement under penalty of perjury that you have a good faith belief that the material was removed or disabled as a result of mistake or misidentification of the material</li>
              <li>Your name, address, and telephone number, and a statement that you consent to the jurisdiction of the Federal District Court for the judicial district in which your address is located (or if you reside outside the United States, the jurisdiction of any judicial district in which DAH Social may be found), and that you will accept service of process from the person who provided the original DMCA notification or an agent of such person</li>
            </ul>
            <p className="text-muted-foreground">
              Upon receipt of a valid counter-notification, DAH Social will promptly forward a copy of the counter-notification to the original complaining party. The original complaining party then has ten (10) business days to file an action seeking a court order to restrain the user from engaging in the allegedly infringing activity. If no such court action is filed within the 10-business-day period, DAH Social will restore the removed material within ten (10) to fourteen (14) business days after receiving the counter-notification.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-repeat-infringer">
            <h2 className="text-xl font-semibold">4. Repeat Infringer Policy</h2>
            <p className="text-muted-foreground">
              In accordance with the DMCA and our commitment to protecting intellectual property rights, DAH Social maintains a strict repeat infringer policy. We will terminate, in appropriate circumstances, the accounts of users who are determined to be repeat infringers of copyrighted works.
            </p>
            <p className="text-muted-foreground">
              Our repeat infringer policy operates as follows:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>First Offense:</strong> Upon receipt of the first valid DMCA takedown notice, the infringing material will be removed and the user will receive a formal copyright strike and warning notification explaining the violation</li>
              <li><strong>Second Offense:</strong> Upon receipt of a second valid DMCA takedown notice within a twelve (12) month period, the infringing material will be removed, the user will receive a second copyright strike, and their account may be temporarily suspended for up to thirty (30) days</li>
              <li><strong>Third Offense:</strong> Upon receipt of a third valid DMCA takedown notice within a twelve (12) month period, the user's account will be permanently terminated and the user will be prohibited from creating new accounts on the Platform</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social reserves the right to terminate accounts with fewer than three strikes in cases involving willful, egregious, or commercial-scale infringement. Copyright strikes that are successfully contested through the counter-notification process or withdrawn by the original claimant will be removed from the user's record.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-good-faith">
            <h2 className="text-xl font-semibold">5. Good Faith Requirements</h2>
            <p className="text-muted-foreground">
              Both DMCA takedown notices and counter-notifications must be submitted in good faith. The DMCA provides legal consequences for filing fraudulent or bad-faith notices.
            </p>
            <p className="text-muted-foreground">
              Under 17 U.S.C. Section 512(f), any person who knowingly materially misrepresents that material or activity is infringing, or that material was removed or disabled by mistake or misidentification, may be subject to liability for damages. This means that if you file a DMCA takedown notice or counter-notification without a genuine belief that infringement has occurred (or that a mistake was made), you could be held legally liable for any resulting damages, including attorneys' fees and court costs.
            </p>
            <p className="text-muted-foreground">
              DAH Social encourages all parties to carefully consider whether they have a valid claim before submitting any DMCA-related notice. We recommend consulting with a qualified intellectual property attorney if you are uncertain about whether your claim is valid. Abusing the DMCA process to silence criticism, remove competing content, or harass other users is a violation of our Community Guidelines and may result in account termination.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-contact">
            <h2 className="text-xl font-semibold">6. Contact for DMCA Issues</h2>
            <p className="text-muted-foreground">
              If you have questions about this DMCA & Copyright Policy, need assistance filing a takedown notice or counter-notification, or have other copyright-related concerns, please contact our designated copyright agent:
            </p>
            <p className="text-muted-foreground ml-4">
              DAH Social, Inc.<br />
              Attn: DMCA Copyright Agent<br />
              Email: dmca@dahsocial.com
            </p>
            <p className="text-muted-foreground">
              For general intellectual property inquiries that are not related to DMCA takedown requests, you may also contact our legal team at legal@dahsocial.com. We are committed to addressing all copyright concerns promptly and fairly, and we strive to respond to all valid DMCA takedown notices within two (2) business days of receipt.
            </p>
            <p className="text-muted-foreground">
              Please note that DMCA takedown notices and counter-notifications are legal documents. We strongly recommend that you consult with an attorney before submitting either type of notice, as there are legal penalties for filing false or misleading notices under the DMCA.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}