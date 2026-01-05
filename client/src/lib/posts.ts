import { lsGet, lsSet } from "./storage";
import { Post } from "./postTypes";

const KEY = "dah.posts";
const MEDIA_KEY = "dah.post.media";

export const getPosts = (f: Post[]) => lsGet<Post[]>(KEY, f);
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
