import { lsGet, lsSet } from "./storage";
import { addCoins, getWallet } from "./dahCoins";
import { pushNotification } from "./notifications";

export interface Quest {
  id: string;
  title: string;
  description: string;
  reward: number;
  type: "daily" | "weekly" | "achievement";
  requirement: number;
  progress: number;
  completed: boolean;
  claimed: boolean;
  icon: string;
}

interface QuestState {
  quests: Quest[];
  lastDailyReset: number;
  streak: number;
  totalCompleted: number;
}

const QUESTS_KEY = (u: string) => `dah.quests.${u}`;

const dailyQuestTemplates: Omit<Quest, "progress" | "completed" | "claimed">[] = [
  { id: "like-5", title: "Spread the Love", description: "Like 5 posts today", reward: 10, type: "daily", requirement: 5, icon: "heart" },
  { id: "comment-3", title: "Join the Conversation", description: "Leave 3 comments", reward: 15, type: "daily", requirement: 3, icon: "message-circle" },
  { id: "post-1", title: "Share Your World", description: "Create a post", reward: 20, type: "daily", requirement: 1, icon: "plus-square" },
  { id: "watch-10", title: "Video Marathon", description: "Watch 10 videos", reward: 10, type: "daily", requirement: 10, icon: "play" },
  { id: "follow-2", title: "Grow Your Network", description: "Follow 2 new creators", reward: 10, type: "daily", requirement: 2, icon: "user-plus" },
  { id: "share-1", title: "Spread the Word", description: "Share a post", reward: 5, type: "daily", requirement: 1, icon: "share" },
  { id: "visit-mall", title: "Window Shopping", description: "Browse the marketplace", reward: 5, type: "daily", requirement: 1, icon: "shopping-bag" },
];

const weeklyQuestTemplates: Omit<Quest, "progress" | "completed" | "claimed">[] = [
  { id: "streak-7", title: "Week Warrior", description: "Log in 7 days in a row", reward: 100, type: "weekly", requirement: 7, icon: "flame" },
  { id: "earn-100", title: "Coin Collector", description: "Earn 100 DAH Coins this week", reward: 50, type: "weekly", requirement: 100, icon: "coins" },
  { id: "posts-5", title: "Content Creator", description: "Create 5 posts this week", reward: 75, type: "weekly", requirement: 5, icon: "grid" },
];

const achievementTemplates: Omit<Quest, "progress" | "completed" | "claimed">[] = [
  { id: "first-post", title: "First Steps", description: "Create your first post", reward: 50, type: "achievement", requirement: 1, icon: "award" },
  { id: "first-sale", title: "Entrepreneur", description: "Make your first sale", reward: 100, type: "achievement", requirement: 1, icon: "dollar-sign" },
  { id: "followers-10", title: "Rising Star", description: "Get 10 followers", reward: 75, type: "achievement", requirement: 10, icon: "star" },
  { id: "followers-100", title: "Influencer", description: "Get 100 followers", reward: 200, type: "achievement", requirement: 100, icon: "trending-up" },
  { id: "coins-1000", title: "DAH Millionaire", description: "Accumulate 1000 DAH Coins", reward: 250, type: "achievement", requirement: 1000, icon: "gem" },
];

function getDefaultState(): QuestState {
  const daily = dailyQuestTemplates.slice(0, 5).map((q) => ({ ...q, progress: 0, completed: false, claimed: false }));
  const weekly = weeklyQuestTemplates.map((q) => ({ ...q, progress: 0, completed: false, claimed: false }));
  const achievements = achievementTemplates.map((q) => ({ ...q, progress: 0, completed: false, claimed: false }));
  return {
    quests: [...daily, ...weekly, ...achievements],
    lastDailyReset: Date.now(),
    streak: 0,
    totalCompleted: 0,
  };
}

export function getQuestState(username: string): QuestState {
  const state = lsGet<QuestState>(QUESTS_KEY(username), getDefaultState());
  const now = Date.now();
  const hoursSinceReset = (now - state.lastDailyReset) / (1000 * 60 * 60);

  if (hoursSinceReset >= 24) {
    const shuffled = [...dailyQuestTemplates].sort(() => Math.random() - 0.5);
    const newDaily = shuffled.slice(0, 5).map((q) => ({ ...q, progress: 0, completed: false, claimed: false }));
    state.quests = state.quests.filter((q) => q.type !== "daily").concat(newDaily);
    state.lastDailyReset = now;
    state.streak = hoursSinceReset < 48 ? state.streak + 1 : 1;
    lsSet(QUESTS_KEY(username), state);
  }

  return state;
}

export function updateQuestProgress(username: string, questId: string, increment = 1): Quest | null {
  const state = getQuestState(username);
  const quest = state.quests.find((q) => q.id === questId);
  if (!quest || quest.completed) return null;

  quest.progress = Math.min(quest.progress + increment, quest.requirement);
  if (quest.progress >= quest.requirement) {
    quest.completed = true;
    pushNotification(username, {
      username,
      type: "achievement",
      message: `Quest completed: ${quest.title}! Claim your ${quest.reward} DAH Coins.`,
    });
  }

  lsSet(QUESTS_KEY(username), state);
  return quest;
}

export function claimQuestReward(username: string, questId: string, age: number): boolean {
  const state = getQuestState(username);
  const quest = state.quests.find((q) => q.id === questId);
  if (!quest || !quest.completed || quest.claimed) return false;

  quest.claimed = true;
  state.totalCompleted++;
  lsSet(QUESTS_KEY(username), state);

  addCoins(username, age, `Quest reward: ${quest.title}`, quest.reward);
  return true;
}

export function getDailyQuests(username: string): Quest[] {
  return getQuestState(username).quests.filter((q) => q.type === "daily");
}

export function getWeeklyQuests(username: string): Quest[] {
  return getQuestState(username).quests.filter((q) => q.type === "weekly");
}

export function getAchievements(username: string): Quest[] {
  return getQuestState(username).quests.filter((q) => q.type === "achievement");
}

export function getStreak(username: string): number {
  return getQuestState(username).streak;
}
