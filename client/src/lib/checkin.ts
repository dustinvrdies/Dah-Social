import { lsGet, lsSet } from "./storage";
import { addCoins } from "./dahCoins";
import { pushNotification } from "./notifications";

const CHECKIN_KEY = (u: string) => `dah.checkin.${u}`;
const SPIN_KEY = (u: string) => `dah.spin.${u}`;

export interface CheckinState {
  streak: number;
  lastCheckin: string;
  totalCheckins: number;
  weeklyCheckins: boolean[];
}

export interface SpinState {
  lastSpin: string;
  totalSpins: number;
}

const STREAK_REWARDS = [5, 10, 15, 20, 30, 40, 75];
const SPIN_PRIZES = [
  { label: "5 Coins", amount: 5, weight: 30 },
  { label: "10 Coins", amount: 10, weight: 25 },
  { label: "25 Coins", amount: 25, weight: 18 },
  { label: "50 Coins", amount: 50, weight: 12 },
  { label: "75 Coins", amount: 75, weight: 8 },
  { label: "100 Coins", amount: 100, weight: 5 },
  { label: "200 Coins", amount: 200, weight: 1.5 },
  { label: "500 Coins", amount: 500, weight: 0.5 },
];

export function getCheckinState(username: string): CheckinState {
  return lsGet<CheckinState>(CHECKIN_KEY(username), {
    streak: 0,
    lastCheckin: "",
    totalCheckins: 0,
    weeklyCheckins: [false, false, false, false, false, false, false],
  });
}

export function canCheckinToday(username: string): boolean {
  const state = getCheckinState(username);
  const today = new Date().toDateString();
  return state.lastCheckin !== today;
}

export function performCheckin(username: string, age: number): { reward: number; streak: number; isStreakBonus: boolean } {
  const state = getCheckinState(username);
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  if (state.lastCheckin === today) {
    return { reward: 0, streak: state.streak, isStreakBonus: false };
  }

  let newStreak = state.lastCheckin === yesterday ? state.streak + 1 : 1;
  if (newStreak > 7) newStreak = ((newStreak - 1) % 7) + 1;

  const dayIndex = (newStreak - 1) % 7;
  const reward = STREAK_REWARDS[dayIndex];
  const isStreakBonus = dayIndex === 6;

  const weeklyCheckins = [...state.weeklyCheckins];
  weeklyCheckins[dayIndex] = true;
  if (dayIndex === 0) weeklyCheckins.fill(false);
  weeklyCheckins[dayIndex] = true;

  lsSet(CHECKIN_KEY(username), {
    streak: newStreak,
    lastCheckin: today,
    totalCheckins: state.totalCheckins + 1,
    weeklyCheckins,
  });

  addCoins(username, age, `Daily check-in (Day ${newStreak})`, reward);
  pushNotification(username, {
    username,
    type: "coin",
    message: `Daily check-in: +${reward} DAH Coins! ${isStreakBonus ? "Weekly bonus!" : `Streak: ${newStreak} days`}`,
  });

  return { reward, streak: newStreak, isStreakBonus };
}

export function getSpinState(username: string): SpinState {
  return lsGet<SpinState>(SPIN_KEY(username), { lastSpin: "", totalSpins: 0 });
}

export function canSpinToday(username: string): boolean {
  const state = getSpinState(username);
  return state.lastSpin !== new Date().toDateString();
}

export function spinWheel(username: string, age: number): { prize: typeof SPIN_PRIZES[0]; index: number } {
  const totalWeight = SPIN_PRIZES.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * totalWeight;
  let index = 0;

  for (let i = 0; i < SPIN_PRIZES.length; i++) {
    rand -= SPIN_PRIZES[i].weight;
    if (rand <= 0) {
      index = i;
      break;
    }
  }

  const prize = SPIN_PRIZES[index];

  lsSet(SPIN_KEY(username), {
    lastSpin: new Date().toDateString(),
    totalSpins: getSpinState(username).totalSpins + 1,
  });

  addCoins(username, age, `Spin Wheel: ${prize.label}`, prize.amount);
  pushNotification(username, {
    username,
    type: "coin",
    message: `Spin Wheel: You won ${prize.label}!`,
  });

  return { prize, index };
}

export function getSpinPrizes() {
  return SPIN_PRIZES;
}

export function getStreakRewards() {
  return STREAK_REWARDS;
}
