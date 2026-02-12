import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";
import { Link } from "wouter";

export default function TermsPage() {
  return (
    <PageLayout>
      <div data-testid="page-terms" className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Terms of Service</h1>
          </div>
        </div>

        <Card className="p-6 space-y-8">
          <p className="text-muted-foreground" data-testid="text-last-updated">
            Last updated: February 2026
          </p>

          <section className="space-y-3" data-testid="section-acceptance">
            <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing, browsing, or using DAH Social (the "Platform"), including any associated applications, services, features, or content, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). These Terms constitute a legally binding agreement between you ("User," "you," or "your") and DAH Social, Inc. ("DAH Social," "we," "us," or "our").
            </p>
            <p className="text-muted-foreground">
              If you do not agree to all of these Terms, you must immediately cease using the Platform. Your continued use of the Platform following any modifications to these Terms constitutes your acceptance of such changes.
            </p>
            <p className="text-muted-foreground">
              These Terms apply to all visitors, registered users, and anyone else who accesses or uses the Platform. Additional terms and conditions may apply to specific features, services, or promotions offered through the Platform, and such additional terms are hereby incorporated by reference into these Terms.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-eligibility">
            <h2 className="text-xl font-semibold">2. Eligibility & Age Requirements</h2>
            <p className="text-muted-foreground">
              You must be at least thirteen (13) years of age to create an account or use DAH Social. By using the Platform, you represent and warrant that you meet this minimum age requirement. We do not knowingly collect personal information from children under the age of 13, in compliance with the Children's Online Privacy Protection Act (COPPA).
            </p>
            <p className="text-muted-foreground">
              Users between the ages of 13 and 17 ("Minor Users") may use the Platform only with verified parental or legal guardian consent. A parent or legal guardian must review and agree to these Terms on behalf of the Minor User and is responsible for monitoring the Minor User's activity on the Platform.
            </p>
            <p className="text-muted-foreground">
              Minor Users are subject to additional protections and restrictions, including but not limited to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Fifty percent (50%) of all earned DAH Coins are automatically locked in a custodial account until the user reaches 18 years of age, intended for educational and future benefit purposes</li>
              <li>Restricted access to certain marketplace features and transaction types</li>
              <li>Enhanced content filtering and moderation for age-appropriate experiences</li>
              <li>Limitations on live streaming capabilities, including restricted streaming hours and mandatory content moderation</li>
              <li>Prohibition from participating in certain promotional campaigns and contests</li>
              <li>Parental dashboard access allowing guardians to review activity, set usage limits, and manage privacy settings</li>
            </ul>
            <p className="text-muted-foreground">
              If we discover that a user under 13 has created an account, we will promptly terminate that account and delete any associated personal information. If you believe a child under 13 has provided personal information to us, please contact us immediately so we can take appropriate action.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-account">
            <h2 className="text-xl font-semibold">3. Account Registration & Security</h2>
            <p className="text-muted-foreground">
              To access certain features of the Platform, you must register for an account by providing accurate, current, and complete information as prompted by our registration process. You agree to update your account information promptly to keep it accurate, current, and complete at all times.
            </p>
            <p className="text-muted-foreground">
              You are solely responsible for safeguarding and maintaining the confidentiality of your account credentials, including your username and password. You agree not to share your account credentials with any third party. You are fully responsible for all activities that occur under your account, whether or not you have authorized such activities.
            </p>
            <p className="text-muted-foreground">
              You agree to notify DAH Social immediately of any unauthorized use of your account or any other breach of security. DAH Social will not be liable for any loss or damage arising from your failure to comply with this section. We reserve the right to suspend or terminate accounts that we reasonably believe have been compromised, are being used fraudulently, or are in violation of these Terms.
            </p>
            <p className="text-muted-foreground">
              Each user may maintain only one (1) active account. Creating multiple accounts for the purpose of circumventing restrictions, manipulating platform features, or evading enforcement actions is strictly prohibited and may result in permanent suspension of all associated accounts.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-conduct">
            <h2 className="text-xl font-semibold">4. User Conduct & Prohibited Content</h2>
            <p className="text-muted-foreground">
              You agree to use the Platform in a manner consistent with all applicable local, state, national, and international laws and regulations. You are solely responsible for your conduct and any content that you submit, post, display, or otherwise make available on the Platform.
            </p>
            <p className="text-muted-foreground">
              You expressly agree not to engage in any of the following prohibited activities:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Posting, uploading, or sharing content that is illegal, harmful, threatening, abusive, harassing, defamatory, vulgar, obscene, or otherwise objectionable</li>
              <li>Bullying, intimidating, stalking, or threatening any other user of the Platform</li>
              <li>Impersonating any person or entity, or falsely stating or misrepresenting your affiliation with a person or entity</li>
              <li>Engaging in or facilitating fraudulent marketplace transactions, including misrepresenting item conditions, failing to deliver purchased items, or using stolen payment methods</li>
              <li>Attempting to manipulate, exploit, or abuse the DAH Coins system, including botting, scripting, or using automated tools to earn coins</li>
              <li>Uploading or distributing viruses, malware, or any other malicious code that may damage or interfere with the Platform</li>
              <li>Collecting, harvesting, or storing personal data of other users without their explicit consent</li>
              <li>Using the Platform to distribute unsolicited commercial messages (spam) or engage in phishing schemes</li>
              <li>Circumventing, disabling, or otherwise interfering with security-related features of the Platform</li>
              <li>Promoting or facilitating illegal activities, including the sale of controlled substances, weapons, or counterfeit goods</li>
              <li>Creating, sharing, or distributing content that sexualizes minors in any way</li>
              <li>Engaging in coordinated inauthentic behavior, including operating fake accounts, engagement pods, or artificial amplification schemes</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social reserves the right to investigate and take appropriate action against anyone who, in our sole discretion, violates these provisions. Such action may include removing offending content, suspending or terminating the offending user's account, and reporting the user to law enforcement authorities.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-coins">
            <h2 className="text-xl font-semibold">5. Virtual Currency (DAH Coins)</h2>
            <p className="text-muted-foreground">
              DAH Coins are a proprietary virtual currency used exclusively within the DAH Social Platform. DAH Coins have no real-world monetary value and cannot be purchased with, exchanged for, or redeemed for real currency, real-world goods, or services outside of the Platform. DAH Coins are not a cryptocurrency, digital asset, security, or financial instrument of any kind.
            </p>
            <p className="text-muted-foreground">
              DAH Coins may be earned through various platform activities, including but not limited to posting content, engaging with other users, completing quests, daily check-ins, and participating in promotional events. The following earning limits apply to all users:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Daily earning cap: 100 DAH Coins per day across all earning activities</li>
              <li>Monthly earning cap: 2,000 DAH Coins per calendar month</li>
              <li>Minor Users (ages 13-17): 50% of all earned DAH Coins are automatically locked in a custodial account until the user turns 18</li>
              <li>Locked coins cannot be spent, transferred, or withdrawn until the lock period expires</li>
              <li>DAH Coins earned through referral bonuses, special promotions, or contest winnings may be subject to separate caps and restrictions</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social reserves the right to modify, adjust, limit, or discontinue DAH Coins or any related features at any time, with or without notice. In the event of account termination for violation of these Terms, all DAH Coins associated with the terminated account will be forfeited without compensation. DAH Social shall not be liable to you or any third party for any modification, suspension, or discontinuation of DAH Coins.
            </p>
            <p className="text-muted-foreground">
              Any attempt to sell, trade, transfer, or exchange DAH Coins outside of the Platform's approved mechanisms is strictly prohibited and may result in immediate account suspension and forfeiture of all accumulated DAH Coins.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-marketplace">
            <h2 className="text-xl font-semibold">6. Marketplace (DAH Mall)</h2>
            <p className="text-muted-foreground">
              The DAH Mall is a peer-to-peer marketplace feature that enables users to list, browse, and purchase goods and services from other users on the Platform. DAH Social acts solely as a venue and facilitator for these transactions and is not a party to any transaction between buyers and sellers.
            </p>
            <p className="text-muted-foreground">
              DAH Social makes no representations or warranties regarding the quality, safety, legality, or accuracy of any item or service listed in the DAH Mall. Users transact entirely at their own risk. Sellers are solely responsible for the accuracy of their listings, the quality and condition of items sold, and compliance with all applicable consumer protection laws and regulations.
            </p>
            <p className="text-muted-foreground">
              By using the DAH Mall, you agree to the following:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Sellers must accurately describe all items and services, including any defects, limitations, or conditions</li>
              <li>Sellers must fulfill orders in a timely manner and communicate promptly with buyers regarding shipping, delays, or issues</li>
              <li>Buyers must make payments through approved Platform payment methods only</li>
              <li>All transactions are subject to the Platform's dispute resolution process</li>
              <li>DAH Social may charge transaction fees, service fees, or commissions on marketplace sales as disclosed at the time of listing</li>
              <li>Prohibited items include but are not limited to: weapons, controlled substances, counterfeit goods, stolen property, and items that violate intellectual property rights</li>
              <li>Minor Users have restricted access to marketplace features and may be limited in the types and values of transactions they can participate in</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social reserves the right to remove any listing, suspend any seller's marketplace privileges, or cancel any transaction that we determine, in our sole discretion, violates these Terms, poses a risk to user safety, or may be fraudulent.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-content">
            <h2 className="text-xl font-semibold">7. Content Ownership & License Grant</h2>
            <p className="text-muted-foreground">
              You retain full ownership of all content that you create, upload, post, or otherwise make available on the Platform ("User Content"). DAH Social does not claim ownership over your User Content.
            </p>
            <p className="text-muted-foreground">
              By posting User Content on the Platform, you grant DAH Social a non-exclusive, worldwide, royalty-free, sublicensable, and transferable license to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, perform, and display such User Content in connection with operating, providing, promoting, and improving the Platform and its services. This license continues even if you stop using the Platform, but only for content that has been shared with other users or made public.
            </p>
            <p className="text-muted-foreground">
              You represent and warrant that you own or have the necessary rights, licenses, consents, and permissions to grant the foregoing license and that your User Content does not infringe, misappropriate, or violate any third party's intellectual property rights, privacy rights, publicity rights, or other personal or proprietary rights. You are solely responsible for your User Content and the consequences of posting or publishing it.
            </p>
            <p className="text-muted-foreground">
              DAH Social reserves the right, but has no obligation, to monitor, review, or remove User Content at our sole discretion and without notice, for any reason, including content that we believe violates these Terms or may be harmful, offensive, or otherwise objectionable.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-streaming">
            <h2 className="text-xl font-semibold">8. Live Streaming Rules</h2>
            <p className="text-muted-foreground">
              DAH Social offers live streaming functionality that allows users to broadcast real-time video and audio content to other users on the Platform. All live streaming activities are subject to these Terms and the following additional rules and guidelines.
            </p>
            <p className="text-muted-foreground">
              Users who engage in live streaming agree to the following:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>All live stream content must comply with the User Conduct & Prohibited Content provisions outlined in Section 4 of these Terms</li>
              <li>Streamers must not broadcast content that is sexually explicit, violent, dangerous, or harmful, including content that encourages self-harm or illegal activities</li>
              <li>Streamers must not broadcast copyrighted music, movies, television shows, or other protected content without proper authorization</li>
              <li>Streamers are responsible for all content that appears in their live streams, including content from guests, chat participants, and background media</li>
              <li>Minor Users are subject to additional live streaming restrictions, including limited streaming hours and mandatory enhanced content moderation</li>
              <li>Viewer interactions during live streams, including comments, tips, and virtual gifts, are subject to these Terms and community guidelines</li>
              <li>DAH Social reserves the right to interrupt, terminate, or remove any live stream at any time, without prior notice, for any violation of these Terms</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social may record, store, and make available replays of live stream content for a limited period. By using the live streaming feature, you consent to the recording and replay of your streams. Repeated violations of live streaming rules may result in permanent revocation of streaming privileges and account suspension.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-ip">
            <h2 className="text-xl font-semibold">9. Intellectual Property & DMCA</h2>
            <p className="text-muted-foreground">
              The Platform, including its design, features, functionality, code, graphics, logos, trademarks, and all other proprietary materials ("DAH Social Content"), is owned by DAH Social, Inc. and is protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws. You may not copy, modify, distribute, sell, or lease any part of the DAH Social Content without our express written permission.
            </p>
            <p className="text-muted-foreground">
              DAH Social respects the intellectual property rights of others and expects users of the Platform to do the same. In accordance with the Digital Millennium Copyright Act ("DMCA"), we will respond promptly to notices of alleged copyright infringement that comply with the DMCA and are properly submitted to our designated copyright agent.
            </p>
            <p className="text-muted-foreground">
              If you believe that your copyrighted work has been copied or used in a way that constitutes copyright infringement on the Platform, please provide our DMCA agent with the following information:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>A physical or electronic signature of the copyright owner or a person authorized to act on their behalf</li>
              <li>Identification of the copyrighted work claimed to have been infringed</li>
              <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material on the Platform</li>
              <li>Your contact information, including your address, telephone number, and email address</li>
              <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law</li>
              <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the copyright owner</li>
            </ul>
            <p className="text-muted-foreground">
              Upon receipt of a valid DMCA notice, DAH Social will remove or disable access to the allegedly infringing material and notify the user who posted the content. Users who repeatedly infringe the intellectual property rights of others may have their accounts terminated in accordance with our repeat infringer policy.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-privacy">
            <h2 className="text-xl font-semibold">10. Privacy</h2>
            <p className="text-muted-foreground">
              Your privacy is important to us. Our collection, use, and disclosure of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. By using the Platform, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.
            </p>
            <p className="text-muted-foreground">
              We encourage you to review our Privacy Policy regularly to stay informed about how we protect and use your personal information. Our Privacy Policy describes the types of information we collect, how we use and share that information, and the choices you have regarding your information. You can access our Privacy Policy at any time through the Platform.
            </p>
            <p className="text-muted-foreground">
              By using the Platform, you acknowledge that internet-based data transmissions are inherently insecure and that we cannot guarantee the security or privacy of data transmitted to or from the Platform. Any information you transmit to the Platform is done at your own risk.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-third-party">
            <h2 className="text-xl font-semibold">11. Third-Party Services</h2>
            <p className="text-muted-foreground">
              The Platform may contain links to third-party websites, applications, services, or advertisements that are not owned or controlled by DAH Social. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.
            </p>
            <p className="text-muted-foreground">
              Your interactions with third-party services, including payment processors, advertisers, and external applications integrated with the Platform, are solely between you and the third party. DAH Social is not responsible or liable for any loss, damage, or harm of any kind arising from your dealings with third parties or from the presence of third-party content, links, or advertisements on the Platform.
            </p>
            <p className="text-muted-foreground">
              We strongly advise you to read the terms and conditions and privacy policies of any third-party websites or services that you visit or interact with through the Platform. Your use of third-party services is at your own risk and subject to the terms and conditions of those third parties.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-disclaimers">
            <h2 className="text-xl font-semibold">12. Disclaimers & Limitation of Liability</h2>
            <p className="text-muted-foreground">
              THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. DAH SOCIAL EXPRESSLY DISCLAIMS ALL WARRANTIES, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.
            </p>
            <p className="text-muted-foreground">
              DAH Social does not warrant that the Platform will be uninterrupted, error-free, secure, or free of viruses or other harmful components. We do not warrant the accuracy, completeness, or reliability of any content, information, or materials available on or through the Platform, including User Content and marketplace listings.
            </p>
            <p className="text-muted-foreground">
              TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL DAH SOCIAL, ITS OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, AFFILIATES, SUCCESSORS, OR ASSIGNS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, GOODWILL, DATA, USE, OR OTHER INTANGIBLE LOSSES, REGARDLESS OF WHETHER SUCH DAMAGES ARE BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), STRICT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT DAH SOCIAL HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
            </p>
            <p className="text-muted-foreground">
              IN NO EVENT SHALL DAH SOCIAL'S TOTAL AGGREGATE LIABILITY TO YOU FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THE USE OF OR INABILITY TO USE THE PLATFORM EXCEED THE GREATER OF (A) THE AMOUNT YOU HAVE PAID TO DAH SOCIAL IN THE TWELVE (12) MONTHS PRIOR TO THE EVENT GIVING RISE TO THE LIABILITY, OR (B) ONE HUNDRED DOLLARS ($100.00).
            </p>
          </section>

          <section className="space-y-3" data-testid="section-indemnification">
            <h2 className="text-xl font-semibold">13. Indemnification</h2>
            <p className="text-muted-foreground">
              You agree to defend, indemnify, and hold harmless DAH Social, Inc., its officers, directors, employees, agents, licensors, affiliates, successors, and assigns from and against any and all claims, damages, obligations, losses, liabilities, costs, or expenses (including but not limited to reasonable attorneys' fees and court costs) arising from or related to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Your use of and access to the Platform</li>
              <li>Your violation of any provision of these Terms</li>
              <li>Your violation of any third-party right, including any intellectual property, privacy, publicity, or other proprietary right</li>
              <li>Any User Content you post, upload, or otherwise make available on the Platform</li>
              <li>Your marketplace transactions, including any disputes between buyers and sellers</li>
              <li>Any claim that your User Content caused damage to a third party</li>
              <li>Your violation of any applicable law, rule, or regulation</li>
            </ul>
            <p className="text-muted-foreground">
              This indemnification obligation will survive the termination or expiration of these Terms and your use of the Platform. DAH Social reserves the right, at its own expense, to assume the exclusive defense and control of any matter otherwise subject to indemnification by you, in which event you will fully cooperate with DAH Social in asserting any available defenses.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-disputes">
            <h2 className="text-xl font-semibold">14. Dispute Resolution & Arbitration</h2>
            <p className="text-muted-foreground">
              PLEASE READ THIS SECTION CAREFULLY. IT AFFECTS YOUR LEGAL RIGHTS, INCLUDING YOUR RIGHT TO FILE A LAWSUIT IN COURT AND TO HAVE A JURY TRIAL.
            </p>
            <p className="text-muted-foreground">
              You and DAH Social agree that any dispute, claim, or controversy arising out of or relating to these Terms, the Platform, or your use of the Platform (collectively, "Disputes") will be resolved through binding individual arbitration rather than in court, except that either party may seek injunctive or other equitable relief in a court of competent jurisdiction to prevent the actual or threatened infringement, misappropriation, or violation of intellectual property rights.
            </p>
            <p className="text-muted-foreground">
              Arbitration will be conducted by the American Arbitration Association ("AAA") under its Consumer Arbitration Rules, as modified by these Terms. The arbitration will be conducted in English and held in the state of Delaware, unless you and DAH Social agree to a different location. The arbitrator's decision will be final and binding, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction.
            </p>
            <p className="text-muted-foreground">
              CLASS ACTION WAIVER: YOU AND DAH SOCIAL AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS, CONSOLIDATED, OR REPRESENTATIVE ACTION. Unless both you and DAH Social agree otherwise, the arbitrator may not consolidate more than one person's claims and may not otherwise preside over any form of a representative or class proceeding.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-modifications">
            <h2 className="text-xl font-semibold">15. Modifications to Terms</h2>
            <p className="text-muted-foreground">
              DAH Social reserves the right to modify, amend, or update these Terms at any time, at our sole discretion. When we make material changes to these Terms, we will notify you by updating the "Last updated" date at the top of these Terms and, where appropriate, by providing additional notice through the Platform such as an in-app notification, email, or prominent banner.
            </p>
            <p className="text-muted-foreground">
              Your continued use of the Platform after the effective date of any modifications to these Terms constitutes your acceptance of the modified Terms. If you do not agree to the modified Terms, you must stop using the Platform and may close your account. It is your responsibility to review these Terms periodically for changes.
            </p>
            <p className="text-muted-foreground">
              For material changes that significantly affect your rights or obligations, we will make reasonable efforts to provide at least thirty (30) days' advance notice before the new terms take effect. During this notice period, you may choose to close your account if you do not agree with the upcoming changes.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-governing-law">
            <h2 className="text-xl font-semibold">16. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms and any dispute arising out of or related to these Terms or the Platform shall be governed by and construed in accordance with the laws of the State of Delaware, United States of America, without regard to its conflict of law principles.
            </p>
            <p className="text-muted-foreground">
              To the extent that any lawsuit or court proceeding is permitted under these Terms (including for injunctive relief as described in Section 14), you and DAH Social agree to submit to the exclusive personal jurisdiction and venue of the state and federal courts located in Wilmington, Delaware. You waive any objection to jurisdiction and venue in such courts.
            </p>
            <p className="text-muted-foreground">
              These Terms shall not be governed by the United Nations Convention on Contracts for the International Sale of Goods, and the application of the Uniform Computer Information Transactions Act (UCITA) is expressly excluded.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-severability">
            <h2 className="text-xl font-semibold">17. Severability</h2>
            <p className="text-muted-foreground">
              If any provision of these Terms is held to be invalid, illegal, or unenforceable by a court of competent jurisdiction, such provision shall be modified to the minimum extent necessary to make it valid, legal, and enforceable while preserving its original intent. If such modification is not possible, the provision shall be severed from these Terms.
            </p>
            <p className="text-muted-foreground">
              The invalidity, illegality, or unenforceability of any provision shall not affect the validity, legality, or enforceability of any other provision of these Terms, and all remaining provisions shall continue in full force and effect. The failure of DAH Social to exercise or enforce any right or provision of these Terms shall not constitute a waiver of such right or provision.
            </p>
            <p className="text-muted-foreground">
              These Terms, together with our Privacy Policy and any other legal notices or agreements published by DAH Social on the Platform, constitute the entire agreement between you and DAH Social concerning the Platform and supersede all prior or contemporaneous communications, proposals, and agreements, whether oral or written, between you and DAH Social regarding the Platform.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-contact">
            <h2 className="text-xl font-semibold">18. Contact Information</h2>
            <p className="text-muted-foreground">
              If you have any questions, concerns, or feedback regarding these Terms of Service, please contact us through any of the following channels:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>In-App Support: Use the help and support features available within the DAH Social application</li>
              <li>Email: legal@dahsocial.com</li>
              <li>Mailing Address: DAH Social, Inc., Attn: Legal Department</li>
            </ul>
            <p className="text-muted-foreground">
              For DMCA-related inquiries and copyright infringement notices, please direct your correspondence to our designated copyright agent at dmca@dahsocial.com. We aim to respond to all inquiries within five (5) business days.
            </p>
            <p className="text-muted-foreground">
              For urgent matters related to account security, safety concerns, or the reporting of illegal content, please use the in-app reporting tools for the fastest response, or contact our Trust & Safety team directly at safety@dahsocial.com.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}
