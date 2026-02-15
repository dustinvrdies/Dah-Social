import { lsGet, lsSet } from "./storage";
import { spendCoins, addCoins, getWallet } from "./dahCoins";

export type RewardCategory = "gift-cards" | "dah-products" | "boosts" | "promos";

export type RewardItem = {
  id: string;
  name: string;
  description: string;
  category: RewardCategory;
  price: number;
  icon: string;
  stock: number | null;
  featured: boolean;
  tier: "bronze" | "silver" | "gold" | "platinum";
  limitedEdition?: boolean;
  originalPrice?: number;
};

export type FlashSale = {
  id: string;
  itemId: string;
  discountPercent: number;
  startTime: number;
  endTime: number;
  claimed: number;
  maxClaims: number;
};

export type CoinStake = {
  id: string;
  username: string;
  amount: number;
  multiplier: number;
  duration: number;
  startTime: number;
  endTime: number;
  status: "active" | "completed" | "claimed";
  reward: number;
};

export type Redemption = {
  id: string;
  username: string;
  itemId: string;
  itemName: string;
  category: RewardCategory;
  price: number;
  redeemedAt: number;
  status: "pending" | "fulfilled" | "delivered";
  code?: string;
};

const REDEMPTIONS_KEY = (u: string) => `dah.redemptions.${u}`;
const STAKES_KEY = (u: string) => `dah.stakes.${u}`;
const FLASH_SALES_KEY = "dah.flash.sales";

export function getFlashSales(): FlashSale[] {
  const now = Date.now();
  const stored = lsGet<FlashSale[]>(FLASH_SALES_KEY, []);
  if (stored.length > 0 && stored.some(s => s.endTime > now)) {
    return stored.filter(s => s.endTime > now && s.claimed < s.maxClaims);
  }
  const sales = generateFlashSales();
  lsSet(FLASH_SALES_KEY, sales);
  return sales.filter(s => s.endTime > now && s.claimed < s.maxClaims);
}

function generateFlashSales(): FlashSale[] {
  const now = Date.now();
  const saleItems = [
    { itemId: "gc-amazon-10", discount: 30, max: 10, hours: 4 },
    { itemId: "gc-starbucks-5", discount: 25, max: 15, hours: 6 },
    { itemId: "boost-post", discount: 40, max: 20, hours: 3 },
    { itemId: "dp-badge-custom", discount: 20, max: 8, hours: 5 },
    { itemId: "gc-visa-25", discount: 15, max: 5, hours: 2 },
    { itemId: "boost-2x-coins", discount: 35, max: 12, hours: 4 },
  ];
  const picked = saleItems.sort(() => Math.random() - 0.5).slice(0, 3);
  return picked.map((s, i) => ({
    id: `flash-${now}-${i}`,
    itemId: s.itemId,
    discountPercent: s.discount,
    startTime: now,
    endTime: now + s.hours * 60 * 60 * 1000,
    claimed: Math.floor(Math.random() * Math.floor(s.max * 0.3)),
    maxClaims: s.max,
  }));
}

export function getFlashSaleForItem(itemId: string): FlashSale | null {
  const sales = getFlashSales();
  return sales.find(s => s.itemId === itemId) || null;
}

export function getFlashPrice(item: RewardItem): number {
  const sale = getFlashSaleForItem(item.id);
  if (!sale) return item.price;
  return Math.floor(item.price * (1 - sale.discountPercent / 100));
}

export function claimFlashSale(saleId: string): boolean {
  const sales = lsGet<FlashSale[]>(FLASH_SALES_KEY, []);
  const sale = sales.find(s => s.id === saleId);
  if (!sale || sale.claimed >= sale.maxClaims || sale.endTime < Date.now()) return false;
  sale.claimed++;
  lsSet(FLASH_SALES_KEY, sales);
  return true;
}

export function getStakes(username: string): CoinStake[] {
  return lsGet<CoinStake[]>(STAKES_KEY(username), []);
}

