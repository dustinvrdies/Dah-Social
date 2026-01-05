export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
}

export function lsGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  return safeJsonParse<T>(localStorage.getItem(key), fallback);
}

export function lsSet<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}
