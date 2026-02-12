import { PageLayout } from "@/components/PageLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Link } from "wouter";

export default function CommunityGuidelinesPage() {
  return (
    <PageLayout>
      <div data-testid="page-community-guidelines" className="max-w-3xl mx-auto p-4 pb-24 space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Button variant="ghost" size="icon" data-testid="button-back">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold">Community Guidelines</h1>
          </div>
        </div>

        <Card className="p-6 space-y-8">
          <p className="text-muted-foreground" data-testid="text-last-updated">
            Last updated: February 2026
          </p>

          <section className="space-y-3" data-testid="section-mission">
            <h2 className="text-xl font-semibold">1. Mission & Values</h2>
            <p className="text-muted-foreground">
              DAH Social is built on the belief that everyone deserves a safe, inclusive, and empowering online community. Our mission is to connect people through authentic expression, creative collaboration, and meaningful commerce while fostering an environment of mutual respect and trust.
            </p>
            <p className="text-muted-foreground">
              We are committed to building a platform where diverse voices are heard, creators are empowered, and every user feels welcome regardless of their background, identity, or perspective. These Community Guidelines outline the standards of behavior we expect from all members of the DAH Social community.
            </p>
            <p className="text-muted-foreground">
              By joining DAH Social, you agree to uphold these values and contribute positively to our community. We ask every user to act with integrity, empathy, and accountability in all interactions on the Platform.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-communication">
            <h2 className="text-xl font-semibold">2. Respectful Communication</h2>
            <p className="text-muted-foreground">
              DAH Social is a space for open dialogue and constructive conversation. We encourage users to engage thoughtfully and respectfully with one another, even when they disagree. Healthy debate and diverse opinions are welcome, but personal attacks, insults, and hostility are not.
            </p>
            <p className="text-muted-foreground">
              When communicating on DAH Social, we expect all users to:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Treat others with dignity and respect, regardless of differences in opinion, background, or identity</li>
              <li>Engage in good-faith discussions and avoid deliberately provocative or inflammatory language</li>
              <li>Refrain from personal attacks, name-calling, or derogatory remarks directed at other users</li>
              <li>Respect the boundaries and privacy of others, including not sharing private conversations or personal information without consent</li>
              <li>Use appropriate language and tone in all public and private communications on the Platform</li>
              <li>Be receptive to feedback and willing to acknowledge mistakes or misunderstandings</li>
            </ul>
            <p className="text-muted-foreground">
              Users who consistently engage in disrespectful or toxic communication may face content removal, temporary restrictions, or account suspension depending on the severity and frequency of violations.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-prohibited-content">
            <h2 className="text-xl font-semibold">3. Prohibited Content</h2>
            <p className="text-muted-foreground">
              To maintain a safe and welcoming environment, certain types of content are strictly prohibited on DAH Social. The following categories of content are not permitted anywhere on the Platform, including posts, comments, messages, live streams, marketplace listings, profile information, and any other user-generated content.
            </p>
            <p className="text-muted-foreground">
              <strong>Hate Speech & Discrimination:</strong> Content that promotes hatred, violence, or discrimination against individuals or groups based on race, ethnicity, national origin, religion, gender, gender identity, sexual orientation, disability, age, or any other protected characteristic is strictly prohibited. This includes the use of slurs, dehumanizing language, hateful stereotypes, and symbols associated with hate groups.
            </p>
            <p className="text-muted-foreground">
              <strong>Violence & Threats:</strong> Content that threatens, glorifies, incites, or promotes violence against any individual or group is not allowed. This includes direct threats of physical harm, content depicting graphic violence for shock value, instructions for carrying out violent acts, and content that celebrates or trivializes violent events or tragedies.
            </p>
            <p className="text-muted-foreground">
              <strong>Harassment & Bullying:</strong> Targeted harassment, bullying, intimidation, or stalking of any user is prohibited. This includes repeated unwanted contact, coordinated campaigns against individuals, doxxing (publishing private personal information), revenge content, and any behavior intended to silence, intimidate, or cause distress to another person.
            </p>
            <p className="text-muted-foreground">
              <strong>Illegal Activity:</strong> Content that promotes, facilitates, or depicts illegal activities is not permitted. This includes the sale or promotion of controlled substances, weapons trafficking, fraud schemes, money laundering, human trafficking, and any other content that violates local, state, national, or international laws.
            </p>
            <p className="text-muted-foreground">
              <strong>Adult & Sexually Explicit Content:</strong> Sexually explicit content, including nudity, pornography, and sexually suggestive material, is not allowed on DAH Social. This prohibition extends to live streams, profile images, marketplace listings, and all other areas of the Platform. Content that sexualizes minors in any way is a zero-tolerance violation that will result in immediate and permanent account termination and referral to law enforcement.
            </p>
            <p className="text-muted-foreground">
              <strong>Spam & Manipulation:</strong> Spam, including repetitive posting, unsolicited commercial messages, misleading clickbait, phishing attempts, and artificially inflated engagement (such as fake likes, follows, or comments), is prohibited. Coordinated inauthentic behavior, including the operation of bot networks or engagement pods, is not allowed.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-marketplace-guidelines">
            <h2 className="text-xl font-semibold">4. Marketplace Guidelines</h2>
            <p className="text-muted-foreground">
              The DAH Mall marketplace is a trusted space for buying and selling within our community. All marketplace participants are expected to conduct themselves honestly and fairly, ensuring a positive experience for buyers and sellers alike.
            </p>
            <p className="text-muted-foreground">
              Sellers on DAH Social must adhere to the following marketplace standards:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Provide honest and accurate descriptions of all items and services, including clear photographs, condition details, and any known defects or limitations</li>
              <li>Set fair and transparent pricing that does not mislead buyers through hidden fees, deceptive discount claims, or bait-and-switch tactics</li>
              <li>Fulfill orders promptly and maintain open communication with buyers regarding shipping timelines, tracking information, and any delays</li>
              <li>Honor all return and refund commitments as described in your listings and in accordance with Platform policies</li>
              <li>Never list counterfeit, replica, or knockoff products as genuine or branded items</li>
              <li>Never list stolen property, recalled products, or items obtained through illegal means</li>
            </ul>
            <p className="text-muted-foreground">
              The following items are strictly prohibited from being listed or sold on DAH Social:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Weapons, ammunition, explosives, and weapon accessories</li>
              <li>Controlled substances, drugs, drug paraphernalia, and pharmaceuticals</li>
              <li>Counterfeit goods, replicas marketed as genuine, and items that infringe intellectual property rights</li>
              <li>Stolen property or items obtained through fraudulent means</li>
              <li>Hazardous materials, recalled products, and items that pose safety risks</li>
              <li>Adult content, sexually explicit materials, and age-restricted items</li>
              <li>Animals, animal products obtained through illegal means, and endangered species products</li>
              <li>Personal information, account credentials, and identity documents</li>
            </ul>
          </section>

          <section className="space-y-3" data-testid="section-streaming">
            <h2 className="text-xl font-semibold">5. Live Streaming Standards</h2>
            <p className="text-muted-foreground">
              Live streaming on DAH Social is a powerful way to connect with your audience in real time. Because live content reaches viewers immediately and cannot be pre-moderated, streamers bear heightened responsibility for the content they broadcast.
            </p>
            <p className="text-muted-foreground">
              All live streams must comply with these Community Guidelines and the following additional standards:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Streamers must not broadcast content that is sexually explicit, excessively violent, dangerous, or harmful to viewers</li>
              <li>Streamers must not engage in or encourage illegal activities during broadcasts</li>
              <li>Streamers are responsible for moderating their chat and removing or reporting harmful messages from viewers</li>
              <li>Streamers must not broadcast copyrighted music, movies, shows, or other protected content without proper authorization</li>
              <li>Streamers must not engage in dangerous stunts, challenges, or activities that could result in physical harm to themselves or others</li>
              <li>Streamers must clearly disclose any sponsored content, paid promotions, or affiliate relationships during their broadcasts</li>
              <li>Streamers must not use live streams to harass, target, or direct their audience against other users or individuals</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social reserves the right to terminate any live stream at any time without prior notice if the content violates these standards. Repeated violations of live streaming standards may result in permanent revocation of streaming privileges and account suspension.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-dah-coins">
            <h2 className="text-xl font-semibold">6. DAH Coins / Virtual Currency Rules</h2>
            <p className="text-muted-foreground">
              DAH Coins are a virtual currency designed to reward and incentivize positive participation within the DAH Social community. The integrity of the DAH Coins system is essential to maintaining a fair and enjoyable experience for all users.
            </p>
            <p className="text-muted-foreground">
              The following activities related to DAH Coins are strictly prohibited:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Using bots, scripts, automation tools, or any form of artificial means to earn DAH Coins</li>
              <li>Creating multiple accounts to multiply coin earnings or circumvent daily or monthly earning caps</li>
              <li>Exploiting bugs, glitches, or vulnerabilities in the Platform to gain unauthorized DAH Coins</li>
              <li>Selling, buying, trading, or exchanging DAH Coins for real-world currency, cryptocurrency, or any form of monetary value outside the Platform</li>
              <li>Transferring DAH Coins between accounts for the purpose of evading restrictions or manipulating the system</li>
              <li>Engaging in coordinated schemes with other users to artificially inflate coin earnings through fake engagement</li>
              <li>Attempting to reverse-engineer, decompile, or manipulate the DAH Coins earning algorithms or systems</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Coins have no real-world monetary value and exist solely as a platform feature. They are not a cryptocurrency, security, or financial instrument. DAH Social reserves the right to adjust, modify, reset, or discontinue DAH Coins at any time. Any violation of these rules may result in forfeiture of all accumulated DAH Coins and account suspension or termination.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-ip">
            <h2 className="text-xl font-semibold">7. Intellectual Property</h2>
            <p className="text-muted-foreground">
              DAH Social respects the intellectual property rights of all creators and content owners. Users must not upload, post, share, or distribute content that infringes on the copyrights, trademarks, patents, trade secrets, or other intellectual property rights of any third party.
            </p>
            <p className="text-muted-foreground">
              When sharing content on DAH Social, users must:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Only post content that they have created themselves or have explicit permission to share</li>
              <li>Properly attribute content to its original creator when sharing with permission</li>
              <li>Not claim ownership of content created by others</li>
              <li>Not use the DAH Social platform to distribute pirated software, media, or other copyrighted materials</li>
              <li>Respect trademark rights by not using brand names, logos, or other trademarked materials in a way that could cause confusion or imply false endorsement</li>
              <li>Comply with all applicable copyright and intellectual property laws in their jurisdiction</li>
            </ul>
            <p className="text-muted-foreground">
              If you believe your intellectual property rights have been infringed on DAH Social, please refer to our DMCA & Copyright Policy for information on how to file a takedown notice. We take all intellectual property complaints seriously and will respond promptly to valid claims.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-reporting">
            <h2 className="text-xl font-semibold">8. Reporting & Moderation</h2>
            <p className="text-muted-foreground">
              DAH Social relies on a combination of automated systems and human review to enforce these Community Guidelines. We also depend on our community members to help identify content and behavior that violates our standards. Reporting is an essential tool for maintaining a safe and positive environment.
            </p>
            <p className="text-muted-foreground">
              <strong>How to Report:</strong> Users can report content, accounts, or behavior that they believe violates these guidelines by using the report function available on posts, comments, messages, profiles, marketplace listings, and live streams. When filing a report, please provide as much context as possible, including specific details about the violation, relevant screenshots, and any additional information that may help our moderation team investigate the matter.
            </p>
            <p className="text-muted-foreground">
              <strong>Moderation Actions:</strong> When a report is received or a violation is detected, our moderation team may take one or more of the following actions depending on the severity and nature of the violation:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Content removal or restriction of visibility</li>
              <li>Issuing a formal warning to the violating user</li>
              <li>Temporary suspension of specific features or privileges (such as posting, commenting, streaming, or marketplace access)</li>
              <li>Temporary account suspension for a defined period</li>
              <li>Permanent account termination for severe or repeated violations</li>
              <li>Referral to law enforcement for illegal activity</li>
            </ul>
            <p className="text-muted-foreground">
              <strong>Appeals:</strong> Users who believe a moderation action was taken in error have the right to appeal the decision. Appeals can be submitted through the Platform's appeal process within thirty (30) days of the moderation action. Our appeals team will review the case and provide a final determination. Please note that while we strive to handle all appeals fairly, DAH Social's decisions on appeals are final and binding.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-consequences">
            <h2 className="text-xl font-semibold">9. Consequences</h2>
            <p className="text-muted-foreground">
              Violations of these Community Guidelines will result in enforcement actions proportional to the severity, frequency, and nature of the violation. DAH Social employs a graduated enforcement model designed to educate users and deter future violations while protecting the community.
            </p>
            <p className="text-muted-foreground">
              Our enforcement actions include:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li><strong>Warnings:</strong> For first-time or minor violations, users may receive a formal warning explaining the specific guideline that was violated and what is expected going forward. Warnings are recorded on the user's account history.</li>
              <li><strong>Temporary Suspensions:</strong> For repeated or moderately severe violations, users may face temporary suspension of their account or specific features. Suspension periods may range from 24 hours to 30 days depending on the circumstances.</li>
              <li><strong>Permanent Bans:</strong> Users who engage in severe violations, demonstrate a pattern of repeated violations, or whose presence on the Platform poses a risk to community safety may be permanently banned. Permanently banned users are prohibited from creating new accounts.</li>
              <li><strong>Law Enforcement Referral:</strong> For violations involving illegal activity, threats of imminent harm, child exploitation, or other criminal conduct, DAH Social will cooperate fully with law enforcement agencies and may proactively report such activity to the appropriate authorities.</li>
            </ul>
            <p className="text-muted-foreground">
              DAH Social reserves the right to take any enforcement action at any time, without prior warning, in cases where immediate action is necessary to protect the safety of our users or the integrity of the Platform. The specific enforcement action taken is at DAH Social's sole discretion based on the totality of the circumstances.
            </p>
          </section>

          <section className="space-y-3" data-testid="section-minors">
            <h2 className="text-xl font-semibold">10. Special Protections for Minors</h2>
            <p className="text-muted-foreground">
              DAH Social is committed to providing a safe online environment for younger users. We implement additional safeguards and protections for Minor Users (ages 13-17) to ensure their safety, privacy, and well-being while using the Platform.
            </p>
            <p className="text-muted-foreground">
              The following special protections apply to Minor Users:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Enhanced content filtering and moderation to limit exposure to age-inappropriate content</li>
              <li>Restricted direct messaging capabilities, with options for parental oversight and approval</li>
              <li>Limitations on live streaming, including restricted streaming hours and mandatory enhanced moderation</li>
              <li>Fifty percent (50%) of earned DAH Coins are automatically locked in a custodial account until the user turns 18</li>
              <li>Restricted marketplace participation, including limitations on transaction types and values</li>
              <li>Default privacy settings that maximize account privacy and limit public visibility</li>
              <li>Parental dashboard access allowing guardians to monitor activity, set usage limits, and manage privacy settings</li>
              <li>Prohibition from participating in certain promotional campaigns, contests, and advertising-related features</li>
            </ul>
            <p className="text-muted-foreground">
              Any content that sexualizes, exploits, or endangers minors is a zero-tolerance violation on DAH Social. We will immediately remove such content, permanently terminate the offending account, and report the activity to the National Center for Missing & Exploited Children (NCMEC) and relevant law enforcement authorities.
            </p>
            <p className="text-muted-foreground">
              We encourage parents and guardians to actively participate in their child's online experience on DAH Social. Our parental controls and guardian dashboard tools are designed to empower parents with the visibility and control they need to ensure their child's safety on the Platform.
            </p>
          </section>
        </Card>
      </div>
    </PageLayout>
  );
}