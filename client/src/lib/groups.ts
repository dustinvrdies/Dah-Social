import { lsGet, lsSet } from "./storage";

export interface Group {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  category: string;
  privacy: "public" | "private";
  memberCount: number;
  createdBy: string;
  createdAt: number;
  rules?: string[];
}

export interface GroupMembership {
  groupId: string;
  username: string;
  role: "admin" | "moderator" | "member";
  joinedAt: number;
}

export interface GroupPost {
  id: string;
  groupId: string;
  username: string;
  content: string;
  media?: string;
  timestamp: number;
  likes: number;
  comments: number;
}

const GROUPS_KEY = "dah.groups";
const MEMBERSHIPS_KEY = (u: string) => `dah.groups.memberships.${u}`;
const GROUP_POSTS_KEY = (gId: string) => `dah.groups.posts.${gId}`;

const picsum = (id: number) => `https://picsum.photos/id/${id}/1200/400`;

const initialGroups: Group[] = [
  { id: "g1", name: "Vintage Collectors Club", description: "For lovers of all things vintage and retro. Share your finds!", coverImage: picsum(1076), category: "Hobbies", privacy: "public", memberCount: 1247, createdBy: "jenna_vintage", createdAt: Date.now() - 30 * 86400000, rules: ["Be respectful", "No spam", "Share authentic items only"] },
  { id: "g2", name: "Tech Traders", description: "Buy, sell, and trade electronics. Fair deals only.", coverImage: picsum(180), category: "Marketplace", privacy: "public", memberCount: 3456, createdBy: "techie_marcus", createdAt: Date.now() - 60 * 86400000 },
  { id: "g3", name: "Sustainable Fashion", description: "Thrifting tips, outfit inspiration, and eco-friendly fashion.", coverImage: picsum(996), category: "Fashion", privacy: "public", memberCount: 2189, createdBy: "sarah_thrifts", createdAt: Date.now() - 45 * 86400000 },
  { id: "g4", name: "DAH Creators Hub", description: "Official community for content creators. Tips, collabs, and growth.", coverImage: picsum(1015), category: "Creator", privacy: "public", memberCount: 5678, createdBy: "dah", createdAt: Date.now() - 90 * 86400000 },
  { id: "g5", name: "Flea Market Flippers", description: "Professional flippers share secrets and success stories.", coverImage: picsum(1067), category: "Business", privacy: "private", memberCount: 892, createdBy: "mike_flips", createdAt: Date.now() - 20 * 86400000 },
  { id: "g6", name: "Art & Handmade", description: "Artists and crafters showcase original work.", coverImage: picsum(1084), category: "Art", privacy: "public", memberCount: 1567, createdBy: "maya_creates", createdAt: Date.now() - 15 * 86400000 },
];

export function getGroups(): Group[] {
  return lsGet<Group[]>(GROUPS_KEY, initialGroups);
}

export function getGroupById(id: string): Group | undefined {
  return getGroups().find((g) => g.id === id);
}

export function searchGroups(query: string): Group[] {
  const q = query.toLowerCase();
  return getGroups().filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
}

export function getGroupsByCategory(category: string): Group[] {
  return getGroups().filter((g) => g.category === category);
}

export function getUserMemberships(username: string): GroupMembership[] {
  return lsGet<GroupMembership[]>(MEMBERSHIPS_KEY(username), []);
}

export function isGroupMember(username: string, groupId: string): boolean {
  return getUserMemberships(username).some((m) => m.groupId === groupId);
}

export function joinGroup(username: string, groupId: string): boolean {
  if (isGroupMember(username, groupId)) return false;

  const memberships = getUserMemberships(username);
  memberships.push({ groupId, username, role: "member", joinedAt: Date.now() });
  lsSet(MEMBERSHIPS_KEY(username), memberships);

  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (group) {
    group.memberCount++;
    lsSet(GROUPS_KEY, groups);
  }

  return true;
}

export function leaveGroup(username: string, groupId: string): boolean {
  const memberships = getUserMemberships(username);
  const idx = memberships.findIndex((m) => m.groupId === groupId);
  if (idx === -1) return false;

  memberships.splice(idx, 1);
  lsSet(MEMBERSHIPS_KEY(username), memberships);

  const groups = getGroups();
  const group = groups.find((g) => g.id === groupId);
  if (group && group.memberCount > 0) {
    group.memberCount--;
    lsSet(GROUPS_KEY, groups);
  }

  return true;
}

export function getGroupPosts(groupId: string): GroupPost[] {
  return lsGet<GroupPost[]>(GROUP_POSTS_KEY(groupId), []);
}

export function addGroupPost(groupId: string, username: string, content: string, media?: string): GroupPost {
  const posts = getGroupPosts(groupId);
  const post: GroupPost = {
    id: `gp-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    groupId,
    username,
    content,
    media,
    timestamp: Date.now(),
    likes: 0,
    comments: 0,
  };
  posts.unshift(post);
  lsSet(GROUP_POSTS_KEY(groupId), posts);
  return post;
}

export function createGroup(name: string, description: string, category: string, privacy: "public" | "private", createdBy: string): Group {
  const groups = getGroups();
  const group: Group = {
    id: `g-${Date.now()}`,
    name,
    description,
    category,
    privacy,
    memberCount: 1,
    createdBy,
    createdAt: Date.now(),
  };
  groups.unshift(group);
  lsSet(GROUPS_KEY, groups);

  const memberships = getUserMemberships(createdBy);
  memberships.push({ groupId: group.id, username: createdBy, role: "admin", joinedAt: Date.now() });
  lsSet(MEMBERSHIPS_KEY(createdBy), memberships);

  return group;
}

export const groupCategories = ["Hobbies", "Marketplace", "Fashion", "Creator", "Business", "Art", "Gaming", "Music", "Sports", "Local"];
