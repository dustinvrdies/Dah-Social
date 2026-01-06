import { lsGet, lsSet } from "./storage";
import { Post, ListingCategory } from "./postTypes";

export interface BotUser {
  username: string;
  displayName: string;
  bio: string;
  avatar?: string;
  personality: "casual" | "professional" | "creative" | "enthusiast";
  interests: string[];
  postFrequency: "low" | "medium" | "high";
  isBot: true;
}

export const botUsers: BotUser[] = [
  {
    username: "maya_creates",
    displayName: "Maya Chen",
    bio: "Digital artist & vintage collector. Always hunting for unique finds.",
    personality: "creative",
    interests: ["art", "vintage", "fashion", "photography"],
    postFrequency: "high",
    isBot: true,
  },
  {
    username: "techie_marcus",
    displayName: "Marcus Williams",
    bio: "Software dev by day, gadget enthusiast always. Building the future one line at a time.",
    personality: "enthusiast",
    interests: ["tech", "gaming", "coding", "startups"],
    postFrequency: "medium",
    isBot: true,
  },
  {
    username: "sarah_thrifts",
    displayName: "Sarah Miller",
    bio: "Sustainable fashion advocate. Thrifting is my cardio.",
    personality: "casual",
    interests: ["thrifting", "sustainability", "fashion", "diy"],
    postFrequency: "high",
    isBot: true,
  },
  {
    username: "alex_trades",
    displayName: "Alex Rivera",
    bio: "Collector & trader. If you have something cool, let's make a deal.",
    personality: "professional",
    interests: ["trading", "collectibles", "sneakers", "vinyl"],
    postFrequency: "medium",
    isBot: true,
  },
  {
    username: "jenna_vintage",
    displayName: "Jenna Park",
    bio: "90s kid living the aesthetic. Vintage everything.",
    personality: "creative",
    interests: ["90s", "vintage", "music", "aesthetic"],
    postFrequency: "low",
    isBot: true,
  },
  {
    username: "mike_flips",
    displayName: "Mike Thompson",
    bio: "Professional flipper. Estate sales are my playground.",
    personality: "professional",
    interests: ["flipping", "antiques", "business", "hustle"],
    postFrequency: "high",
    isBot: true,
  },
];

const textPostTemplates = {
  casual: [
    "Just found the most amazing thing at the flea market today",
    "Who else loves a good thrift haul? Show me what you got",
    "That feeling when you find exactly what you were looking for",
    "Anyone else spend way too much time browsing here?",
    "Weekend plans: coffee and browsing listings",
    "Just listed some new stuff, check it out",
  ],
  professional: [
    "New inventory just dropped. Quality items, fair prices",
    "Been doing this for years and the community here is amazing",
    "Pro tip: always check the seller ratings before buying",
    "Shipped out 10 orders today. Thanks for the support",
    "Looking for bulk deals? DM me",
    "Market update: vintage electronics are trending up",
  ],
  creative: [
    "Every item has a story. What's yours?",
    "Curating my collection one piece at a time",
    "Found this gem and had to share",
    "The hunt is half the fun",
    "Aesthetic finds only",
    "Creating something special from secondhand treasures",
  ],
  enthusiast: [
    "Deep dive into today's new listings - some hidden gems in there",
    "The algorithm blessed me today, check out this find",
    "Anyone else refreshing the feed at 3am? Just me?",
    "This community gets it. You all are amazing",
    "Testing out a new category. Thoughts?",
    "Data says weekends are best for selling. Let's test that theory",
  ],
};

const listingTemplates: { title: string; price: number; category: ListingCategory; location: string; imageId: number }[] = [
  { title: "Vintage Polaroid Camera - Working Condition", price: 65, category: "flea-market", location: "Ships nationwide", imageId: 250 },
  { title: "Retro Nintendo 64 + 3 Games", price: 120, category: "electronics", location: "Local pickup", imageId: 96 },
  { title: "Designer Handbag - Gently Used", price: 85, category: "thrift-shop", location: "Ships nationwide", imageId: 1062 },
  { title: "Vinyl Record Collection - 20 Albums", price: 150, category: "flea-market", location: "Local only", imageId: 145 },
  { title: "Mechanical Watch - Needs Battery", price: 45, category: "flea-market", location: "Ships nationwide", imageId: 175 },
  { title: "Vintage Band Tees - 5 Pack", price: 55, category: "thrift-shop", location: "Ships nationwide", imageId: 399 },
  { title: "Trading: MacBook Air for Gaming Laptop", price: 0, category: "exchange", location: "Local meetup", imageId: 180 },
  { title: "Refurbished iPad Mini 5", price: 180, category: "electronics", location: "Ships nationwide", imageId: 160 },
  { title: "Antique Brass Candlesticks Pair", price: 40, category: "flea-market", location: "Local pickup", imageId: 1076 },
  { title: "90s Denim Jacket - Size M", price: 38, category: "thrift-shop", location: "Ships nationwide", imageId: 996 },
  { title: "Sony WH-1000XM4 Headphones", price: 175, category: "electronics", location: "Ships nationwide", imageId: 1 },
  { title: "Trade: Pokemon Cards for Yu-Gi-Oh", price: 0, category: "exchange", location: "Meetup or mail", imageId: 357 },
  { title: "Vintage Leather Boots - Size 10", price: 70, category: "thrift-shop", location: "Ships nationwide", imageId: 1068 },
  { title: "Old School Boombox - Works Great", price: 95, category: "flea-market", location: "Local only", imageId: 366 },
  { title: "Cherry MX Blue Keyboard", price: 65, category: "electronics", location: "Ships nationwide", imageId: 60 },
];

