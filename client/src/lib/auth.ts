import { lsGet, lsSet } from "./storage";

export type Session = { username: string; age: number };

const KEY = "dah.session";

export const getSession = () => lsGet<Session | null>(KEY, null);
export const setSession = (s: Session | null) => lsSet(KEY, s);
