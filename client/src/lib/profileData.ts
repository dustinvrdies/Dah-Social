import { lsGet, lsSet } from "./storage";

const PROFILE_KEY = (u: string) => `dah.profile.data.${u}`;

export interface UserProfile {
  displayName: string;
  bio: string;
  avatarUrl: string;
  location: string;
  website: string;
  joinedAt: number;
}

export function getUserProfile(username: string): UserProfile {
  return lsGet<UserProfile>(PROFILE_KEY(username), {
    displayName: username,
    bio: "",
    avatarUrl: "",
    location: "",
    website: "",
    joinedAt: Date.now(),
  });
}

export function updateUserProfile(username: string, updates: Partial<UserProfile>): UserProfile {
  const current = getUserProfile(username);
  const updated = { ...current, ...updates };
  lsSet(PROFILE_KEY(username), updated);
  return updated;
}
