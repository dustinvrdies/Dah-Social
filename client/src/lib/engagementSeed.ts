import { lsGet, lsSet } from "./storage";
import type { Post } from "./postTypes";
import type { ReactionType } from "./reactions";
import type { Comment, EngagementState } from "./engagement";

export const ENGAGEMENT_SEED_VERSION = 1;

const VERSION_KEY = "dah.engagement.seed.version";
const ENGAGEMENT_KEY = "dah.engagement";
const REACTIONS_KEY = (postId: string) => `dah.reactions.${postId}`;

const BOT_USERNAMES = [
  "maya_creates",
  "techie_marcus",
  "sarah_thrifts",
  "alex_trades",
  "jenna_vintage",
  "mike_flips",
];

const GENERATED_USERNAMES = [
  "chloe_picks", "devonte_99", "luna.star", "raj_deals", "emma_grove",
  "z_hunter", "niko_trades", "tasha_m", "jordan_lex", "priya_sells",
  "cozy_carl", "mia_dawn", "dex_market", "sophie_rue", "kai_waves",
  "rina_flow", "oscar_flip", "hana_pop", "leo_crisp", "ivy_lane",
  "benny_hustle", "clara_gem", "finn_swift", "nova_ink", "ty_brooke",
  "zara_mint", "reese_wild", "jade_sky", "pax_wood", "miles_true",
  "ari_blue", "cass_bright", "drew_edge", "ellie_sun", "gus_craft",
  "isla_drift", "jax_bold", "kira_nest", "lou_peak", "max_shade",
  "nell_frost", "olive_reed", "quinn_spark", "sage_trail", "tess_glow",
];

const ALL_USERNAMES = [...BOT_USERNAMES, ...GENERATED_USERNAMES];

const COMMENT_TEMPLATES = [
  "This is amazing!",
  "Love this so much",
  "Where did you find this?",
  "Need this in my life",
  "Wow, great price",
  "How much for shipping?",
  "Is this still available?",
  "Just ordered one, thanks!",
  "This is a steal",
  "Following for updates",
  "Obsessed with this",
  "My friend needs to see this",
  "Can you hold this for me?",
  "Do you ship internationally?",
  "What condition is it in?",
  "I had one of these growing up",
  "Nostalgia hits different",
  "Take my money already",
  "Been looking for this everywhere",
  "Great find!",
  "Added to my wishlist",
  "This community is the best",
  "Quality content right here",
  "Anyone else refreshing constantly?",
  "Deal of the day for sure",
  "Underrated post",
  "This deserves more attention",
  "Saving this for later",
  "Can vouch, great seller",
  "W post",
  "Fire content as always",
  "The vibes are immaculate",
  "Instant follow from me",
  "This is why I love this app",
  "Dropping a comment to boost this",
  "Legit one of the best I have seen",
  "How did I miss this earlier?",
  "Exactly what I was searching for",
  "Clean aesthetic, love it",
  "Major find, congrats!",
  "Price is right on this one",
  "Bookmarked immediately",
  "Wish I saw this sooner",
  "You always post the best stuff",
  "Interested! DM sent",
  "Top tier listing",
  "More of this please",
  "The hunt pays off again",
  "Solid pick up",
  "Chef's kiss on this one",
];

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function hasMedia(post: Post): boolean {
  if (post.type === "ad") return !!(post.media || post.videoSrc);
  if (post.type === "video") return true;
  if (post.type === "text" || post.type === "listing") return !!post.media;
  return false;
}

export function seedTimestamps(posts: Post[]): Post[] {
  const now = Date.now();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;
  const total = posts.length;

  return posts.map((post, index) => {
    if (post.type === "ad") return post;

    const rng = seededRandom(index * 7919 + 31);
    const normalizedIndex = total > 1 ? index / (total - 1) : 0;
    const curve = Math.pow(normalizedIndex, 1.8);
    const jitter = (rng() - 0.5) * 0.08;
    const position = Math.max(0, Math.min(1, curve + jitter));
    const offsetMs = position * fourteenDays;
    const timestamp = Math.floor(now - offsetMs);

    return { ...post, timestamp };
  });
}

