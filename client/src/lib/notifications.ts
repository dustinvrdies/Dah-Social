import { lsGet, lsSet } from "./storage";

export type Notification = {
  id: string;
  ts: number;
  username: string;
  type: "coin" | "follow" | "sale" | "system";
  message: string;
};

const KEY = (u: string) => `dah.notifications.${u}`;

export function getNotifications(username: string): Notification[] {
  return lsGet<Notification[]>(KEY(username), []);
}

export function pushNotification(username: string, n: Omit<Notification, "id" | "ts">) {
  const list = getNotifications(username);
  const full: Notification = {
    id: cryptoId(),
    ts: Date.now(),
    ...n,
  };
  list.unshift(full);
  lsSet(KEY(username), list);
  return full;
}

function cryptoId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
