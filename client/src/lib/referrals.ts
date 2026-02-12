import { lsGet, lsSet } from "./storage";
import { addCoins } from "./dahCoins";
import { pushNotification } from "./notifications";

const REFERRAL_KEY = (u: string) => `dah.referral.${u}`;
const REFERRAL_USED_KEY = (u: string) => `dah.referral.used.${u}`;

export interface ReferralState {
  code: string;
  referrals: { username: string; joinedAt: number; bonusPaid: boolean }[];
  totalEarned: number;
}

function generateCode(username: string): string {
  const base = username.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4);
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `DAH-${base}-${rand}`;
}

export function getReferralState(username: string): ReferralState {
  const state = lsGet<ReferralState>(REFERRAL_KEY(username), {
    code: generateCode(username),
    referrals: [],
    totalEarned: 0,
  });
  if (!state.code) state.code = generateCode(username);
  return state;
}

export function getReferralCode(username: string): string {
  return getReferralState(username).code;
}

export function hasUsedReferral(username: string): boolean {
  return lsGet<boolean>(REFERRAL_USED_KEY(username), false);
}

export function applyReferralCode(newUser: string, age: number, code: string): { success: boolean; message: string } {
  if (hasUsedReferral(newUser)) {
    return { success: false, message: "You have already used a referral code." };
  }

  const allKeys = Object.keys(localStorage);
  let referrerUsername = "";

  for (const key of allKeys) {
    if (key.startsWith("dah.referral.") && !key.includes(".used.")) {
      try {
        const state = JSON.parse(localStorage.getItem(key) || "{}") as ReferralState;
        if (state.code === code.toUpperCase()) {
          referrerUsername = key.replace("dah.referral.", "");
          break;
        }
      } catch {}
    }
  }

  if (!referrerUsername) {
    return { success: false, message: "Invalid referral code." };
  }

  if (referrerUsername === newUser) {
    return { success: false, message: "You cannot use your own referral code." };
  }

  const referrerState = getReferralState(referrerUsername);
  referrerState.referrals.push({ username: newUser, joinedAt: Date.now(), bonusPaid: true });
  referrerState.totalEarned += 50;
  lsSet(REFERRAL_KEY(referrerUsername), referrerState);

  addCoins(referrerUsername, 25, `Referral bonus: ${newUser} joined`, 50);
  pushNotification(referrerUsername, {
    username: referrerUsername,
    type: "coin",
    message: `@${newUser} joined using your referral code! +50 DAH Coins`,
  });

  addCoins(newUser, age, "Welcome bonus: Used referral code", 25);
  pushNotification(newUser, {
    username: newUser,
    type: "coin",
    message: "Welcome bonus: +25 DAH Coins for using a referral code!",
  });

  lsSet(REFERRAL_USED_KEY(newUser), true);

  return { success: true, message: "Referral code applied! You earned 25 DAH Coins!" };
}
