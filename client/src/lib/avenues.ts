import { lsGet, lsSet } from "./storage";
import { addCoins, spendCoins, getWallet } from "./dahCoins";
import { pushNotification } from "./notifications";
import { getSession } from "./auth";

// Storage keys
const AVENUES_KEY = "dah.avenues";
const AVENUE_POSTS_KEY = (avenueId: string) => `dah.avenues.posts.${avenueId}`;
const POST_COMMENTS_KEY = (postId: string) => `dah.avenues.comments.${postId}`;
const POST_VOTES_KEY = (postId: string) => `dah.avenues.votes.${postId}`;
const COMMENT_VOTES_KEY = (commentId: string) => `dah.avenues.comment.votes.${commentId}`;
const USER_SUBSCRIPTIONS_KEY = (username: string) => `dah.avenues.subs.${username}`;
const POST_AWARDS_KEY = (postId: string) => `dah.avenues.awards.${postId}`;
const USER_KARMA_KEY = (username: string) => `dah.avenues.karma.${username}`;
const AVENUE_MODS_KEY = (avenueId: string) => `dah.avenues.mods.${avenueId}`;
const AVENUE_BANS_KEY = (avenueId: string) => `dah.avenues.bans.${avenueId}`;
const AVENUE_RULES_KEY = (avenueId: string) => `dah.avenues.rules.${avenueId}`;
const MOD_QUEUE_KEY = (avenueId: string) => `dah.avenues.modqueue.${avenueId}`;

// Types
export interface Avenue {
  id: string;
  name: string;
  displayName: string;
  description: string;
  icon?: string;
  banner?: string;
  category: AvenueCategory;
  memberCount: number;
  createdAt: number;
  createdBy: string;
  isPrivate: boolean;
  isNSFW: boolean;
  flairs: Flair[];
}

export type AvenueCategory = 
  | "Entertainment" 
  | "Gaming" 
  | "Sports" 
  | "News" 
  | "Technology" 
  | "Science" 
  | "Art" 
  | "Music" 
  | "Food" 
  | "Travel" 
  | "Fashion" 
  | "Finance" 
  | "Crypto" 
  | "Memes" 
  | "Discussion" 
  | "Education"
  | "Lifestyle"
  | "Other";

export const avenueCategories: AvenueCategory[] = [
  "Entertainment", "Gaming", "Sports", "News", "Technology", "Science",
  "Art", "Music", "Food", "Travel", "Fashion", "Finance", "Crypto",
  "Memes", "Discussion", "Education", "Lifestyle", "Other"
];

export interface Flair {
  id: string;
  name: string;
  color: string;
  bgColor: string;
}

export type PostType = "text" | "image" | "video" | "link" | "poll";