export function createStake(username: string, amount: number, durationDays: number): { success: boolean; message: string; stake?: CoinStake } {
  const wallet = getWallet(username);
  if (wallet.available < amount) {
    return { success: false, message: "Not enough coins to stake" };
  }
  if (amount < 50) {
    return { success: false, message: "Minimum stake is 50 DAH Coins" };
  }

  const multiplier = durationDays <= 3 ? 1.1 : durationDays <= 7 ? 1.25 : durationDays <= 14 ? 1.5 : 2.0;
  const reward = Math.floor(amount * multiplier);
  const now = Date.now();

  const spent = spendCoins(username, amount, `Staked ${amount} coins for ${durationDays} days`);
  if (!spent) return { success: false, message: "Transaction failed" };

  const stake: CoinStake = {
    id: `stake-${now}-${Math.random().toString(36).slice(2)}`,
    username,
    amount,
    multiplier,
    duration: durationDays,
    startTime: now,
    endTime: now + durationDays * 24 * 60 * 60 * 1000,
    status: "active",
    reward,
  };

  const stakes = getStakes(username);
  stakes.unshift(stake);
  lsSet(STAKES_KEY(username), stakes);

  return { success: true, message: `Staked ${amount} coins! You'll earn ${reward} coins in ${durationDays} days.`, stake };
}

export function claimStake(username: string, stakeId: string): { success: boolean; message: string } {
  const stakes = getStakes(username);
  const stake = stakes.find(s => s.id === stakeId);
  if (!stake) return { success: false, message: "Stake not found" };
  if (stake.status === "claimed") return { success: false, message: "Already claimed" };
  if (stake.endTime > Date.now()) return { success: false, message: "Stake period not complete yet" };

  stake.status = "claimed";
  lsSet(STAKES_KEY(username), stakes);
  addCoins(username, 18, `Stake reward (${stake.multiplier}x)`, stake.reward);
  return { success: true, message: `Claimed ${stake.reward} DAH Coins!` };
}

export function checkAndUpdateStakes(username: string): CoinStake[] {
  const stakes = getStakes(username);
  let changed = false;
  stakes.forEach(s => {
    if (s.status === "active" && s.endTime <= Date.now()) {
      s.status = "completed";
      changed = true;
    }
  });
  if (changed) lsSet(STAKES_KEY(username), stakes);
  return stakes;
}

export const limitedEditionItems: RewardItem[] = [
  {
    id: "le-og-badge",
    name: "OG Founder Badge",
    description: "Exclusive badge for early DAH Social members. Never available again.",
    category: "dah-products",
    price: 2000,
    icon: "award",
    stock: 100,
    featured: true,
    tier: "platinum",
    limitedEdition: true,
  },
  {
    id: "le-holographic-frame",
    name: "Holographic Avatar Frame",
    description: "Rare animated holographic frame that shifts colors. Limited run.",
    category: "dah-products",
    price: 1500,
    icon: "sparkles",
    stock: 200,
    featured: true,
    tier: "gold",
    limitedEdition: true,
  },
  {
    id: "le-diamond-theme",
    name: "Diamond Profile Theme",
    description: "Premium diamond-accented profile theme with particle effects.",
    category: "dah-products",
    price: 3000,
    icon: "palette",
    stock: 50,
    featured: true,
    tier: "platinum",
    limitedEdition: true,
  },
  {
    id: "le-mega-boost",
    name: "Mega Visibility Boost",
    description: "10x post visibility for 48 hours. Maximum exposure.",
    category: "boosts",
    price: 2500,
    icon: "trending-up",
    stock: 75,
    featured: false,
    tier: "platinum",
    limitedEdition: true,
  },
  {
    id: "le-custom-emoji",
    name: "Custom Reaction Pack",
    description: "Create 5 custom reactions only you can use. Ultra rare.",
    category: "dah-products",
    price: 1800,
    icon: "sticker",
    stock: 150,
    featured: true,
    tier: "gold",
    limitedEdition: true,
  },
];

