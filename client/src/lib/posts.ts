import { lsGet, lsSet } from "./storage";
import { Post } from "./postTypes";

const KEY = "dah.posts";

export const getPosts = (f: Post[]) => lsGet<Post[]>(KEY, f);
export const setPosts = (p: Post[]) => lsSet(KEY, p);
export const addPost = (p: Post, f: Post[]) => {
  const a = getPosts(f);
  const u = [p, ...a];
  setPosts(u);
  return u;
};
