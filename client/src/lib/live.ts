import { lsGet, lsSet } from "./storage";
import { addCoins } from "./dahCoins";
import { pushNotification } from "./notifications";

export interface LiveStream {
  id: string;
  hostUsername: string;
  title: string;
  thumbnailUrl?: string;
  viewerCount: number;
  giftCount: number;
  totalCoins: number;
  startedAt: number;
  isLive: boolean;
  category: string;
}

export interface LiveGift {
  id: string;
  name: string;
  icon: string;
  coinCost: number;
  animation?: string;
}

export interface GiftTransaction {
  streamId: string;
  fromUsername: string;
  giftId: string;
  quantity: number;
  timestamp: number;
}

const LIVE_STREAMS_KEY = "dah.live.streams";
const GIFT_HISTORY_KEY = (streamId: string) => `dah.live.gifts.${streamId}`;

const picsum = (id: number) => `https://picsum.photos/id/${id}/640/360`;

export const gifts: LiveGift[] = [
  { id: "rose", name: "Rose", icon: "flower-2", coinCost: 1 },
  { id: "heart", name: "Heart", icon: "heart", coinCost: 5 },
  { id: "star", name: "Star", icon: "star", coinCost: 10 },
  { id: "fire", name: "Fire", icon: "flame", coinCost: 25 },
  { id: "diamond", name: "Diamond", icon: "gem", coinCost: 50 },
  { id: "crown", name: "Crown", icon: "crown", coinCost: 100 },
  { id: "rocket", name: "Rocket", icon: "rocket", coinCost: 200 },
  { id: "galaxy", name: "Galaxy", icon: "sparkles", coinCost: 500 },
];

const simulatedStreams: LiveStream[] = [
  {
    id: "live1",
    hostUsername: "maya_creates",
    title: "Live painting session - Taking requests!",
    thumbnailUrl: picsum(1084),
    viewerCount: 234,
    giftCount: 45,
    totalCoins: 1250,
    startedAt: Date.now() - 45 * 60000,
    isLive: true,
    category: "Art",
  },
  {
    id: "live2",
    hostUsername: "mike_flips",
    title: "Estate sale haul unboxing - What did I find?",
    thumbnailUrl: picsum(1067),
    viewerCount: 567,
    giftCount: 89,
    totalCoins: 3400,
    startedAt: Date.now() - 30 * 60000,
    isLive: true,
    category: "Shopping",
  },
  {
    id: "live3",
    hostUsername: "sarah_thrifts",
    title: "Thrift with me - Goodwill adventure",
    thumbnailUrl: picsum(996),
    viewerCount: 892,
    giftCount: 156,
    totalCoins: 5600,
    startedAt: Date.now() - 60 * 60000,
    isLive: true,
    category: "Fashion",
  },
  {
    id: "live4",
    hostUsername: "techie_marcus",
    title: "Building a PC from thrifted parts",
    thumbnailUrl: picsum(180),
    viewerCount: 445,
    giftCount: 67,
    totalCoins: 2100,
    startedAt: Date.now() - 90 * 60000,
    isLive: true,
    category: "Tech",
  },
  {
    id: "live5",
    hostUsername: "alex_trades",
    title: "Trading card collection showcase",
    thumbnailUrl: picsum(357),
    viewerCount: 312,
    giftCount: 34,
    totalCoins: 890,
    startedAt: Date.now() - 20 * 60000,
    isLive: true,
    category: "Collectibles",
  },
];

export function getLiveStreams(): LiveStream[] {
  return lsGet<LiveStream[]>(LIVE_STREAMS_KEY, simulatedStreams);
}

export function getLiveStreamById(id: string): LiveStream | undefined {
  return getLiveStreams().find((s) => s.id === id);
}

export function getTopLiveStreams(limit = 10): LiveStream[] {
  return getLiveStreams()
    .filter((s) => s.isLive)
    .sort((a, b) => b.viewerCount - a.viewerCount)
    .slice(0, limit);
}

export function sendGift(
  streamId: string,
  fromUsername: string,
  fromAge: number,
  giftId: string,
  quantity = 1
): { success: boolean; message: string } {
  const gift = gifts.find((g) => g.id === giftId);
  if (!gift) return { success: false, message: "Gift not found" };

  const totalCost = gift.coinCost * quantity;
  const streams = getLiveStreams();
  const stream = streams.find((s) => s.id === streamId);
  if (!stream || !stream.isLive) return { success: false, message: "Stream not found or offline" };

  const result = addCoins(fromUsername, fromAge, `Gift: ${gift.name} x${quantity}`, -totalCost);
  if (!result) return { success: false, message: "Not enough coins" };

  stream.giftCount += quantity;
  stream.totalCoins += totalCost;
  lsSet(LIVE_STREAMS_KEY, streams);

  const hostShare = Math.floor(totalCost * 0.7);
  addCoins(stream.hostUsername, 25, `Gift from @${fromUsername}`, hostShare);

  pushNotification(stream.hostUsername, {
    username: stream.hostUsername,
    type: "coin",
    message: `@${fromUsername} sent you ${quantity}x ${gift.name}! +${hostShare} DAH Coins`,
  });

  const history = lsGet<GiftTransaction[]>(GIFT_HISTORY_KEY(streamId), []);
  history.push({
    streamId,
    fromUsername,
    giftId,
    quantity,
    timestamp: Date.now(),
  });
  lsSet(GIFT_HISTORY_KEY(streamId), history);

  return { success: true, message: `Sent ${quantity}x ${gift.name}!` };
}

export function getStreamGiftHistory(streamId: string): GiftTransaction[] {
  return lsGet<GiftTransaction[]>(GIFT_HISTORY_KEY(streamId), []);
}

export function formatViewerCount(count: number): string {
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count.toString();
}

export function formatStreamDuration(startedAt: number): string {
  const mins = Math.floor((Date.now() - startedAt) / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return `${hours}h ${remainingMins}m`;
}

export const liveCategories = ["Art", "Shopping", "Fashion", "Tech", "Collectibles", "Gaming", "Music", "Lifestyle", "Q&A"];
