import { lsGet, lsSet } from "./storage";
import { addCoins } from "./dahCoins";
import { pushNotification } from "./notifications";

export type ReactionType = "like" | "love" | "haha" | "wow" | "sad" | "angry" | "fire" | "money";

export interface Reaction {
  postId: string;
  username: string;
  type: ReactionType;
  timestamp: number;
}

const REACTIONS_KEY = (postId: string) => `dah.reactions.${postId}`;
const USER_REACTIONS_KEY = (username: string) => `dah.user.reactions.${username}`;

export const reactionConfig: Record<ReactionType, { icon: string; label: string; color: string }> = {
  like: { icon: "thumbs-up", label: "Like", color: "text-blue-500" },
  love: { icon: "heart", label: "Love", color: "text-red-500" },
  haha: { icon: "laugh", label: "Haha", color: "text-yellow-500" },
  wow: { icon: "circle-alert", label: "Wow", color: "text-yellow-500" },
  sad: { icon: "frown", label: "Sad", color: "text-yellow-500" },
  angry: { icon: "angry", label: "Angry", color: "text-orange-500" },
  fire: { icon: "flame", label: "Fire", color: "text-orange-500" },
  money: { icon: "dollar-sign", label: "Money", color: "text-green-500" },
};

export function getReactions(postId: string): Reaction[] {
  return lsGet<Reaction[]>(REACTIONS_KEY(postId), []);
}

export function getReactionCounts(postId: string): Record<ReactionType, number> {
  const reactions = getReactions(postId);
  const counts: Record<ReactionType, number> = {
    like: 0,
    love: 0,
    haha: 0,
    wow: 0,
    sad: 0,
    angry: 0,
    fire: 0,
    money: 0,
  };
  reactions.forEach((r) => {
    counts[r.type]++;
  });
  return counts;
}

export function getTotalReactions(postId: string): number {
  return getReactions(postId).length;
}

export function getUserReaction(postId: string, username: string): ReactionType | null {
  const reactions = getReactions(postId);
  const reaction = reactions.find((r) => r.username === username);
  return reaction?.type || null;
}

export function addReaction(postId: string, username: string, type: ReactionType, postOwner: string, postOwnerAge = 25): boolean {
  const reactions = getReactions(postId);
  const existingIndex = reactions.findIndex((r) => r.username === username);

  if (existingIndex >= 0) {
    if (reactions[existingIndex].type === type) {
      reactions.splice(existingIndex, 1);
      lsSet(REACTIONS_KEY(postId), reactions);
      return false;
    } else {
      reactions[existingIndex].type = type;
      reactions[existingIndex].timestamp = Date.now();
      lsSet(REACTIONS_KEY(postId), reactions);
      return true;
    }
  }

  reactions.push({
    postId,
    username,
    type,
    timestamp: Date.now(),
  });
  lsSet(REACTIONS_KEY(postId), reactions);

  if (postOwner !== username) {
    addCoins(postOwner, postOwnerAge, `Reaction from @${username}`, 1);
    pushNotification(postOwner, {
      username: postOwner,
      type: "coin",
      message: `@${username} reacted with ${reactionConfig[type].label} to your post`,
    });
  }

  return true;
}

export function getTopReactions(postId: string, limit = 3): ReactionType[] {
  const counts = getReactionCounts(postId);
  return Object.entries(counts)
    .filter(([_, count]) => count > 0)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([type]) => type as ReactionType);
}