export interface AvenuePost {
  id: string;
  avenueId: string;
  author: string;
  title: string;
  content: string;
  type: PostType;
  mediaUrl?: string;
  linkUrl?: string;
  linkPreview?: { title: string; description: string; image?: string };
  pollOptions?: PollOption[];
  flair?: Flair;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: number;
  isPinned: boolean;
  isLocked: boolean;
  isRemoved: boolean;
  removedReason?: string;
  crosspostedFrom?: { avenueId: string; postId: string };
  awardCount: number;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Comment {
  id: string;
  postId: string;
  parentId: string | null;
  author: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: number;
  isRemoved: boolean;
  isEdited: boolean;
  depth: number;
  children?: Comment[];
}

export interface Vote {
  username: string;
  value: 1 | -1;
  timestamp: number;
}

export interface Award {
  id: string;
  type: AwardType;
  from: string;
  to: string;
  postId?: string;
  commentId?: string;
  timestamp: number;
  message?: string;
}

export type AwardType = "silver" | "gold" | "platinum" | "diamond" | "fire" | "mindblown" | "helpful" | "wholesome";

export const awardConfig: Record<AwardType, { name: string; cost: number; icon: string; color: string }> = {
  silver: { name: "Silver", cost: 10, icon: "Medal", color: "#C0C0C0" },
  gold: { name: "Gold", cost: 50, icon: "Trophy", color: "#FFD700" },
  platinum: { name: "Platinum", cost: 100, icon: "Crown", color: "#E5E4E2" },
  diamond: { name: "Diamond", cost: 500, icon: "Gem", color: "#B9F2FF" },
  fire: { name: "On Fire", cost: 25, icon: "Flame", color: "#FF6B35" },
  mindblown: { name: "Mind Blown", cost: 30, icon: "Sparkles", color: "#9333EA" },
  helpful: { name: "Helpful", cost: 15, icon: "HelpCircle", color: "#22C55E" },
  wholesome: { name: "Wholesome", cost: 20, icon: "Heart", color: "#EC4899" },
};

export interface ModAction {
  id: string;
  avenueId: string;
  moderator: string;
  action: "remove" | "approve" | "pin" | "unpin" | "lock" | "unlock" | "ban" | "unban" | "mute";
  targetType: "post" | "comment" | "user";
  targetId: string;
  reason?: string;
  timestamp: number;
}

export interface AvenueRule {
  id: string;
  title: string;
  description: string;
  order: number;
}

export type SortOption = "hot" | "new" | "top" | "controversial" | "rising";
export type TimeFilter = "hour" | "day" | "week" | "month" | "year" | "all";

// Seed data
const seedAvenues: Avenue[] = [
  {
    id: "av_tech",
    name: "TechTalk",
    displayName: "Tech Talk",
    description: "Discuss the latest in technology, gadgets, software, and innovation",
    category: "Technology",
    memberCount: 284000,
    createdAt: Date.now() - 365 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "News", color: "#fff", bgColor: "#3B82F6" },
      { id: "f2", name: "Discussion", color: "#fff", bgColor: "#8B5CF6" },
      { id: "f3", name: "Question", color: "#fff", bgColor: "#22C55E" },
    ],
  },
  {
    id: "av_gaming",
    name: "GamersHub",
    displayName: "Gamers Hub",
    description: "Your home for gaming news, discussions, memes, and esports",
    category: "Gaming",
    memberCount: 521000,
    createdAt: Date.now() - 300 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "PC Gaming", color: "#fff", bgColor: "#EF4444" },
      { id: "f2", name: "Console", color: "#fff", bgColor: "#3B82F6" },
      { id: "f3", name: "Mobile", color: "#fff", bgColor: "#22C55E" },
      { id: "f4", name: "Esports", color: "#000", bgColor: "#FCD34D" },
    ],
  },
  {
    id: "av_crypto",
    name: "CryptoVerse",
    displayName: "Crypto Verse",
    description: "Cryptocurrency news, analysis, and community discussions",
    category: "Crypto",
    memberCount: 156000,
    createdAt: Date.now() - 200 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "Bitcoin", color: "#fff", bgColor: "#F7931A" },
      { id: "f2", name: "Altcoins", color: "#fff", bgColor: "#627EEA" },
      { id: "f3", name: "DeFi", color: "#fff", bgColor: "#8B5CF6" },
      { id: "f4", name: "Analysis", color: "#fff", bgColor: "#22C55E" },
    ],
  },
  {
    id: "av_memes",
    name: "DAHMemes",
    displayName: "DAH Memes",
    description: "The internet's finest collection of memes and humor",
    category: "Memes",
    memberCount: 892000,
    createdAt: Date.now() - 400 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "Dank", color: "#fff", bgColor: "#8B5CF6" },
      { id: "f2", name: "Wholesome", color: "#fff", bgColor: "#EC4899" },
      { id: "f3", name: "OC", color: "#000", bgColor: "#FCD34D" },
    ],
  },
  {
    id: "av_news",
    name: "WorldNews",
    displayName: "World News",
    description: "Breaking news and important events from around the globe",
    category: "News",
    memberCount: 1240000,
    createdAt: Date.now() - 500 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "Breaking", color: "#fff", bgColor: "#EF4444" },
      { id: "f2", name: "Politics", color: "#fff", bgColor: "#3B82F6" },
      { id: "f3", name: "Business", color: "#fff", bgColor: "#22C55E" },
      { id: "f4", name: "Science", color: "#fff", bgColor: "#8B5CF6" },
    ],
  },
  {
    id: "av_music",
    name: "MusicLounge",
    displayName: "Music Lounge",
    description: "Share and discover music, discuss artists, and connect with music lovers",
    category: "Music",
    memberCount: 345000,
    createdAt: Date.now() - 250 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "New Release", color: "#fff", bgColor: "#EC4899" },
      { id: "f2", name: "Discussion", color: "#fff", bgColor: "#8B5CF6" },
      { id: "f3", name: "Playlist", color: "#fff", bgColor: "#22C55E" },
    ],
  },
  {
    id: "av_fitness",
    name: "FitnessJourney",
    displayName: "Fitness Journey",
    description: "Workout tips, nutrition advice, and motivation for your fitness goals",
    category: "Lifestyle",
    memberCount: 178000,
    createdAt: Date.now() - 180 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "Progress", color: "#fff", bgColor: "#22C55E" },
      { id: "f2", name: "Advice", color: "#fff", bgColor: "#3B82F6" },
      { id: "f3", name: "Nutrition", color: "#fff", bgColor: "#F97316" },
    ],
  },
  {
    id: "av_art",
    name: "ArtistAlley",
    displayName: "Artist Alley",
    description: "Showcase your art, get feedback, and connect with fellow creators",
    category: "Art",
    memberCount: 234000,
    createdAt: Date.now() - 220 * 24 * 60 * 60 * 1000,
    createdBy: "dahbot",
    isPrivate: false,
    isNSFW: false,
    flairs: [
      { id: "f1", name: "Digital", color: "#fff", bgColor: "#8B5CF6" },
      { id: "f2", name: "Traditional", color: "#fff", bgColor: "#F97316" },
      { id: "f3", name: "Photography", color: "#fff", bgColor: "#3B82F6" },
      { id: "f4", name: "Feedback", color: "#fff", bgColor: "#22C55E" },
    ],
  },
];

