import { lsGet, lsSet } from "./storage";

export type Report = {
  id: string;
  ts: number;
  reporter: string;
  postId: string;
  reason: string;
};

const REPORTS_KEY = "dah.reports";
const HIDDEN_KEY = (u: string) => `dah.hidden.${u}`;

export function getHidden(username: string): string[] {
  return lsGet<string[]>(HIDDEN_KEY(username), []);
}

export function hidePost(username: string, postId: string) {
  const list = getHidden(username);
  if (!list.includes(postId)) list.unshift(postId);
  lsSet(HIDDEN_KEY(username), list);
  return list;
}

export function reportPost(reporter: string, postId: string, reason: string) {
  const reports = lsGet<Report[]>(REPORTS_KEY, []);
  const r: Report = {
    id: cryptoId(),
    ts: Date.now(),
    reporter,
    postId,
    reason: reason.trim() || "unspecified",
  };
  reports.unshift(r);
  lsSet(REPORTS_KEY, reports);
  return r;
}

function cryptoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
