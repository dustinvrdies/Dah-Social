import { Post, ListingCategory, Store } from "./postTypes";

export const initialFeed: Post[] = [
  {
    id: "p1",
    type: "text",
    user: "dah",
    content: "Welcome to DAH Social. Build your profile. Post your world."
  },
  {
    id: "v1",
    type: "video",
    user: "dustin",
    src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
    caption: "First DAH video post."
  },
  {
    id: "m1",
    type: "listing",
    user: "seller1",
    title: "Used iPhone 12 (Good condition)",
    price: 250,
    location: "Local pickup",
    media: "",
    category: "electronics"
  },
  {
    id: "m2",
    type: "listing",
    user: "thriftqueen",
    title: "Vintage Denim Jacket - 90s Style",
    price: 35,
    location: "Ships nationwide",
    media: "",
    category: "thrift-shop"
  },
  {
    id: "m3",
    type: "listing",
    user: "fleafinds",
    title: "Antique Brass Lamp",
    price: 45,
    location: "Local pickup only",
    media: "",
    category: "flea-market"
  },
  {
    id: "m4",
    type: "listing",
    user: "techswap",
    title: "Trading: PS5 for Xbox Series X",
    price: 0,
    location: "Willing to meet up",
    media: "",
    category: "exchange"
  },
  {
    id: "m5",
    type: "listing",
    user: "vintagevault",
    title: "Retro Band T-Shirts Bundle (5 shirts)",
    price: 60,
    location: "Ships nationwide",
    media: "",
    category: "thrift-shop"
  },
  {
    id: "m6",
    type: "listing",
    user: "gadgetguru",
    title: "Mechanical Keyboard - Cherry MX Blues",
    price: 85,
    location: "Local pickup",
    media: "",
    category: "electronics"
  },
  {
    id: "m7",
    type: "listing",
    user: "fleafinds",
    title: "Vintage Vinyl Records Collection",
    price: 120,
    location: "Local pickup only",
    media: "",
    category: "flea-market"
  },
  {
    id: "m8",
    type: "listing",
    user: "bookworm",
    title: "Exchange: Harry Potter set for LOTR set",
    price: 0,
    location: "Local meetup preferred",
    media: "",
    category: "exchange"
  },
  {
    id: "p2",
    type: "text",
    user: "admin",
    content: "Minors (13-17) earn double DAH Coins: half now, half locked for college."
  }
];

import { getPosts } from "./posts";

export const videoOnlyFeed = initialFeed.filter(p => p.type === "video");
export const mallOnlyFeed = initialFeed.filter(p => p.type === "listing");

export function getAllPosts(): Post[] {
  return getPosts(initialFeed);
}

export function getListingsByCategory(category: ListingCategory | null): Post[] {
  const allPosts = getAllPosts();
  const listings = allPosts.filter(p => p.type === "listing");
  if (!category) return listings;
  return listings.filter(p => p.type === "listing" && p.category === category);
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
  return stores.find(s => s.id === storeId);
}

export function getListingsByStore(storeOwner: string): Post[] {
  const allPosts = getAllPosts();
  return allPosts.filter(p => p.type === "listing" && p.user === storeOwner);
}

export function getFeaturedStores(): Store[] {
  return stores.filter(s => s.featured);
}