export function seedEngagement(posts: Post[]): void {
  if (typeof window === "undefined") return;

  const currentVersion = lsGet<number>(VERSION_KEY, 0);
  if (currentVersion === ENGAGEMENT_SEED_VERSION) return;

  const engagementState: EngagementState = { likes: {}, comments: {} };
  const total = posts.length;
  const viralThreshold = Math.max(1, Math.floor(total * 0.1));
  const viralIndices = new Set<number>();

  const viralRng = seededRandom(42);
  const indices = Array.from({ length: total }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(viralRng() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  for (let i = 0; i < viralThreshold; i++) {
    viralIndices.add(indices[i]);
  }

  const now = Date.now();
  const fourteenDays = 14 * 24 * 60 * 60 * 1000;

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];
    if (post.type === "ad") continue;

    const rng = seededRandom(i * 1301 + 97);
    const postId = post.id;

    const postAge = post.timestamp ? (now - post.timestamp) / fourteenDays : 0.5;
    const ageFactor = 0.4 + postAge * 0.6;
    const mediaFactor = hasMedia(post) ? 2.0 + rng() * 1.0 : 1.0;
    const viralFactor = viralIndices.has(i) ? 5.0 + rng() * 5.0 : 1.0;

    const baseLikes = 5 + Math.floor(rng() * 40);
    const likeCount = Math.min(500, Math.max(5, Math.floor(baseLikes * ageFactor * mediaFactor * viralFactor)));

    const likeUsers: string[] = [];
    for (let l = 0; l < likeCount; l++) {
      const idx = Math.floor(rng() * ALL_USERNAMES.length);
      const username = ALL_USERNAMES[idx];
      if (!likeUsers.includes(username)) {
        likeUsers.push(username);
      }
    }
    engagementState.likes[postId] = { count: likeUsers.length, users: likeUsers };

    const baseComments = Math.floor(rng() * 8);
    const commentCount = Math.min(30, Math.max(0, Math.floor(baseComments * ageFactor * mediaFactor * (viralIndices.has(i) ? 3.0 : 1.0))));

    const comments: Comment[] = [];
    for (let c = 0; c < commentCount; c++) {
      const userIdx = Math.floor(rng() * ALL_USERNAMES.length);
      const templateIdx = Math.floor(rng() * COMMENT_TEMPLATES.length);
      const commentTimestamp = post.timestamp
        ? post.timestamp + Math.floor(rng() * (now - post.timestamp))
        : now - Math.floor(rng() * fourteenDays);

      comments.push({
        id: `seed-${postId}-${c}`,
        postId,
        username: ALL_USERNAMES[userIdx],
        content: COMMENT_TEMPLATES[templateIdx],
        createdAt: commentTimestamp,
      });
    }
    comments.sort((a, b) => a.createdAt - b.createdAt);
    if (comments.length > 0) {
      engagementState.comments[postId] = comments;
    }

    const reactionTypes: ReactionType[] = ["like", "love", "haha", "wow", "sad", "angry", "fire", "money"];
    const reactionWeights = [30, 25, 12, 8, 5, 4, 10, 6];
    const totalWeight = reactionWeights.reduce((a, b) => a + b, 0);

    const pickReactionType = (): ReactionType => {
      let r = rng() * totalWeight;
      for (let t = 0; t < reactionTypes.length; t++) {
        r -= reactionWeights[t];
        if (r <= 0) return reactionTypes[t];
      }
      return "like";
    };

    const reactionCount = Math.min(likeUsers.length, Math.floor(likeUsers.length * (0.3 + rng() * 0.4)));
    const reactions: Array<{ postId: string; username: string; type: ReactionType; timestamp: number }> = [];
    const usedReactors = new Set<string>();

    for (let r = 0; r < reactionCount; r++) {
      const userIdx = Math.floor(rng() * ALL_USERNAMES.length);
      const username = ALL_USERNAMES[userIdx];
      if (usedReactors.has(username)) continue;
      usedReactors.add(username);

      const reactionTimestamp = post.timestamp
        ? post.timestamp + Math.floor(rng() * (now - post.timestamp))
        : now - Math.floor(rng() * fourteenDays);

      reactions.push({
        postId,
        username,
        type: pickReactionType(),
        timestamp: reactionTimestamp,
      });
    }

    if (reactions.length > 0) {
      lsSet(REACTIONS_KEY(postId), reactions);
    }
  }

  lsSet(ENGAGEMENT_KEY, engagementState);
  lsSet(VERSION_KEY, ENGAGEMENT_SEED_VERSION);
}
