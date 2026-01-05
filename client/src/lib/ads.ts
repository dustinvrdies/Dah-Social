import { lsGet, lsSet } from "./storage";

function isSSR() {
  return typeof window === "undefined";
}

export type AdPost = {
  id: string;
  type: "ad";
  advertiser: string;
  headline: string;
  caption: string;
  media?: string;
  videoSrc?: string;
  cta: string;
  ctaUrl: string;
  impressions: number;
  clicks: number;
  revenue: number;
};

export type AdImpression = {
  adId: string;
  ts: number;
  username: string;
  type: "impression" | "click";
};

type AdState = {
  ads: AdPost[];
  impressions: AdImpression[];
  totalRevenue: number;
};

const KEY = "dah.ads.state";

const defaultAds: AdPost[] = [
  {
    id: "ad-1",
    type: "ad",
    advertiser: "TechGear Pro",
    headline: "Level Up Your Setup",
    caption: "Premium wireless earbuds with 48hr battery life. Free shipping on orders over $50.",
    media: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600",
    cta: "Shop Now",
    ctaUrl: "/mall",
    impressions: 0,
    clicks: 0,
    revenue: 0,
  },
  {
    id: "ad-2",
    type: "ad",
    advertiser: "StyleBox",
    headline: "New Arrivals Weekly",
    caption: "Curated fashion drops every Friday. Join 50K+ members getting first access.",
    media: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600",
    cta: "Browse Styles",
    ctaUrl: "/mall",
    impressions: 0,
    clicks: 0,
    revenue: 0,
  },
  {
    id: "ad-3",
    type: "ad",
    advertiser: "FitLife",
    headline: "Transform Your Routine",
    caption: "Smart fitness gear that tracks everything. Start your journey today.",
    videoSrc: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    cta: "Get Started",
    ctaUrl: "/mall",
    impressions: 0,
    clicks: 0,
    revenue: 0,
  },
  {
    id: "ad-4",
    type: "ad",
    advertiser: "HomeVibes",
    headline: "Make Any Space Yours",
    caption: "Minimalist decor that speaks volumes. Up to 40% off this week only.",
    media: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600",
    cta: "Explore",
    ctaUrl: "/mall",
    impressions: 0,
    clicks: 0,
    revenue: 0,
  },
];

function getState(): AdState {
  if (isSSR()) return { ads: defaultAds, impressions: [], totalRevenue: 0 };
  return lsGet<AdState>(KEY, {
    ads: defaultAds,
    impressions: [],
    totalRevenue: 0,
  });
}

function saveState(state: AdState) {
  lsSet(KEY, state);
}

export function getAds(): AdPost[] {
  return getState().ads;
}

export function getRandomAd(): AdPost {
  const ads = getAds();
  return ads[Math.floor(Math.random() * ads.length)];
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

export function getTotalRevenue(): number {
  return getState().totalRevenue;
}

export function getAdStats(): { impressions: number; clicks: number; revenue: number } {
  const state = getState();
  return {
    impressions: state.impressions.filter(i => i.type === "impression").length,
    clicks: state.impressions.filter(i => i.type === "click").length,
    revenue: state.totalRevenue,
  };
}
