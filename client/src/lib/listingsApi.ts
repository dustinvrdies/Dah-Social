import { fetchJson } from "./api";

export type ApiListing = {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: string;
  condition: string;
  priceCents: number;
  currency: string;
  location?: string | null;
  createdAt: string;
  username: string;
  profile: { displayName?: string | null; avatarUrl?: string | null } | null;
  media?: { url: string; type: "image" | "video" }[];
};

export async function listListings(
  limit = 30,
  cursor?: string,
  filters?: {
    q?: string;
    category?: string;
    minPriceCents?: number;
    maxPriceCents?: number;
    condition?: string;
    sort?: "new" | "price-asc" | "price-desc";
    hasMedia?: boolean;
  }
) {
  const q = new URLSearchParams();
  q.set("limit", String(limit));
  if (cursor) q.set("cursor", cursor);
  if (filters?.q) q.set("q", filters.q);
  if (filters?.category) q.set("category", filters.category);
  if (typeof filters?.minPriceCents === "number") q.set("minPriceCents", String(filters.minPriceCents));
  if (typeof filters?.maxPriceCents === "number") q.set("maxPriceCents", String(filters.maxPriceCents));
  if (filters?.condition) q.set("condition", filters.condition);
  if (filters?.sort) q.set("sort", filters.sort);
  if (typeof filters?.hasMedia === "boolean") q.set("hasMedia", filters.hasMedia ? "1" : "0");

  return fetchJson<{ listings: ApiListing[]; nextCursor: string | null }>(`/api/listings?${q.toString()}`, { method: "GET" });
}

export async function createListing(input: {
  title: string;
  description?: string;
  category: string;
  condition: "new" | "like-new" | "used" | "for-parts";
  priceCents: number;
  currency?: string;
  location?: string;
  media?: { url: string; type: "image" | "video" }[];
}) {
  return fetchJson<{ listing: ApiListing }>(`/api/listings`, {
    method: "POST",
    body: JSON.stringify(input),
  });
}
