export type TextPost = {
  id: string;
  type: "text";
  user: string;
  content: string;
};

export type VideoPost = {
  id: string;
  type: "video";
  user: string;
  src: string;
  caption?: string;
};

export type ListingCategory = "flea-market" | "thrift-shop" | "electronics" | "exchange";

export type ListingPost = {
  id: string;
  type: "listing";
  user: string;
  title: string;
  price: number;
  location?: string;
  media?: string;
  category?: ListingCategory;
};

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

export type Post = TextPost | VideoPost | ListingPost | AdPost;