const seedPosts: Record<string, AvenuePost[]> = {
  av_tech: [
    {
      id: "p1",
      avenueId: "av_tech",
      author: "techie_sam",
      title: "Apple just announced the M4 Ultra chip - here's everything we know",
      content: "The new M4 Ultra is absolutely insane. 80 CPU cores, 160 GPU cores, and up to 512GB of unified memory. This is going to change professional workflows forever.",
      type: "text",
      upvotes: 4521,
      downvotes: 234,
      commentCount: 892,
      createdAt: Date.now() - 2 * 60 * 60 * 1000,
      isPinned: false,
      isLocked: false,
      isRemoved: false,
      awardCount: 12,
      flair: { id: "f1", name: "News", color: "#fff", bgColor: "#3B82F6" },
    },
    {
      id: "p2",
      avenueId: "av_tech",
      author: "dev_ninja",
      title: "What's your most controversial tech opinion?",
      content: "I'll start: I think VS Code is overrated and Vim is actually easier to learn than people make it seem.",
      type: "text",
      upvotes: 2341,
      downvotes: 1892,
      commentCount: 2341,
      createdAt: Date.now() - 5 * 60 * 60 * 1000,
      isPinned: false,
      isLocked: false,
      isRemoved: false,
      awardCount: 5,
      flair: { id: "f2", name: "Discussion", color: "#fff", bgColor: "#8B5CF6" },
    },
    {
      id: "p3",
      avenueId: "av_tech",
      author: "curious_coder",
      title: "How do you stay motivated to code after a long day at work?",
      content: "I want to work on side projects but after 8 hours of coding at work, I just want to watch TV. Any tips?",
      type: "text",
      upvotes: 1892,
      downvotes: 45,
      commentCount: 456,
      createdAt: Date.now() - 8 * 60 * 60 * 1000,
      isPinned: false,
      isLocked: false,
      isRemoved: false,
      awardCount: 3,
      flair: { id: "f3", name: "Question", color: "#fff", bgColor: "#22C55E" },
    },
  ],
  av_gaming: [
    {
      id: "p4",
      avenueId: "av_gaming",
      author: "gamer_pro",
      title: "GTA 6 trailer drops next week - confirmed by Rockstar",
      content: "After years of waiting, it's finally happening! Rockstar just confirmed on their official account that the first GTA 6 trailer drops December 5th.",
      type: "text",
      upvotes: 12453,
      downvotes: 234,
      commentCount: 3421,
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      isPinned: true,
      isLocked: false,
      isRemoved: false,
      awardCount: 45,
      flair: { id: "f1", name: "PC Gaming", color: "#fff", bgColor: "#EF4444" },
    },
    {
      id: "p5",
      avenueId: "av_gaming",
      author: "casual_player",
      title: "What game has the most toxic community?",
      content: "I've played a lot of online games and honestly can't decide. What do you think?",
      type: "text",
      upvotes: 3421,
      downvotes: 892,
      commentCount: 1234,
      createdAt: Date.now() - 4 * 60 * 60 * 1000,
      isPinned: false,
      isLocked: false,
      isRemoved: false,
      awardCount: 2,
      flair: { id: "f2", name: "Console", color: "#fff", bgColor: "#3B82F6" },
    },
  ],
  av_memes: [
    {
      id: "p6",
      avenueId: "av_memes",
      author: "meme_lord",
      title: "When the AI finally takes your job",
      content: "POV: You're a graphic designer in 2025",
      type: "image",
      mediaUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800",
      upvotes: 8923,
      downvotes: 342,
      commentCount: 567,
      createdAt: Date.now() - 3 * 60 * 60 * 1000,
      isPinned: false,
      isLocked: false,
      isRemoved: false,
      awardCount: 8,
      flair: { id: "f1", name: "Dank", color: "#fff", bgColor: "#8B5CF6" },
    },
  ],
  av_crypto: [
    {
      id: "p7",
      avenueId: "av_crypto",
      author: "hodl_master",
      title: "Bitcoin just hit $100k - What now?",
      content: "After all these years, we finally made it. But the question is: do we take profits or hold for more?",
      type: "text",
      upvotes: 6789,
      downvotes: 1234,
      commentCount: 2341,
      createdAt: Date.now() - 6 * 60 * 60 * 1000,
      isPinned: true,
      isLocked: false,
      isRemoved: false,
      awardCount: 23,
      flair: { id: "f1", name: "Bitcoin", color: "#fff", bgColor: "#F7931A" },
    },
  ],
};

