import { lsGet, lsSet } from "./storage";
import { addCoins, getWallet } from "./dahCoins";
import { canUserEarn, recordPayout, getUserLimits, getRevenueStats } from "./revenue";
import { pushNotification } from "./notifications";

export type EarningAction = 
  | "post_created"
  | "video_posted"
  | "listing_created"
  | "like_given"
  | "comment_posted"
  | "profile_view"
  | "daily_login"
  | "first_follower"
  | "sale_completed"
  | "referral"
  | "streak_bonus";

const EARNING_RATES: Record<EarningAction, number> = {
  post_created: 5,
  video_posted: 10,
  listing_created: 8,
  like_given: 1,
  comment_posted: 2,
  profile_view: 0.5,
  daily_login: 3,
  first_follower: 15,
  sale_completed: 25,
  referral: 50,
  streak_bonus: 10,
};

const ACTION_LABELS: Record<EarningAction, string> = {
  post_created: "Posted content",
  video_posted: "Uploaded a video",
  listing_created: "Created a listing",
  like_given: "Liked a post",
  comment_posted: "Posted a comment",
  profile_view: "Profile viewed",
  daily_login: "Daily login bonus",
  first_follower: "Got your first follower",
  sale_completed: "Completed a sale",
  referral: "Referred a friend",
  streak_bonus: "Login streak bonus",
};

type CooldownState = Record<string, number>;
const COOLDOWN_KEY = "dah.earning.cooldowns";
const STREAK_KEY = (u: string) => `dah.streak.${u}`;

const ACTION_COOLDOWNS: Partial<Record<EarningAction, number>> = {
  like_given: 2000,
  comment_posted: 5000,
  profile_view: 60000,
};

function getCooldowns(): CooldownState {
  return lsGet<CooldownState>(COOLDOWN_KEY, {});
}

function setCooldown(key: string, until: number) {
  const cooldowns = getCooldowns();
  cooldowns[key] = until;
  lsSet(COOLDOWN_KEY, cooldowns);
}

function isOnCooldown(key: string): boolean {
  const cooldowns = getCooldowns();
  return (cooldowns[key] || 0) > Date.now();
}

export function earnCoins(
  username: string,
  age: number,
  action: EarningAction
): { earned: number; message: string; blocked: boolean; reason?: string } {
  const baseAmount = EARNING_RATES[action];
  const cooldownKey = `${username}:${action}`;
  
  if (ACTION_COOLDOWNS[action] && isOnCooldown(cooldownKey)) {
    return { 
      earned: 0, 
      message: "Too fast! Wait a moment before earning again.", 
      blocked: true, 
      reason: "cooldown" 
    };
  }
  
  const { allowed, reason, adjustedAmount } = canUserEarn(username, baseAmount);
  
  if (!allowed) {
    return { 
      earned: 0, 
      message: reason || "Cannot earn coins right now.", 
      blocked: true, 
      reason 
    };
  }
  
  if (adjustedAmount <= 0) {
    return { 
      earned: 0, 
      message: "No coins available to earn.", 
      blocked: true, 
      reason: "no_coins" 
    };
  }
  
  addCoins(username, age, ACTION_LABELS[action], adjustedAmount);
  recordPayout(username, adjustedAmount, action);
  
  if (ACTION_COOLDOWNS[action]) {
    setCooldown(cooldownKey, Date.now() + ACTION_COOLDOWNS[action]!);
  }
  
  pushNotification(username, {
    username,
    type: "coin",
    message: `+${adjustedAmount} DAH Coins added to your balance.`,
  });
  
  return { 
    earned: adjustedAmount, 
    message: `+${adjustedAmount} DAH Coins!`, 
    blocked: false 
  };
}

export function getLoginStreak(username: string): { streak: number; lastLogin: number } {
  return lsGet<{ streak: number; lastLogin: number }>(STREAK_KEY(username), { streak: 0, lastLogin: 0 });
}

export function recordDailyLogin(username: string, age: number): { streak: number; bonusEarned: number } {
  const data = getLoginStreak(username);
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const lastLoginDate = new Date(data.lastLogin).toDateString();
  const todayDate = new Date(now).toDateString();
  
  if (lastLoginDate === todayDate) {
    return { streak: data.streak, bonusEarned: 0 };
  }
  
  let newStreak = 1;
  if (now - data.lastLogin < oneDayMs * 2 && data.lastLogin > 0) {
    newStreak = data.streak + 1;
  }
  
  lsSet(STREAK_KEY(username), { streak: newStreak, lastLogin: now });
  
  const loginResult = earnCoins(username, age, "daily_login");
  let totalEarned = loginResult.earned;
  
  if (newStreak > 0 && newStreak % 7 === 0) {
    const streakResult = earnCoins(username, age, "streak_bonus");
    totalEarned += streakResult.earned;
  }
  
  return { streak: newStreak, bonusEarned: totalEarned };
}

export function getEarningDashboard(username: string) {
  const wallet = getWallet(username);
  const limits = getUserLimits(username);
  const streak = getLoginStreak(username);
  
  return {
    wallet,
    limits,
    streak: streak.streak,
  };
}