const textPostImages = [
  1003, 1004, 1005, 1006, 1008, 1009, 1010, 1011, 1012, 1013, 1015, 1016, 1018, 1019, 1020,
  1021, 1022, 1024, 1025, 1027, 1029, 1031, 1033, 1035, 1036, 1037, 1038, 1039, 1040, 1041,
  1042, 1043, 1044, 1045, 1047, 1048, 1049, 1050, 1051, 1052, 1053, 1054, 1055, 1057, 1058,
  1059, 1060, 1061, 1063, 1064, 1067, 1069, 1071, 1073, 1074, 1078, 1080, 1082, 1083, 1084,
];

const picsum = (id: number, w = 600, h = 600) => `https://picsum.photos/id/${id}/${w}/${h}`;

const BOT_POSTS_KEY = "dah.bot.posts";
const BOT_LAST_RUN_KEY = "dah.bot.lastRun";

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateBotPost(bot: BotUser): Post {
  const isListing = Math.random() > 0.6;
  const id = `bot-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  if (isListing) {
    const template = getRandomItem(listingTemplates);
    return {
      id,
      type: "listing",
      user: bot.username,
      title: template.title,
      price: template.price + Math.floor(Math.random() * 20) - 10,
      location: template.location,
      category: template.category,
      media: picsum(template.imageId, 600, 600),
    };
  } else {
    const templates = textPostTemplates[bot.personality];
    const imageId = getRandomItem(textPostImages);
    return {
      id,
      type: "text",
      user: bot.username,
      content: getRandomItem(templates),
      media: picsum(imageId, 800, 800),
    };
  }
}

export function getBotPosts(): Post[] {
  return lsGet<Post[]>(BOT_POSTS_KEY, []);
}

export function initializeBotEcosystem(): Post[] {
  const existingPosts = getBotPosts();
  const hasMedia = existingPosts.length > 0 && existingPosts.some((p) => (p as any).media);
  if (existingPosts.length > 0 && hasMedia) return existingPosts;

  const initialPosts: Post[] = [];
  
  botUsers.forEach(bot => {
    const postCount = bot.postFrequency === "high" ? 4 : bot.postFrequency === "medium" ? 2 : 1;
    for (let i = 0; i < postCount; i++) {
      initialPosts.push(generateBotPost(bot));
    }
  });
  
  for (let i = initialPosts.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [initialPosts[i], initialPosts[j]] = [initialPosts[j], initialPosts[i]];
  }
  
  lsSet(BOT_POSTS_KEY, initialPosts);
  lsSet(BOT_LAST_RUN_KEY, Date.now());
  
  return initialPosts;
}

export function maybeGenerateNewBotPost(): Post | null {
  const lastRun = lsGet<number>(BOT_LAST_RUN_KEY, 0);
  const hoursSinceLastRun = (Date.now() - lastRun) / (1000 * 60 * 60);
  
  if (hoursSinceLastRun < 0.5) return null;
  
  if (Math.random() > 0.3) {
    lsSet(BOT_LAST_RUN_KEY, Date.now());
    return null;
  }
  
  const bot = getRandomItem(botUsers);
  const post = generateBotPost(bot);
  
  const posts = getBotPosts();
  posts.unshift(post);
  if (posts.length > 100) posts.pop();
  lsSet(BOT_POSTS_KEY, posts);
  lsSet(BOT_LAST_RUN_KEY, Date.now());
  
  return post;
}

export function getBotUser(username: string): BotUser | undefined {
  return botUsers.find(b => b.username === username);
}

export function isBotUser(username: string): boolean {
  return botUsers.some(b => b.username === username);
}
