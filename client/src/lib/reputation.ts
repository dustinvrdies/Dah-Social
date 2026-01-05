import { lsGet, lsSet } from "./storage";

export type Rep = {
  username: string;
  score: number;
  verifiedSales: number;
};

const K = (u: string) => `dah.rep.${u}`;

export const getReputation = (u: string) =>
  lsGet<Rep>(K(u), { username: u, score: 0, verifiedSales: 0 });

export const recordVerifiedSale = (u: string) => {
  const r = getReputation(u);
  const n = { ...r, verifiedSales: r.verifiedSales + 1, score: r.score + 10 };
  lsSet(K(u), n);
  return n;
};
