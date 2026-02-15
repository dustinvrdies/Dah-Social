import { lsGet, lsSet } from "./storage";

function isSSR() {
  return typeof window === "undefined";
}

export type AdFormat = "image" | "video" | "carousel" | "listing" | "story";

export type NativeAd = {
  id: string;
  type: "ad";
  format: AdFormat;
  advertiser: string;
  advertiserHandle: string;
  advertiserVerified: boolean;
  headline: string;
  caption: string;
  media?: string;
  mediaAlt?: string;
  videoSrc?: string;
  carouselImages?: string[];
  listingData?: {
    title: string;
    price: number;
    originalPrice?: number;
    location: string;
    category: string;
  };
  cta: string;
  ctaUrl: string;
  impressions: number;
  clicks: number;
  revenue: number;
  targeting?: {
    interests?: string[];
    ageRange?: [number, number];
    locations?: string[];
  };
};

export type AdImpression = {
  adId: string;
  ts: number;
  username: string;
  type: "impression" | "click" | "view_time";
  duration?: number;
};

type AdState = {
  ads: NativeAd[];
  impressions: AdImpression[];
  totalRevenue: number;
  viewedAds: Record<string, number>;
};

const KEY = "dah.ads.state";

const defaultAds: NativeAd[] = [
  {
    id: "ad-img-1",
    type: "ad",
    format: "image",
    advertiser: "TechGear Pro",
    advertiserHandle: "techgearpro",
    advertiserVerified: true,
    headline: "Level Up Your Setup",
    caption: "Premium wireless earbuds with 48hr battery life. Free shipping on orders over $50. Join 100K+ happy customers who made the switch.",
    media: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
    mediaAlt: "Wireless earbuds in charging case",
    cta: "Shop Now",
    ctaUrl: "/mall",
    impressions: 1247,
    clicks: 89,
    revenue: 25.35,
    targeting: { interests: ["tech", "electronics", "music"] },
  },
  {
    id: "ad-img-2",
    type: "ad",
    format: "image",
    advertiser: "StyleBox",
    advertiserHandle: "stylebox",
    advertiserVerified: true,
    headline: "New Arrivals Weekly",
    caption: "Curated fashion drops every Friday. Join 50K+ members getting first access to exclusive styles and early-bird discounts.",
    media: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
    mediaAlt: "Fashion collection display",
    cta: "Browse Styles",
    ctaUrl: "/mall",
    impressions: 2341,
    clicks: 156,
    revenue: 44.89,
    targeting: { interests: ["fashion", "thrifting", "style"] },
  },
  {
    id: "ad-vid-1",
    type: "ad",
    format: "video",
    advertiser: "FitLife",
    advertiserHandle: "fitlife",
    advertiserVerified: true,
    headline: "Transform Your Routine",
    caption: "Smart fitness gear that tracks everything. Start your journey today with personalized workouts.",
    videoSrc: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_1MB.mp4",
    cta: "Get Started",
    ctaUrl: "/mall",
    impressions: 892,
    clicks: 67,
    revenue: 18.97,
    targeting: { interests: ["fitness", "health", "sports"] },
  },
  {
    id: "ad-vid-2",
    type: "ad",
    format: "video",
    advertiser: "TravelWise",
    advertiserHandle: "travelwise",
    advertiserVerified: true,
    headline: "Adventure Awaits",
    caption: "Explore destinations you've only dreamed of. Book your next adventure with exclusive member rates.",
    videoSrc: "https://test-videos.co.uk/vids/jellyfish/mp4/h264/720/Jellyfish_720_10s_1MB.mp4",
    cta: "Plan Trip",
    ctaUrl: "/mall",
    impressions: 1567,
    clicks: 203,
    revenue: 54.67,
    targeting: { interests: ["travel", "adventure", "photography"] },
  },
  {
    id: "ad-listing-1",
    type: "ad",
    format: "listing",
    advertiser: "Premium Sellers",
    advertiserHandle: "premiumsellers",
    advertiserVerified: true,
    headline: "Featured Listing",
    caption: "Verified seller with 500+ sales. Fast shipping guaranteed.",
    media: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600",
    mediaAlt: "Smart watch product photo",
    listingData: {
      title: "Apple Watch Series 9 - Like New",
      price: 299,
      originalPrice: 399,
      location: "Ships nationwide",
      category: "electronics",
    },
    cta: "View Deal",
    ctaUrl: "/mall",
    impressions: 3421,
    clicks: 287,
    revenue: 80.24,
    targeting: { interests: ["tech", "electronics", "deals"] },
  },
  {
    id: "ad-listing-2",
    type: "ad",
    format: "listing",
    advertiser: "VintageFinds",
    advertiserHandle: "vintagefinds",
    advertiserVerified: true,
    headline: "Promoted Listing",
    caption: "Rare vintage piece from trusted collector. Authenticity guaranteed.",
    media: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600",
    mediaAlt: "Vintage camera",
    listingData: {
      title: "1970s Polaroid SX-70 Camera - Mint Condition",
      price: 189,
      originalPrice: 250,
      location: "Local pickup available",
      category: "flea-market",
    },
    cta: "Make Offer",
    ctaUrl: "/mall",
    impressions: 1876,
    clicks: 134,
    revenue: 38.19,
    targeting: { interests: ["vintage", "photography", "collectibles"] },
  },
  {
    id: "ad-img-3",
    type: "ad",
    format: "image",
    advertiser: "HomeVibes",
    advertiserHandle: "homevibes",
    advertiserVerified: true,
    headline: "Make Any Space Yours",
    caption: "Minimalist decor that speaks volumes. Up to 40% off this week only. Transform your space without breaking the bank.",
    media: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    mediaAlt: "Modern living room interior",
    cta: "Explore",
    ctaUrl: "/mall",
    impressions: 2109,
    clicks: 178,
    revenue: 49.72,
    targeting: { interests: ["home", "decor", "interior design"] },
  },
  {
    id: "ad-vid-3",
    type: "ad",
    format: "video",
    advertiser: "GameZone",
    advertiserHandle: "gamezone",
    advertiserVerified: true,
    headline: "Next-Gen Gaming",
    caption: "Experience gaming like never before. Exclusive bundles available now.",
    videoSrc: "https://test-videos.co.uk/vids/sintel/mp4/h264/720/Sintel_720_10s_1MB.mp4",
    cta: "Shop Gaming",
    ctaUrl: "/mall",
    impressions: 4532,
    clicks: 412,
    revenue: 114.33,
    targeting: { interests: ["gaming", "tech", "entertainment"] },
  },
];

