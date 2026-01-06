export type ApiError = { message: string; issues?: unknown };

export async function fetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
    credentials: "include",
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await res.json().catch(() => null) : await res.text().catch(() => null);

  if (!res.ok) {
    const msg = (body && (body as any).message) || `Request failed (${res.status})`;
    const err: ApiError = { message: msg, issues: (body as any)?.issues };
    throw err;
  }

  return body as T;
}