const seedComments: Record<string, Comment[]> = {
  p1: [
    {
      id: "c1",
      postId: "p1",
      parentId: null,
      author: "apple_fan",
      content: "This is absolutely insane. The performance benchmarks are going to be wild.",
      upvotes: 892,
      downvotes: 34,
      createdAt: Date.now() - 1.5 * 60 * 60 * 1000,
      isRemoved: false,
      isEdited: false,
      depth: 0,
    },
    {
      id: "c2",
      postId: "p1",
      parentId: "c1",
      author: "skeptic_steve",
      content: "Yeah but who actually needs 512GB of RAM? This is just Apple flexing.",
      upvotes: 234,
      downvotes: 156,
      createdAt: Date.now() - 1.3 * 60 * 60 * 1000,
      isRemoved: false,
      isEdited: false,
      depth: 1,
    },
    {
      id: "c3",
      postId: "p1",
      parentId: "c2",
      author: "pro_editor",
      content: "I edit 8K video for a living. I absolutely need this much RAM. Current Mac Studio runs out all the time.",
      upvotes: 567,
      downvotes: 12,
      createdAt: Date.now() - 1.1 * 60 * 60 * 1000,
      isRemoved: false,
      isEdited: false,
      depth: 2,
    },
    {
      id: "c4",
      postId: "p1",
      parentId: null,
      author: "linux_lover",
      content: "Meanwhile my AMD Threadripper does the same thing for half the price...",
      upvotes: 345,
      downvotes: 234,
      createdAt: Date.now() - 1 * 60 * 60 * 1000,
      isRemoved: false,
      isEdited: false,
      depth: 0,
    },
  ],
  p4: [
    {
      id: "c5",
      postId: "p4",
      parentId: null,
      author: "gta_veteran",
      content: "I've been waiting since 2013 for this. My body is ready.",
      upvotes: 2341,
      downvotes: 23,
      createdAt: Date.now() - 0.5 * 60 * 60 * 1000,
      isRemoved: false,
      isEdited: false,
      depth: 0,
    },
    {
      id: "c6",
      postId: "p4",
      parentId: "c5",
      author: "young_gamer",
      content: "Bro I was 5 when GTA V came out. I'm in college now.",
      upvotes: 1234,
      downvotes: 45,
      createdAt: Date.now() - 0.4 * 60 * 60 * 1000,
      isRemoved: false,
      isEdited: false,
      depth: 1,
    },
  ],
};

// Initialize avenues
function initializeAvenues(): Avenue[] {
  const existing = lsGet<Avenue[]>(AVENUES_KEY, []);
  if (existing && existing.length > 0) return existing;
  lsSet(AVENUES_KEY, seedAvenues);
  
  // Initialize seed posts
  Object.entries(seedPosts).forEach(([avenueId, posts]) => {
    lsSet(AVENUE_POSTS_KEY(avenueId), posts);
  });
  
  // Initialize seed comments
  Object.entries(seedComments).forEach(([postId, comments]) => {
    lsSet(POST_COMMENTS_KEY(postId), comments);
  });
  
  return seedAvenues;
}

// Avenue operations
export function getAllAvenues(): Avenue[] {
  return initializeAvenues();
}

export function getAvenue(id: string): Avenue | null {
  const avenues = getAllAvenues();
  return avenues.find(a => a.id === id) || null;
}

export function getAvenueByName(name: string): Avenue | null {
  const avenues = getAllAvenues();
  return avenues.find(a => a.name.toLowerCase() === name.toLowerCase()) || null;
}

export function getAvenuesByCategory(category: AvenueCategory): Avenue[] {
  return getAllAvenues().filter(a => a.category === category);
}

export function getTrendingAvenues(limit: number = 10): Avenue[] {
  return getAllAvenues()
    .sort((a, b) => b.memberCount - a.memberCount)
    .slice(0, limit);
}

export function searchAvenues(query: string): Avenue[] {
  const q = query.toLowerCase();
  return getAllAvenues().filter(a => 
    a.name.toLowerCase().includes(q) || 
    a.displayName.toLowerCase().includes(q) ||
    a.description.toLowerCase().includes(q)
  );
}

export function createAvenue(data: Omit<Avenue, "id" | "memberCount" | "createdAt" | "createdBy">): Avenue {
  const session = getSession();
  if (!session) throw new Error("Must be logged in");
  
  const avenue: Avenue = {
    ...data,
    id: `av_${Date.now()}`,
    memberCount: 1,
    createdAt: Date.now(),
    createdBy: session.username,
  };
  
  const avenues = getAllAvenues();
  avenues.push(avenue);
  lsSet(AVENUES_KEY, avenues);
  
  // Auto-subscribe creator
  subscribeToAvenue(avenue.id);
  
  // Add creator as moderator
  const mods = [{ username: session.username, role: "owner" as const, addedAt: Date.now() }];
  lsSet(AVENUE_MODS_KEY(avenue.id), mods);
  
  return avenue;
}

