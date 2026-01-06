import { Post, ListingCategory, Store } from "./postTypes";
import { initializeBotEcosystem, maybeGenerateNewBotPost, getBotPosts } from "./botUsers";

const picsum = (id: number, w = 600, h = 600) => `https://picsum.photos/id/${id}/${w}/${h}`;

export const initialFeed: Post[] = [
  {
    id: "p1",
    type: "text",
    user: "dah",
    content: "Welcome to DAH Social. Build your profile. Post your world.",
    media: picsum(1015, 800, 600),
  },
  {
    id: "v1",
    type: "video",
    user: "maya_creates",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    caption: "Late night creative session vibes",
  },
  {
    id: "img1",
    type: "text",
    user: "sarah_thrifts",
    content: "Today's thrift haul was absolutely unreal. Found some gems hidden in the back.",
    media: picsum(1005, 800, 800),
  },
  {
    id: "m1",
    type: "listing",
    user: "seller1",
    title: "Used iPhone 12 (Good condition)",
    price: 250,
    location: "Local pickup",
    media: picsum(160, 600, 600),
    category: "electronics",
  },
  {
    id: "v2",
    type: "video",
    user: "techie_marcus",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    caption: "Weekend project coming together nicely",
  },
  {
    id: "img2",
    type: "text",
    user: "jenna_vintage",
    content: "90s aesthetic forever. This jacket was calling my name.",
    media: picsum(1025, 800, 800),
  },
  {
    id: "m2",
    type: "listing",
    user: "thriftqueen",
    title: "Vintage Denim Jacket - 90s Style",
    price: 35,
    location: "Ships nationwide",
    media: picsum(996, 600, 600),
    category: "thrift-shop",
  },
  {
    id: "img3",
    type: "text",
    user: "alex_trades",
    content: "New additions to the collection. Who wants to trade?",
    media: picsum(250, 800, 800),
  },
  {
    id: "v3",
    type: "video",
    user: "sarah_thrifts",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    caption: "Vintage store tour - so many finds today",
  },
  {
    id: "m3",
    type: "listing",
    user: "fleafinds",
    title: "Antique Brass Lamp",
    price: 45,
    location: "Local pickup only",
    media: picsum(1076, 600, 600),
    category: "flea-market",
  },
  {
    id: "img4",
    type: "text",
    user: "mike_flips",
    content: "Estate sale score! Sometimes you just get lucky.",
    media: picsum(1047, 800, 800),
  },
  {
    id: "m4",
    type: "listing",
    user: "techswap",
    title: "Trading: PS5 for Xbox Series X",
    price: 0,
    location: "Willing to meet up",
    media: picsum(119, 600, 600),
    category: "exchange",
  },
  {
    id: "v4",
    type: "video",
    user: "jenna_vintage",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    caption: "Curating my vinyl collection - what should I add next?",
  },
  {
    id: "img5",
    type: "text",
    user: "maya_creates",
    content: "Art studio cleanup - found some old pieces I forgot about!",
    media: picsum(1084, 800, 800),
  },
  {
    id: "m5",
    type: "listing",
    user: "vintagevault",
    title: "Retro Band T-Shirts Bundle (5 shirts)",
    price: 60,
    location: "Ships nationwide",
    media: picsum(399, 600, 600),
    category: "thrift-shop",
  },
  {
    id: "img6",
    type: "text",
    user: "techie_marcus",
    content: "Setup upgrade complete. Productivity mode activated.",
    media: picsum(180, 800, 600),
  },
  {
    id: "v5",
    type: "video",
    user: "mike_flips",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    caption: "Flipping process from start to finish - watch and learn",
  },
  {
    id: "m6",
    type: "listing",
    user: "gadgetguru",
    title: "Mechanical Keyboard - Cherry MX Blues",
    price: 85,
    location: "Local pickup",
    media: picsum(1, 600, 600),
    category: "electronics",
  },
  {
    id: "img7",
    type: "text",
    user: "alex_trades",
    content: "Sunday market finds. The hunt never stops.",
    media: picsum(1011, 800, 800),
  },
  {
    id: "m7",
    type: "listing",
    user: "fleafinds",
    title: "Vintage Vinyl Records Collection",
    price: 120,
    location: "Local pickup only",
    media: picsum(145, 600, 600),
    category: "flea-market",
  },
  {
    id: "v6",
    type: "video",
    user: "alex_trades",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
    caption: "Road trip to the swap meet - check what we found",
  },
  {
    id: "img8",
    type: "text",
    user: "sarah_thrifts",
    content: "Sustainable fashion is the future. What do you think of this look?",
    media: picsum(1012, 800, 800),
  },
  {
    id: "m8",
    type: "listing",
    user: "bookworm",
    title: "Exchange: Harry Potter set for LOTR set",
    price: 0,
    location: "Local meetup preferred",
    media: picsum(24, 600, 600),
    category: "exchange",
  },
  {
    id: "img9",
    type: "text",
    user: "jenna_vintage",
    content: "Polaroid moment - nothing beats instant photos",
    media: picsum(1036, 800, 800),
  },
  {
    id: "v7",
    type: "video",
    user: "maya_creates",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
    caption: "Creative process behind my latest piece",
  },
  {
    id: "img10",
    type: "text",
    user: "mike_flips",
    content: "Another day, another flip. This one was worth the drive.",
    media: picsum(1067, 800, 800),
  },
  {
    id: "m9",
    type: "listing",
    user: "maya_creates",
    title: "Handmade Ceramic Vase - One of a Kind",
    price: 78,
    location: "Ships nationwide",
    media: picsum(1080, 600, 600),
    category: "flea-market",
  },
  {
    id: "img11",
    type: "text",
    user: "techie_marcus",
    content: "Retro tech collection growing. Who remembers these?",
    media: picsum(366, 800, 800),
  },
  {
    id: "v8",
    type: "video",
    user: "sarah_thrifts",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
    caption: "Thrift store walkthrough - so many hidden treasures",
  },
  {
    id: "img12",
    type: "text",
    user: "alex_trades",
    content: "Trade completed! Both parties happy - that's what it's all about.",
    media: picsum(343, 800, 800),
  },
  {
    id: "m10",
    type: "listing",
    user: "techie_marcus",
    title: "Raspberry Pi 4 Kit - Complete Setup",
    price: 95,
    location: "Ships nationwide",
    media: picsum(60, 600, 600),
    category: "electronics",
  },
  {
    id: "img13",
    type: "text",
    user: "jenna_vintage",
    content: "Sunset vibes after a successful market day",
    media: picsum(1013, 800, 600),
  },
  {
    id: "v9",
    type: "video",
    user: "techie_marcus",
    src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    caption: "Unboxing the latest tech haul",
  },
  {
    id: "img14",
    type: "text",
    user: "maya_creates",
    content: "Golden hour in the studio. Best time to create.",
    media: picsum(1016, 800, 800),
  },
  {
    id: "m11",
    type: "listing",
    user: "jenna_vintage",
    title: "Vintage Polaroid Camera - Working",
    price: 125,
    location: "Ships worldwide",
    media: picsum(250, 600, 600),
    category: "flea-market",
  },
  {
    id: "img15",
    type: "text",
    user: "mike_flips",
    content: "The warehouse is stocked. Big sale coming this weekend.",
    media: picsum(1057, 800, 800),
  },
  {
    id: "p2",
    type: "text",
    user: "admin",
    content: "Minors (13-17) earn double DAH Coins: half now, half locked for college.",
    media: picsum(1074, 800, 600),
  },
];

