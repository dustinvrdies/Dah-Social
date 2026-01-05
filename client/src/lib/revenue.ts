import { lsGet, lsSet } from "./storage";
import { getTotalRevenue } from "./ads";

function isSSR() {
  return typeof window === "undefined";
}

export type PayoutRecord = {
  id: string;
  ts: number;
  username: string;
  coins: number;
  reason: string;
};

type RevenueState = {
  totalPaidOut: number;
  dailyPayouts: Record<string, number>;
  monthlyPayouts: Record<string, number>;
  payoutHistory: PayoutRecord[];
};

const KEY = "dah.revenue.state";

const DAILY_USER_CAP = 100;
const MONTHLY_USER_CAP = 2000;
const PLATFORM_RESERVE_RATIO = 0.4;

function getState(): RevenueState {
  if (isSSR()) return { totalPaidOut: 0, dailyPayouts: {}, monthlyPayouts: {}, payoutHistory: [] };
  return lsGet<RevenueState>(KEY, {
    totalPaidOut: 0,
    dailyPayouts: {},
    monthlyPayouts: {},
    payoutHistory: [],
  });
}

function saveState(state: RevenueState) {
  lsSet(KEY, state);
}

function getDateKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function getMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}

export function getUserDailyPayout(username: string): number {
  const state = getState();
  const key = `${username}:${getDateKey()}`;
  return state.dailyPayouts[key] || 0;
}

export function getUserMonthlyPayout(username: string): number {
  const state = getState();
  const key = `${username}:${getMonthKey()}`;
  return state.monthlyPayouts[key] || 0;
}

export function canUserEarn(username: string, amount: number): { allowed: boolean; reason?: string; adjustedAmount: number } {
  const dailyUsed = getUserDailyPayout(username);
  const monthlyUsed = getUserMonthlyPayout(username);
  
  if (monthlyUsed >= MONTHLY_USER_CAP) {
    return { allowed: false, reason: "Monthly earning limit reached", adjustedAmount: 0 };
  }
  
  if (dailyUsed >= DAILY_USER_CAP) {
    return { allowed: false, reason: "Daily earning limit reached", adjustedAmount: 0 };
  }
  
  const dailyRemaining = DAILY_USER_CAP - dailyUsed;
  const monthlyRemaining = MONTHLY_USER_CAP - monthlyUsed;
  const maxAllowed = Math.min(dailyRemaining, monthlyRemaining, amount);
  
  const adRevenue = getTotalRevenue();
  const state = getState();
  const platformReserve = adRevenue * PLATFORM_RESERVE_RATIO;
  const availableForPayouts = adRevenue - platformReserve - state.totalPaidOut;
  
  if (availableForPayouts <= 0) {
    return { allowed: false, reason: "Platform payout pool depleted", adjustedAmount: 0 };
  }
  
  const finalAmount = Math.min(maxAllowed, availableForPayouts);
  
  return { allowed: true, adjustedAmount: Math.floor(finalAmount) };
}

export function recordPayout(username: string, coins: number, reason: string) {
  const state = getState();
  const dateKey = `${username}:${getDateKey()}`;
  const monthKey = `${username}:${getMonthKey()}`;
  
  state.dailyPayouts[dateKey] = (state.dailyPayouts[dateKey] || 0) + coins;
  state.monthlyPayouts[monthKey] = (state.monthlyPayouts[monthKey] || 0) + coins;
  state.totalPaidOut += coins;
  
  state.payoutHistory.unshift({
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    username,
    coins,
    reason,
  });
  
  if (state.payoutHistory.length > 1000) {
    state.payoutHistory = state.payoutHistory.slice(0, 1000);
  }
  
  saveState(state);
}

export function getRevenueStats() {
  const state = getState();
  const adRevenue = getTotalRevenue();
  const platformReserve = adRevenue * PLATFORM_RESERVE_RATIO;
  
  return {
    totalAdRevenue: adRevenue,
    platformReserve,
    totalPaidOut: state.totalPaidOut,
    availableForPayouts: Math.max(0, adRevenue - platformReserve - state.totalPaidOut),
    dailyCap: DAILY_USER_CAP,
    monthlyCap: MONTHLY_USER_CAP,
  };
}

export function getUserLimits(username: string) {
  return {
    dailyUsed: getUserDailyPayout(username),
    dailyCap: DAILY_USER_CAP,
    dailyRemaining: Math.max(0, DAILY_USER_CAP - getUserDailyPayout(username)),
    monthlyUsed: getUserMonthlyPayout(username),
    monthlyCap: MONTHLY_USER_CAP,
    monthlyRemaining: Math.max(0, MONTHLY_USER_CAP - getUserMonthlyPayout(username)),
  };
}