// Subscription
export function getUserSubscriptions(username: string): string[] {
  return lsGet<string[]>(USER_SUBSCRIPTIONS_KEY(username), []);
}

export function isSubscribed(avenueId: string): boolean {
  const session = getSession();
  if (!session) return false;
  return getUserSubscriptions(session.username).includes(avenueId);
}

export function subscribeToAvenue(avenueId: string): void {
  const session = getSession();
  if (!session) return;
  
  const subs = getUserSubscriptions(session.username);
  if (!subs.includes(avenueId)) {
    subs.push(avenueId);
    lsSet(USER_SUBSCRIPTIONS_KEY(session.username), subs);
    
    // Update member count
    const avenues = getAllAvenues();
    const idx = avenues.findIndex(a => a.id === avenueId);
    if (idx >= 0) {
      avenues[idx].memberCount++;
      lsSet(AVENUES_KEY, avenues);
    }
  }
}

export function unsubscribeFromAvenue(avenueId: string): void {
  const session = getSession();
  if (!session) return;
  
  const subs = getUserSubscriptions(session.username);
  const idx = subs.indexOf(avenueId);
  if (idx >= 0) {
    subs.splice(idx, 1);
    lsSet(USER_SUBSCRIPTIONS_KEY(session.username), subs);
    
    // Update member count
    const avenues = getAllAvenues();
    const aIdx = avenues.findIndex(a => a.id === avenueId);
    if (aIdx >= 0 && avenues[aIdx].memberCount > 0) {
      avenues[aIdx].memberCount--;
      lsSet(AVENUES_KEY, avenues);
    }
  }
}

// Posts
export function getAvenuePosts(avenueId: string): AvenuePost[] {
  initializeAvenues(); // Ensure seed data exists
  return lsGet<AvenuePost[]>(AVENUE_POSTS_KEY(avenueId), []);
}

export function getPost(avenueId: string, postId: string): AvenuePost | null {
  const posts = getAvenuePosts(avenueId);
  return posts.find(p => p.id === postId) || null;
}

export function createPost(avenueId: string, data: {
  title: string;
  content: string;
  type: PostType;
  mediaUrl?: string;
  linkUrl?: string;
  pollOptions?: string[];
  flair?: Flair;
}): AvenuePost {
  const session = getSession();
  if (!session) throw new Error("Must be logged in");
  
  const post: AvenuePost = {
    id: `p_${Date.now()}`,
    avenueId,
    author: session.username,
    title: data.title,
    content: data.content,
    type: data.type,
    mediaUrl: data.mediaUrl,
    linkUrl: data.linkUrl,
    pollOptions: data.pollOptions?.map((text, i) => ({
      id: `opt_${i}`,
      text,
      votes: 0,
      voters: [],
    })),
    flair: data.flair,
    upvotes: 1,
    downvotes: 0,
    commentCount: 0,
    createdAt: Date.now(),
    isPinned: false,
    isLocked: false,
    isRemoved: false,
    awardCount: 0,
  };
  
  const posts = getAvenuePosts(avenueId);
  posts.unshift(post);
  lsSet(AVENUE_POSTS_KEY(avenueId), posts);
  
  // Auto-upvote own post
  const votes: Vote[] = [{ username: session.username, value: 1, timestamp: Date.now() }];
  lsSet(POST_VOTES_KEY(post.id), votes);
  
  // Award karma
  addKarma(session.username, 1, "post");
  
  // Award coins for posting
  addCoins(session.username, session.age || 18, "Posted in Avenue", 2);
  
  return post;
}

