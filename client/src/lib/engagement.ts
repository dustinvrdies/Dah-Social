import { lsGet, lsSet } from "./storage";

export type Comment = {
  id: string;
  postId: string;
  username: string;
  content: string;
  createdAt: number;
  editedAt?: number;
};

export type LikeData = {
  count: number;
  users: string[];
};

export type EngagementState = {
  likes: Record<string, LikeData>;
  comments: Record<string, Comment[]>;
};

const KEY = "dah.engagement";
const CHANNEL_NAME = "dah-engagement-sync";

let channel: BroadcastChannel | null = null;
const listeners: Set<() => void> = new Set();

function getChannel(): BroadcastChannel | null {
  if (typeof window === "undefined") return null;
  if (!channel && typeof BroadcastChannel !== "undefined") {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = () => {
      notifyListeners();
    };
  }
  return channel;
}

function notifyListeners() {
  listeners.forEach(fn => fn());
}

function broadcastUpdate() {
  getChannel()?.postMessage({ type: "update", ts: Date.now() });
  notifyListeners();
}

export function subscribeToEngagement(callback: () => void): () => void {
  listeners.add(callback);
  
  const handleStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      callback();
    }
  };
  
  if (typeof window !== "undefined") {
    window.addEventListener("storage", handleStorage);
  }
  
  return () => {
    listeners.delete(callback);
    if (typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorage);
    }
  };
}

function getState(): EngagementState {
  if (typeof window === "undefined") return { likes: {}, comments: {} };
  return lsGet<EngagementState>(KEY, { likes: {}, comments: {} });
}

function saveState(state: EngagementState) {
  lsSet(KEY, state);
  broadcastUpdate();
}

export function getLikes(postId: string): LikeData {
  const state = getState();
  return state.likes[postId] || { count: 0, users: [] };
}

export function hasLiked(postId: string, username: string): boolean {
  const likes = getLikes(postId);
  return likes.users.includes(username);
}

export function toggleLike(postId: string, username: string): boolean {
  const state = getState();
  if (!state.likes[postId]) {
    state.likes[postId] = { count: 0, users: [] };
  }
  
  const liked = state.likes[postId].users.includes(username);
  
  if (liked) {
    state.likes[postId].users = state.likes[postId].users.filter(u => u !== username);
    state.likes[postId].count = Math.max(0, state.likes[postId].count - 1);
  } else {
    state.likes[postId].users.push(username);
    state.likes[postId].count++;
  }
  
  saveState(state);
  return !liked;
}

export function getComments(postId: string): Comment[] {
  const state = getState();
  return (state.comments[postId] || []).sort((a, b) => a.createdAt - b.createdAt);
}

export function getCommentCount(postId: string): number {
  return getComments(postId).length;
}

export function addComment(postId: string, username: string, content: string): Comment {
  const state = getState();
  if (!state.comments[postId]) {
    state.comments[postId] = [];
  }
  
  const comment: Comment = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    postId,
    username,
    content,
    createdAt: Date.now(),
  };
  
  state.comments[postId].push(comment);
  saveState(state);
  
  return comment;
}

export function editComment(postId: string, commentId: string, newContent: string): boolean {
  const state = getState();
  const comments = state.comments[postId];
  if (!comments) return false;
  
  const comment = comments.find(c => c.id === commentId);
  if (!comment) return false;
  
  comment.content = newContent;
  comment.editedAt = Date.now();
  saveState(state);
  
  return true;
}

export function deleteComment(postId: string, commentId: string): boolean {
  const state = getState();
  const comments = state.comments[postId];
  if (!comments) return false;
  
  const idx = comments.findIndex(c => c.id === commentId);
  if (idx === -1) return false;
  
  comments.splice(idx, 1);
  saveState(state);
  
  return true;
}

export function getAllEngagement(): EngagementState {
  return getState();
}