import { getPosts } from "./posts";

export const videoOnlyFeed = initialFeed.filter((p) => p.type === "video");
export const mallOnlyFeed = initialFeed.filter((p) => p.type === "listing");

export function getAllPosts(): Post[] {
  initializeBotEcosystem();
  maybeGenerateNewBotPost();

  const userPosts = getPosts(initialFeed);
  const botPosts = getBotPosts();

  const allPosts = [...userPosts, ...botPosts];

  allPosts.sort((a, b) => {
    const aTime = (a as any).timestamp || 0;
    const bTime = (b as any).timestamp || 0;
    return bTime - aTime;
  });

  return allPosts;
}

export function getListingsByCategory(category: ListingCategory | null): Post[] {
  const allPosts = getAllPosts();
  const listings = allPosts.filter((p) => p.type === "listing");
  if (!category) return listings;
  return listings.filter((p) => p.type === "listing" && p.category === category);
}

export const stores: Store[] = [
  {
    id: "thriftqueen",
    name: "Thrift Queen",
    owner: "thriftqueen",
    description: "Curated vintage and secondhand fashion finds. Sustainable style for less.",
    category: "thrift-shop",
    rating: 4.8,
    sales: 234,
    featured: true,
  },
  {
    id: "fleafinds",
    name: "Flea Finds",
    owner: "fleafinds",
    description: "Antiques, collectibles, and unique treasures from estate sales.",
    category: "flea-market",
    rating: 4.6,
    sales: 156,
    featured: true,
  },
  {
    id: "gadgetguru",
    name: "Gadget Guru",
    owner: "gadgetguru",
    description: "Quality refurbished electronics and tech accessories.",
    category: "electronics",
    rating: 4.9,
    sales: 412,
    featured: true,
  },
  {
    id: "techswap",
    name: "Tech Swap Hub",
    owner: "techswap",
    description: "Trade your gaming gear, consoles, and electronics with others.",
    category: "exchange",
    rating: 4.5,
    sales: 89,
    featured: true,
  },
  {
    id: "vintagevault",
    name: "Vintage Vault",
    owner: "vintagevault",
    description: "Retro clothing, accessories, and memorabilia from the 80s and 90s.",
    category: "thrift-shop",
    rating: 4.7,
    sales: 178,
    featured: false,
  },
  {
    id: "seller1",
    name: "Mobile Market",
    owner: "seller1",
    description: "Pre-owned phones and tablets at unbeatable prices.",
    category: "electronics",
    rating: 4.4,
    sales: 67,
    featured: false,
  },
];

export function getStoreById(storeId: string): Store | undefined {
  return stores.find((s) => s.id === storeId);
}

export function getListingsByStore(storeOwner: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter((p) => p.type === "listing" && p.user === storeOwner);
}

export function getFeaturedStores(): Store[] {
  return stores.filter((s) => s.featured);
}
