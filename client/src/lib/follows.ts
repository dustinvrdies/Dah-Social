import { lsGet, lsSet } from "./storage";

export type FollowState = {
  username: string;
  following: string[];
};

const KEY = (u: string) => `dah.following.${u}`;

export function getFollowing(username: string): string[] {
  return lsGet<FollowState>(KEY(username), { username, following: [] }).following;
}

export function isFollowing(username: string, target: string): boolean {
  return getFollowing(username).includes(target);
}

export function follow(username: string, target: string) {
  const state = lsGet<FollowState>(KEY(username), { username, following: [] });
  const t = target.trim().toLowerCase();
  if (!t || t === username) return state.following;
  if (!state.following.includes(t)) state.following.unshift(t);
  lsSet(KEY(username), state);
  return state.following;
}

export function unfollow(username: string, target: string) {
  const state = lsGet<FollowState>(KEY(username), { username, following: [] });
  const t = target.trim().toLowerCase();
  state.following = state.following.filter((x) => x !== t);
  lsSet(KEY(username), state);
  return state.following;
}
