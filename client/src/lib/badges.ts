import { lsGet, lsSet } from "./storage";
import { getWallet } from "./dahCoins";
import { getCheckinState } from "./checkin";
import { getUserLevel } from "./levels";
import { getFollowers, getFollowing } from "./follows";
import { pushNotification } from "./notifications";

const BADGES_KEY = (u: string) => `dah.badges.${u}`;

export interface UserBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: "social" | "earning" | "streak" | "level" | "special";
  unlockedAt: number | null;
  requirement: () => boolean;
}

function createBadgeDefs(username: string): Omit<UserBadge, "unlockedAt">[] {
  return [
    { id: "first-login", name: "Welcome", description: "Log in for the first time", icon: "star", category: "special", requirement: () => true },
    { id: "checkin-3", name: "Regular", description: "Check in 3 days in a row", icon: "flame", category: "streak", requirement: () => getCheckinState(username).streak >= 3 },
    { id: "checkin-7", name: "Week Warrior", description: "7-day check-in streak", icon: "flame", category: "streak", requirement: () => getCheckinState(username).streak >= 7 },
    { id: "checkin-30", name: "Monthly Master", description: "30 total check-ins", icon: "calendar", category: "streak", requirement: () => getCheckinState(username).totalCheckins >= 30 },
    { id: "coins-100", name: "Coin Starter", description: "Earn 100 DAH Coins", icon: "coins", category: "earning", requirement: () => { const w = getWallet(username); return w.available + w.lockedForCollege >= 100; } },
    { id: "coins-500", name: "Coin Collector", description: "Earn 500 DAH Coins", icon: "coins", category: "earning", requirement: () => { const w = getWallet(username); return w.available + w.lockedForCollege >= 500; } },
    { id: "coins-1000", name: "Coin Mogul", description: "Earn 1,000 DAH Coins", icon: "gem", category: "earning", requirement: () => { const w = getWallet(username); return w.available + w.lockedForCollege >= 1000; } },
    { id: "coins-5000", name: "DAH Millionaire", description: "Earn 5,000 DAH Coins", icon: "crown", category: "earning", requirement: () => { const w = getWallet(username); return w.available + w.lockedForCollege >= 5000; } },
    { id: "followers-5", name: "Making Friends", description: "Get 5 followers", icon: "users", category: "social", requirement: () => getFollowers(username).length >= 5 },
    { id: "followers-25", name: "Popular", description: "Get 25 followers", icon: "users", category: "social", requirement: () => getFollowers(username).length >= 25 },
    { id: "followers-100", name: "Influencer", description: "Get 100 followers", icon: "trending-up", category: "social", requirement: () => getFollowers(username).length >= 100 },
    { id: "following-10", name: "Social Butterfly", description: "Follow 10 people", icon: "heart", category: "social", requirement: () => getFollowing(username).length >= 10 },
    { id: "level-5", name: "Level 5", description: "Reach level 5", icon: "zap", category: "level", requirement: () => getUserLevel(username).level >= 5 },
    { id: "level-10", name: "Level 10", description: "Reach level 10", icon: "zap", category: "level", requirement: () => getUserLevel(username).level >= 10 },
    { id: "level-25", name: "Level 25", description: "Reach level 25", icon: "award", category: "level", requirement: () => getUserLevel(username).level >= 25 },
  ];
}

export function getUserBadges(username: string): UserBadge[] {
  const savedUnlocks = lsGet<Record<string, number>>(BADGES_KEY(username), {});
  const defs = createBadgeDefs(username);

  return defs.map((d) => ({
    ...d,
    unlockedAt: savedUnlocks[d.id] || null,
  }));
}

export function checkAndUnlockBadges(username: string): UserBadge[] {
  const savedUnlocks = lsGet<Record<string, number>>(BADGES_KEY(username), {});
  const defs = createBadgeDefs(username);
  const newlyUnlocked: UserBadge[] = [];

  defs.forEach((d) => {
    if (!savedUnlocks[d.id]) {
      try {
        if (d.requirement()) {
          savedUnlocks[d.id] = Date.now();
          newlyUnlocked.push({ ...d, unlockedAt: savedUnlocks[d.id] });
        }
      } catch {}
    }
  });

  if (newlyUnlocked.length > 0) {
    lsSet(BADGES_KEY(username), savedUnlocks);
    newlyUnlocked.forEach((b) => {
      pushNotification(username, {
        username,
        type: "system",
        message: `Badge unlocked: ${b.name} - ${b.description}`,
      });
    });
  }

  return newlyUnlocked;
}

export function getUnlockedBadgeCount(username: string): number {
  return getUserBadges(username).filter((b) => b.unlockedAt !== null).length;
}

export function getTotalBadgeCount(): number {
  return 15;
}