export function sortPosts(posts: AvenuePost[], sort: SortOption, timeFilter: TimeFilter = "all"): AvenuePost[] {
  let filtered = [...posts];
  
  // Time filter
  if (timeFilter !== "all") {
    const now = Date.now();
    const cutoffs: Record<TimeFilter, number> = {
      hour: 60 * 60 * 1000,
      day: 24 * 60 * 60 * 1000,
      week: 7 * 24 * 60 * 60 * 1000,
      month: 30 * 24 * 60 * 60 * 1000,
      year: 365 * 24 * 60 * 60 * 1000,
      all: Infinity,
    };
    filtered = filtered.filter(p => now - p.createdAt < cutoffs[timeFilter]);
  }
  
  // Pin to top
  const pinned = filtered.filter(p => p.isPinned);
  const unpinned = filtered.filter(p => !p.isPinned);
  
  const sortFn = (a: AvenuePost, b: AvenuePost): number => {
    const scoreA = a.upvotes - a.downvotes;
    const scoreB = b.upvotes - b.downvotes;
    const ageA = (Date.now() - a.createdAt) / (1000 * 60 * 60); // hours
    const ageB = (Date.now() - b.createdAt) / (1000 * 60 * 60);
    
    switch (sort) {
      case "hot":
        // Hot score based on votes and time decay
        const hotA = scoreA / Math.pow(ageA + 2, 1.8);
        const hotB = scoreB / Math.pow(ageB + 2, 1.8);
        return hotB - hotA;
      case "new":
        return b.createdAt - a.createdAt;
      case "top":
        return scoreB - scoreA;
      case "controversial":
        // Controversial = high votes but close to 50/50
        const totalA = a.upvotes + a.downvotes;
        const totalB = b.upvotes + b.downvotes;
        const ratioA = totalA > 0 ? Math.min(a.upvotes, a.downvotes) / Math.max(a.upvotes, a.downvotes) : 0;
        const ratioB = totalB > 0 ? Math.min(b.upvotes, b.downvotes) / Math.max(b.upvotes, b.downvotes) : 0;
        return (ratioB * totalB) - (ratioA * totalA);
      case "rising":
        // Rising = recent posts with good velocity
        const velocityA = ageA < 6 ? scoreA / (ageA + 1) : 0;
        const velocityB = ageB < 6 ? scoreB / (ageB + 1) : 0;
        return velocityB - velocityA;
      default:
        return 0;
    }
  };
  
  unpinned.sort(sortFn);
  return [...pinned, ...unpinned];
}

// Voting
export function getPostVote(postId: string): 1 | -1 | 0 {
  const session = getSession();
  if (!session) return 0;
  
  const votes = lsGet<Vote[]>(POST_VOTES_KEY(postId), []);
  const vote = votes.find(v => v.username === session.username);
  return vote?.value || 0;
}

export function voteOnPost(avenueId: string, postId: string, value: 1 | -1): void {
  const session = getSession();
  if (!session) return;
  
  const votes = lsGet<Vote[]>(POST_VOTES_KEY(postId), []);
  const existingIdx = votes.findIndex(v => v.username === session.username);
  const existingVote = existingIdx >= 0 ? votes[existingIdx] : null;
  
  const posts = getAvenuePosts(avenueId);
  const postIdx = posts.findIndex(p => p.id === postId);
  if (postIdx < 0) return;
  
  const post = posts[postIdx];
  
  // Remove existing vote effects
  if (existingVote) {
    if (existingVote.value === 1) post.upvotes--;
    else post.downvotes--;
    votes.splice(existingIdx, 1);
    
    // If clicking same vote, just remove it
    if (existingVote.value === value) {
      lsSet(POST_VOTES_KEY(postId), votes);
      lsSet(AVENUE_POSTS_KEY(avenueId), posts);
      addKarma(post.author, existingVote.value === 1 ? -1 : 1, "vote");
      return;
    }
  }
  
  // Add new vote
  votes.push({ username: session.username, value, timestamp: Date.now() });
  if (value === 1) post.upvotes++;
  else post.downvotes++;
  
  lsSet(POST_VOTES_KEY(postId), votes);
  lsSet(AVENUE_POSTS_KEY(avenueId), posts);
  
  // Update karma
  addKarma(post.author, value, "vote");
  
  // Award coins for upvotes
  if (value === 1 && post.author !== session.username) {
    addCoins(post.author, 18, "Avenue upvote received", 1);
  }
}

// Comments
export function getPostComments(postId: string): Comment[] {
  initializeAvenues(); // Ensure seed data
  return lsGet<Comment[]>(POST_COMMENTS_KEY(postId), []);
}

export function getThreadedComments(postId: string): Comment[] {
  const comments = getPostComments(postId);
  
  // Build tree structure
  const rootComments: Comment[] = [];
  const commentMap = new Map<string, Comment>();
  
  comments.forEach(c => {
    commentMap.set(c.id, { ...c, children: [] });
  });
  
  commentMap.forEach(comment => {
    if (comment.parentId) {
      const parent = commentMap.get(comment.parentId);
      if (parent) {
        parent.children = parent.children || [];
        parent.children.push(comment);
      }
    } else {
      rootComments.push(comment);
    }
  });
  
  // Sort by score
  const sortComments = (list: Comment[]): Comment[] => {
    list.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
    list.forEach(c => {
      if (c.children && c.children.length > 0) {
        c.children = sortComments(c.children);
      }
    });
    return list;
  };
  
  return sortComments(rootComments);
}