export const rewardItems: RewardItem[] = [
  {
    id: "gc-amazon-5",
    name: "$5 Amazon Gift Card",
    description: "Redeemable at Amazon.com for millions of items",
    category: "gift-cards",
    price: 500,
    icon: "shopping-cart",
    stock: null,
    featured: true,
    tier: "bronze",
  },
  {
    id: "gc-amazon-10",
    name: "$10 Amazon Gift Card",
    description: "More value for your DAH Coins at Amazon",
    category: "gift-cards",
    price: 950,
    icon: "shopping-cart",
    stock: null,
    featured: false,
    tier: "silver",
  },
  {
    id: "gc-amazon-25",
    name: "$25 Amazon Gift Card",
    description: "Premium Amazon gift card for big purchases",
    category: "gift-cards",
    price: 2200,
    icon: "shopping-cart",
    stock: null,
    featured: false,
    tier: "gold",
  },
  {
    id: "gc-starbucks-5",
    name: "$5 Starbucks Gift Card",
    description: "Treat yourself to your favorite coffee drink",
    category: "gift-cards",
    price: 500,
    icon: "coffee",
    stock: null,
    featured: true,
    tier: "bronze",
  },
  {
    id: "gc-starbucks-10",
    name: "$10 Starbucks Gift Card",
    description: "Multiple visits to your local Starbucks",
    category: "gift-cards",
    price: 950,
    icon: "coffee",
    stock: null,
    featured: false,
    tier: "silver",
  },
  {
    id: "gc-visa-10",
    name: "$10 Visa Prepaid Card",
    description: "Use anywhere Visa is accepted, online or in-store",
    category: "gift-cards",
    price: 1000,
    icon: "credit-card",
    stock: null,
    featured: true,
    tier: "silver",
  },
  {
    id: "gc-visa-25",
    name: "$25 Visa Prepaid Card",
    description: "Premium prepaid Visa for any purchase",
    category: "gift-cards",
    price: 2400,
    icon: "credit-card",
    stock: null,
    featured: false,
    tier: "gold",
  },
  {
    id: "gc-visa-50",
    name: "$50 Visa Prepaid Card",
    description: "Our highest value prepaid card reward",
    category: "gift-cards",
    price: 4500,
    icon: "credit-card",
    stock: null,
    featured: false,
    tier: "platinum",
  },
  {
    id: "gc-uber-10",
    name: "$10 Uber Gift Card",
    description: "Ride anywhere or order food with Uber Eats",
    category: "gift-cards",
    price: 950,
    icon: "car",
    stock: null,
    featured: false,
    tier: "silver",
  },
  {
    id: "gc-apple-10",
    name: "$10 Apple Gift Card",
    description: "Apps, games, music, and more from the App Store",
    category: "gift-cards",
    price: 1000,
    icon: "smartphone",
    stock: null,
    featured: false,
    tier: "silver",
  },
  {
    id: "gc-google-10",
    name: "$10 Google Play Card",
    description: "Apps, games, movies, and more from Google Play",
    category: "gift-cards",
    price: 1000,
    icon: "play",
    stock: null,
    featured: false,
    tier: "silver",
  },
  {
    id: "gc-doordash-10",
    name: "$10 DoorDash Gift Card",
    description: "Get food delivered from your favorite restaurants",
    category: "gift-cards",
    price: 950,
    icon: "utensils",
    stock: null,
    featured: false,
    tier: "silver",
  },

  {
    id: "dah-badge-custom",
    name: "Custom Profile Badge",
    description: "A unique badge displayed next to your username across the platform",
    category: "dah-products",
    price: 200,
    icon: "award",
    stock: null,
    featured: true,
    tier: "bronze",
  },
  {
    id: "dah-theme-pack",
    name: "Premium Theme Pack",
    description: "Unlock 5 exclusive profile themes with custom colors and effects",
    category: "dah-products",
    price: 350,
    icon: "palette",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "dah-avatar-frame",
    name: "Animated Avatar Frame",
    description: "A glowing animated frame around your profile picture",
    category: "dah-products",
    price: 300,
    icon: "sparkles",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "dah-username-color",
    name: "Colored Username",
    description: "Display your username in a gradient color of your choice",
    category: "dah-products",
    price: 250,
    icon: "type",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "dah-chat-sticker-pack",
    name: "Exclusive Sticker Pack",
    description: "30 unique DAH stickers for inbox messages and comments",
    category: "dah-products",
    price: 150,
    icon: "sticker",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "dah-verified-badge",
    name: "Verified Creator Badge",
    description: "Show you are a recognized creator with the purple verified check",
    category: "dah-products",
    price: 1500,
    icon: "check-circle",
    stock: null,
    featured: true,
    tier: "gold",
  },

  {
    id: "boost-post-24h",
    name: "Post Boost (24h)",
    description: "Your next post appears at the top of followers' feeds for 24 hours",
    category: "boosts",
    price: 100,
    icon: "trending-up",
    stock: null,
    featured: true,
    tier: "bronze",
  },
  {
    id: "boost-post-72h",
    name: "Post Boost (72h)",
    description: "Extended visibility boost lasting 3 full days",
    category: "boosts",
    price: 250,
    icon: "trending-up",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "boost-profile-week",
    name: "Profile Spotlight (7 days)",
    description: "Your profile appears in 'Who to Follow' suggestions for a week",
    category: "boosts",
    price: 400,
    icon: "eye",
    stock: null,
    featured: true,
    tier: "silver",
  },
  {
    id: "boost-listing-featured",
    name: "Featured Listing (48h)",
    description: "Your mall listing gets a 'Featured' badge and priority placement",
    category: "boosts",
    price: 150,
    icon: "star",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "boost-story-highlight",
    name: "Story Priority",
    description: "Your story appears first in everyone's story bar for 12 hours",
    category: "boosts",
    price: 200,
    icon: "zap",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "boost-double-coins-24h",
    name: "2x Coin Earning (24h)",
    description: "Double all DAH Coin earnings from engagement for 24 hours",
    category: "boosts",
    price: 500,
    icon: "coins",
    stock: null,
    featured: true,
    tier: "silver",
  },

  {
    id: "promo-free-listing",
    name: "Free Listing Promotion",
    description: "List up to 5 items in the Mall with zero listing fees",
    category: "promos",
    price: 75,
    icon: "tag",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "promo-ad-credit",
    name: "Ad Credit (100 impressions)",
    description: "Run your own native ad across the platform to promote your content",
    category: "promos",
    price: 300,
    icon: "megaphone",
    stock: null,
    featured: true,
    tier: "bronze",
  },
  {
    id: "promo-ad-credit-500",
    name: "Ad Credit (500 impressions)",
    description: "Large-scale ad campaign across feed and video sections",
    category: "promos",
    price: 1200,
    icon: "megaphone",
    stock: null,
    featured: false,
    tier: "silver",
  },
  {
    id: "promo-group-spotlight",
    name: "Group Spotlight",
    description: "Feature your group on the Groups page for 48 hours",
    category: "promos",
    price: 200,
    icon: "users",
    stock: null,
    featured: false,
    tier: "bronze",
  },
  {
    id: "promo-avenue-banner",
    name: "Avenue Banner Ad",
    description: "Custom banner displayed in your avenue for 7 days",
    category: "promos",
    price: 350,
    icon: "layout",
    stock: null,
    featured: false,
    tier: "silver",
  },
];

function generateRedemptionCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DAH-";
  for (let i = 0; i < 12; i++) {
    if (i > 0 && i % 4 === 0) code += "-";
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function getRedemptions(username: string): Redemption[] {
  return lsGet<Redemption[]>(REDEMPTIONS_KEY(username), []);
}

export function getAllItems(): RewardItem[] {
  return [...rewardItems, ...limitedEditionItems];
}

export function redeemItem(username: string, itemId: string, useFlashPrice?: boolean): { success: boolean; message: string; redemption?: Redemption } {
  const allItems = getAllItems();
  const item = allItems.find(r => r.id === itemId);
  if (!item) return { success: false, message: "Item not found" };

  if (item.limitedEdition && item.stock !== null && item.stock <= 0) {
    return { success: false, message: "This limited edition item is sold out!" };
  }

  let price = item.price;
  let flashSale: FlashSale | null = null;
  if (useFlashPrice) {
    flashSale = getFlashSaleForItem(item.id);
    if (flashSale) {
      price = Math.floor(item.price * (1 - flashSale.discountPercent / 100));
    }
  }

  const wallet = getWallet(username);
  if (wallet.available < price) {
    return { success: false, message: `Not enough coins. You need ${price - wallet.available} more DAH Coins.` };
  }

  if (flashSale) {
    const claimed = claimFlashSale(flashSale.id);
    if (!claimed) return { success: false, message: "Flash sale has ended or sold out!" };
  }

  const spent = spendCoins(username, price, `Redeemed: ${item.name}${flashSale ? ' (Flash Sale)' : ''}`);
  if (!spent) return { success: false, message: "Transaction failed. Please try again." };

  if (item.limitedEdition && item.stock !== null) {
    item.stock--;
  }

  const redemption: Redemption = {
    id: `rdm-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    username,
    itemId: item.id,
    itemName: item.name,
    category: item.category,
    price: item.price,
    redeemedAt: Date.now(),
    status: item.category === "gift-cards" ? "pending" : "fulfilled",
    code: item.category === "gift-cards" ? generateRedemptionCode() : undefined,
  };

  const redemptions = getRedemptions(username);
  redemptions.unshift(redemption);
  lsSet(REDEMPTIONS_KEY(username), redemptions);

  return { success: true, message: `Successfully redeemed ${item.name}!`, redemption };
}

export function getItemsByCategory(category: RewardCategory): RewardItem[] {
  return rewardItems.filter(r => r.category === category);
}

export function getFeaturedItems(): RewardItem[] {
  return rewardItems.filter(r => r.featured);
}

export function getTierColor(tier: RewardItem["tier"]): string {
  switch (tier) {
    case "bronze": return "text-amber-600";
    case "silver": return "text-slate-400";
    case "gold": return "text-yellow-500";
    case "platinum": return "text-cyan-400";
    default: return "text-muted-foreground";
  }
}
