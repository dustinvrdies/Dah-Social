import { lsGet, lsSet } from "./storage";
import { calculateDahCoins } from "./dahCoinsMath";

export type Wallet = {
  username: string;
  available: number;
  lockedForCollege: number;
};

export type Entry = {
  id: string;
  ts: number;
  username: string;
  event: string;
  base: number;
  available: number;
  lockedForCollege: number;
};

const LKEY = "dah.coins.ledger";
const WKEY = (u: string) => `dah.coins.wallet.${u}`;

export const getWallet = (u: string) =>
  lsGet<Wallet>(WKEY(u), { username: u, available: 0, lockedForCollege: 0 });

export const getLedger = () => lsGet<Entry[]>(LKEY, []);

export function getTransactionHistory(username: string): { amount: number; description: string; timestamp: number }[] {
  const ledger = getLedger();
  return ledger
    .filter((e) => e.username === username)
    .map((e) => ({
      amount: e.available + e.lockedForCollege,
      description: e.event,
      timestamp: e.ts,
    }));
}

export function addCoins(u: string, age: number, event: string, base: number) {
  const s = calculateDahCoins(age, base);
  const w = getWallet(u);
  const nw = {
    username: u,
    available: w.available + s.available,
    lockedForCollege: w.lockedForCollege + s.lockedForCollege,
  };
  lsSet(WKEY(u), nw);
  const e: Entry = {
    id: cryptoId(),
    ts: Date.now(),
    username: u,
    event,
    base,
    available: s.available,
    lockedForCollege: s.lockedForCollege,
  };
  const l = getLedger();
  l.unshift(e);
  lsSet(LKEY, l);
  return nw;
}

function cryptoId() {
  return (crypto as any)?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