export function addComment(avenueId: string, postId: string, content: string, parentId: string | null = null): Comment {
  const session = getSession();
  if (!session) throw new Error("Must be logged in");
  
  const comments = getPostComments(postId);
  const parentComment = parentId ? comments.find(c => c.id === parentId) : null;
  
  const comment: Comment = {
    id: `c_${Date.now()}`,
    postId,
    parentId,
    author: session.username,
    content,
    upvotes: 1,
    downvotes: 0,
    createdAt: Date.now(),
    isRemoved: false,
    isEdited: false,
    depth: parentComment ? parentComment.depth + 1 : 0,
  };
  
  comments.push(comment);
  lsSet(POST_COMMENTS_KEY(postId), comments);
  
  // Update post comment count
  const posts = getAvenuePosts(avenueId);
  const postIdx = posts.findIndex(p => p.id === postId);
  if (postIdx >= 0) {
    posts[postIdx].commentCount++;
    lsSet(AVENUE_POSTS_KEY(avenueId), posts);
    
    // Notify post author
    if (posts[postIdx].author !== session.username) {
      pushNotification(posts[postIdx].author, {
        username: posts[postIdx].author,
        type: "system",
        message: `@${session.username} commented on your post`,
      });
    }
  }
  
  // Auto-upvote own comment
  const votes: Vote[] = [{ username: session.username, value: 1, timestamp: Date.now() }];
  lsSet(COMMENT_VOTES_KEY(comment.id), votes);
  
  // Award karma and coins
  addKarma(session.username, 1, "comment");
  addCoins(session.username, session.age || 18, "Posted comment", 1);
  
  return comment;
}

export function voteOnComment(commentId: string, postId: string, value: 1 | -1): void {
  const session = getSession();
  if (!session) return;
  
  const votes = lsGet<Vote[]>(COMMENT_VOTES_KEY(commentId), []);
  const existingIdx = votes.findIndex(v => v.username === session.username);
  const existingVote = existingIdx >= 0 ? votes[existingIdx] : null;
  
  const comments = getPostComments(postId);
  const commentIdx = comments.findIndex(c => c.id === commentId);
  if (commentIdx < 0) return;
  
  const comment = comments[commentIdx];
  
  // Remove existing vote effects
  if (existingVote) {
    if (existingVote.value === 1) comment.upvotes--;
    else comment.downvotes--;
    votes.splice(existingIdx, 1);
    
    if (existingVote.value === value) {
      lsSet(COMMENT_VOTES_KEY(commentId), votes);
      lsSet(POST_COMMENTS_KEY(postId), comments);
      return;
    }
  }
  
  // Add new vote
  votes.push({ username: session.username, value, timestamp: Date.now() });
  if (value === 1) comment.upvotes++;
  else comment.downvotes--;
  
  lsSet(COMMENT_VOTES_KEY(commentId), votes);
  lsSet(POST_COMMENTS_KEY(postId), comments);
  
  addKarma(comment.author, value, "vote");
}

export function getCommentVote(commentId: string): 1 | -1 | 0 {
  const session = getSession();
  if (!session) return 0;
  
  const votes = lsGet<Vote[]>(COMMENT_VOTES_KEY(commentId), []);
  const vote = votes.find(v => v.username === session.username);
  return vote?.value || 0;
}

// Awards
export function giveAward(type: AwardType, postId: string, postAuthor: string, message?: string): boolean {
  const session = getSession();
  if (!session) return false;
  
  const config = awardConfig[type];
  const wallet = getWallet(session.username);
  
  if (wallet.available < config.cost) return false;
  
  // Spend coins
  spendCoins(session.username, config.cost, `${config.name} award`);
  
  // Award recipient gets 80% of award cost
  const recipientShare = Math.floor(config.cost * 0.8);
  addCoins(postAuthor, 18, `Received ${config.name} award`, recipientShare);
  
  // Store award
  const awards = lsGet<Award[]>(POST_AWARDS_KEY(postId), []);
  awards.push({
    id: `award_${Date.now()}`,
    type,
    from: session.username,
    to: postAuthor,
    postId,
    timestamp: Date.now(),
    message,
  });
  lsSet(POST_AWARDS_KEY(postId), awards);
  
  // Update post award count
  // Find which avenue this post belongs to
  const allAvenues = getAllAvenues();
  for (const avenue of allAvenues) {
    const posts = getAvenuePosts(avenue.id);
    const postIdx = posts.findIndex(p => p.id === postId);
    if (postIdx >= 0) {
      posts[postIdx].awardCount++;
      lsSet(AVENUE_POSTS_KEY(avenue.id), posts);
      break;
    }
  }
  
  // Notify recipient
  pushNotification(postAuthor, {
    username: postAuthor,
    type: "coin",
    message: `@${session.username} gave you a ${config.name} award!`,
  });
  
  addKarma(postAuthor, config.cost, "award");
  
  return true;
}

export function getPostAwards(postId: string): Award[] {
  return lsGet<Award[]>(POST_AWARDS_KEY(postId), []);
}

