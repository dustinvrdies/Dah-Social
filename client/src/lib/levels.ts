import { lsGet, lsSet } from "./storage";
import { getWallet } from "./dahCoins";
import { getLoginStreak } from "./earningSystem";
import { getCheckinState } from "./checkin";

const LEVEL_KEY = (u: string) => `dah.level.${u}`;

export interface UserLevel {
  level: number;
  xp: number;
  xpToNext: number;
  title: string;
  totalXpEarned: number;
}

const RANK_TITLES = [
  "Newcomer",
  "Explorer",
  "Contributor",
  "Regular",
  "Enthusiast",
  "Rising Star",
  "Trendsetter",
  "Influencer",
  "Veteran",
  "Elite",
  "Master",
  "Legend",
  "Icon",
  "Mythic",
  "Transcendent",
];

function xpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getUserLevel(username: string): UserLevel {
  const saved = lsGet<{ totalXpEarned: number }>(LEVEL_KEY(username), { totalXpEarned: 0 });
  let totalXp = saved.totalXpEarned;

  const wallet = getWallet(username);
  const checkin = getCheckinState(username);
  const autoXp = wallet.available + wallet.lockedForCollege + checkin.totalCheckins * 10;
  if (autoXp > totalXp) totalXp = autoXp;

  let level = 1;
  let xpRemaining = totalXp;
  while (xpRemaining >= xpForLevel(level) && level < 100) {
    xpRemaining -= xpForLevel(level);
    level++;
  }

  const xpToNext = xpForLevel(level);
  const titleIndex = Math.min(level - 1, RANK_TITLES.length - 1);

  return {
    level,
    xp: xpRemaining,
    xpToNext,
    title: RANK_TITLES[titleIndex],
    totalXpEarned: totalXp,
  };
}

export function addXp(username: string, amount: number) {
  const saved = lsGet<{ totalXpEarned: number }>(LEVEL_KEY(username), { totalXpEarned: 0 });
  saved.totalXpEarned += amount;
  lsSet(LEVEL_KEY(username), saved);
}

export function getLevelProgress(username: string): number {
  const level = getUserLevel(username);
  return Math.min((level.xp / level.xpToNext) * 100, 100);
}

export function getRankTitles() {
  return RANK_TITLES;
}
