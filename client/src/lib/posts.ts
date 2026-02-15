import { lsGet, lsSet } from "./storage";
import { Post } from "./postTypes";

const KEY = "dah.posts";
const MEDIA_KEY = "dah.post.media";
const SEED_VERSION_KEY = "dah.seed.version";
const CURRENT_SEED_VERSION = 4;

export const getPosts = (f: Post[]) => {
  const storedVersion = lsGet<number>(SEED_VERSION_KEY, 0);
  if (storedVersion < CURRENT_SEED_VERSION) {
    lsSet(SEED_VERSION_KEY, CURRENT_SEED_VERSION);
    lsSet(KEY, f);
    try { localStorage.removeItem("dah.bot.posts"); } catch {}
    try { localStorage.removeItem("dah.bot.lastRun"); } catch {}
    return f;
  }
  return lsGet<Post[]>(KEY, f);
};
export const setPosts = (p: Post[]) => lsSet(KEY, p);

export const getPostMedia = (postId: string): string | undefined => {
  const media = lsGet<Record<string, string>>(MEDIA_KEY, {});
  return media[postId];
};

export const setPostMedia = (postId: string, mediaData: string) => {
  const media = lsGet<Record<string, string>>(MEDIA_KEY, {});
  media[postId] = mediaData;
  lsSet(MEDIA_KEY, media);
};

export const addPost = (p: Post, f: Post[], mediaData?: string) => {
  const a = getPosts(f);
  const u = [p, ...a];
  setPosts(u);
  
  if (mediaData) {
    setPostMedia(p.id, mediaData);
  }
  
  return u;
};