// Karma
export function getKarma(username: string): { post: number; comment: number; award: number; total: number } {
  const karma = lsGet<{ post: number; comment: number; award: number }>(USER_KARMA_KEY(username), {
    post: 0,
    comment: 0,
    award: 0,
  });
  return { ...karma, total: karma.post + karma.comment + karma.award };
}

export function addKarma(username: string, amount: number, type: "post" | "comment" | "vote" | "award"): void {
  const karma = getKarma(username);
  
  if (type === "vote") {
    karma.post += amount;
  } else if (type === "comment") {
    karma.comment += amount;
  } else if (type === "award") {
    karma.award += amount;
  } else {
    karma.post += amount;
  }
  
  lsSet(USER_KARMA_KEY(username), karma);
}

// Moderation
export function isModerator(avenueId: string, username?: string): boolean {
  const user = username || getSession()?.username;
  if (!user) return false;
  
  const mods = lsGet<{ username: string; role: string }[]>(AVENUE_MODS_KEY(avenueId), []);
  return mods.some(m => m.username === user);
}

export function getModeratorRole(avenueId: string): "owner" | "mod" | "steward" | null {
  const session = getSession();
  if (!session) return null;
  
  const mods = lsGet<{ username: string; role: "owner" | "mod" | "steward" }[]>(AVENUE_MODS_KEY(avenueId), []);
  const mod = mods.find(m => m.username === session.username);
  return mod?.role || null;
}

export function removePost(avenueId: string, postId: string, reason: string): void {
  const session = getSession();
  if (!session || !isModerator(avenueId)) return;
  
  const posts = getAvenuePosts(avenueId);
  const postIdx = posts.findIndex(p => p.id === postId);
  if (postIdx >= 0) {
    posts[postIdx].isRemoved = true;
    posts[postIdx].removedReason = reason;
    lsSet(AVENUE_POSTS_KEY(avenueId), posts);
  }
}

export function pinPost(avenueId: string, postId: string, pin: boolean): void {
  const session = getSession();
  if (!session || !isModerator(avenueId)) return;
  
  const posts = getAvenuePosts(avenueId);
  const postIdx = posts.findIndex(p => p.id === postId);
  if (postIdx >= 0) {
    posts[postIdx].isPinned = pin;
    lsSet(AVENUE_POSTS_KEY(avenueId), posts);
  }
}

export function lockPost(avenueId: string, postId: string, lock: boolean): void {
  const session = getSession();
  if (!session || !isModerator(avenueId)) return;
  
  const posts = getAvenuePosts(avenueId);
  const postIdx = posts.findIndex(p => p.id === postId);
  if (postIdx >= 0) {
    posts[postIdx].isLocked = lock;
    lsSet(AVENUE_POSTS_KEY(avenueId), posts);
  }
}

// Rules
export function getAvenueRules(avenueId: string): AvenueRule[] {
  const rules = lsGet<AvenueRule[]>(AVENUE_RULES_KEY(avenueId), []);
  if (rules.length > 0) return rules;
  return [
    { id: "r1", title: "Be respectful", description: "Treat others with respect and kindness", order: 1 },
    { id: "r2", title: "No spam", description: "Don't post spam or self-promotion without approval", order: 2 },
    { id: "r3", title: "Stay on topic", description: "Keep discussions relevant to the Avenue's theme", order: 3 },
  ];
}

// Polls
export function votePoll(avenueId: string, postId: string, optionId: string): void {
  const session = getSession();
  if (!session) return;
  
  const posts = getAvenuePosts(avenueId);
  const postIdx = posts.findIndex(p => p.id === postId);
  if (postIdx < 0 || !posts[postIdx].pollOptions) return;
  
  const post = posts[postIdx];
  
  // Remove previous vote if exists
  post.pollOptions?.forEach(opt => {
    const voterIdx = opt.voters.indexOf(session.username);
    if (voterIdx >= 0) {
      opt.voters.splice(voterIdx, 1);
      opt.votes--;
    }
  });
  
  // Add new vote
  const option = post.pollOptions?.find(o => o.id === optionId);
  if (option) {
    option.voters.push(session.username);
    option.votes++;
  }
  
  lsSet(AVENUE_POSTS_KEY(avenueId), posts);
}

// Get feed from subscribed avenues
export function getSubscribedFeed(): AvenuePost[] {
  const session = getSession();
  if (!session) return [];
  
  const subs = getUserSubscriptions(session.username);
  const allPosts: AvenuePost[] = [];
  
  subs.forEach(avenueId => {
    const posts = getAvenuePosts(avenueId);
    allPosts.push(...posts.filter(p => !p.isRemoved));
  });
  
  return sortPosts(allPosts, "hot");
}

// Format numbers
export function formatCount(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}