function getState(): AdState {
  if (isSSR()) return { ads: defaultAds, impressions: [], totalRevenue: 0, viewedAds: {} };
  return lsGet<AdState>(KEY, {
    ads: defaultAds,
    impressions: [],
    totalRevenue: 0,
    viewedAds: {},
  });
}

function saveState(state: AdState) {
  lsSet(KEY, state);
}

export function getAds(): NativeAd[] {
  return getState().ads;
}

export function getAdsByFormat(format: AdFormat): NativeAd[] {
  return getAds().filter(a => a.format === format);
}

export function getImageAds(): NativeAd[] {
  return getAdsByFormat("image");
}

export function getVideoAds(): NativeAd[] {
  return getAdsByFormat("video");
}

export function getListingAds(): NativeAd[] {
  return getAdsByFormat("listing");
}

export function getRandomAd(): NativeAd {
  const ads = getAds();
  return ads[Math.floor(Math.random() * ads.length)];
}

export function getRandomAdByFormat(format: AdFormat): NativeAd | null {
  const ads = getAdsByFormat(format);
  if (ads.length === 0) return null;
  return ads[Math.floor(Math.random() * ads.length)];
}

export function getNextFeedAd(index: number): NativeAd | null {
  const ads = getAds().filter(a => a.format === "image" || a.format === "listing");
  if (ads.length === 0) return null;
  return ads[index % ads.length];
}

export function getNextVideoAd(index: number): NativeAd | null {
  const ads = getVideoAds();
  if (ads.length === 0) return null;
  return ads[index % ads.length];
}

export function recordImpression(adId: string, username: string) {
  const state = getState();
  const ad = state.ads.find(a => a.id === adId);
  if (ad) {
    ad.impressions++;
    const cpm = 2.50;
    const earned = cpm / 1000;
    ad.revenue += earned;
    state.totalRevenue += earned;
  }
  state.impressions.push({
    adId,
    ts: Date.now(),
    username,
    type: "impression",
  });
  state.viewedAds[adId] = (state.viewedAds[adId] || 0) + 1;
  saveState(state);
}

export function recordClick(adId: string, username: string) {
  const state = getState();
  const ad = state.ads.find(a => a.id === adId);
  if (ad) {
    ad.clicks++;
    const cpc = 0.25;
    ad.revenue += cpc;
    state.totalRevenue += cpc;
  }
  state.impressions.push({
    adId,
    ts: Date.now(),
    username,
    type: "click",
  });
  saveState(state);
}

export function recordViewTime(adId: string, username: string, durationMs: number) {
  const state = getState();
  const ad = state.ads.find(a => a.id === adId);
  if (ad && durationMs > 3000) {
    const viewBonus = Math.min(durationMs / 30000, 1) * 0.01;
    ad.revenue += viewBonus;
    state.totalRevenue += viewBonus;
  }
  state.impressions.push({
    adId,
    ts: Date.now(),
    username,
    type: "view_time",
    duration: durationMs,
  });
  saveState(state);
}

export function getTotalRevenue(): number {
  return getState().totalRevenue;
}

export function getAdStats(): { impressions: number; clicks: number; revenue: number; ctr: number } {
  const state = getState();
  const impressions = state.impressions.filter(i => i.type === "impression").length;
  const clicks = state.impressions.filter(i => i.type === "click").length;
  return {
    impressions,
    clicks,
    revenue: state.totalRevenue,
    ctr: impressions > 0 ? (clicks / impressions) * 100 : 0,
  };
}

export function hasUserSeenAd(adId: string): boolean {
  const state = getState();
  return (state.viewedAds[adId] || 0) > 0;
}

export function getUserAdEarnings(username: string): number {
  const state = getState();
  const userImpressions = state.impressions.filter(i => i.username === username && i.type === "impression").length;
  const userClicks = state.impressions.filter(i => i.username === username && i.type === "click").length;
  const cpm = 2.50;
  const cpc = 0.25;
  const impressionRevenue = (userImpressions / 1000) * cpm;
  const clickRevenue = userClicks * cpc;
  const userShare = (impressionRevenue + clickRevenue) * 0.6;
  return Math.floor(userShare * 100);
}
