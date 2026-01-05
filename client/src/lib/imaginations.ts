import { lsGet, lsSet } from "./storage";

export type Imagination = {
  id: string;
  username: string;
  content: string;
  media?: string;
  createdAt: number;
  expiresAt: number;
};

const KEY = "dah.imaginations";

function getState(): Imagination[] {
  if (typeof window === "undefined") return [];
  return lsGet<Imagination[]>(KEY, []);
}

function saveState(imaginations: Imagination[]) {
  lsSet(KEY, imaginations);
}

export function getImaginations(): Imagination[] {
  const all = getState();
  const now = Date.now();
  const valid = all.filter(i => i.expiresAt > now);
  if (valid.length !== all.length) {
    saveState(valid);
  }
  return valid;
}

export function getUserImaginations(username: string): Imagination[] {
  return getImaginations().filter(i => i.username === username);
}

export function hasActiveImagination(username: string): boolean {
  return getUserImaginations(username).length > 0;
}

export function addImagination(username: string, content: string, media?: string): Imagination {
  const imagination: Imagination = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    username,
    content,
    media,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
  };
  
  const all = getState();
  all.unshift(imagination);
  saveState(all);
  
  return imagination;
}

export function deleteImagination(id: string) {
  const all = getState();
  saveState(all.filter(i => i.id !== id));
}

export function getImaginationsGroupedByUser(): Map<string, Imagination[]> {
  const all = getImaginations();
  const grouped = new Map<string, Imagination[]>();
  
  for (const imagination of all) {
    const existing = grouped.get(imagination.username) || [];
    existing.push(imagination);
    grouped.set(imagination.username, existing);
  }
  
  return grouped;
}
