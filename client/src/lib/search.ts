import { getAllPosts } from "./feedData";
import { botUsers, BotUser } from "./botUsers";
import { getGroups } from "./groups";
import { getAllAvenues } from "./avenues";
import { Post } from "./postTypes";

export interface SearchResult {
  type: "user" | "post" | "listing" | "group" | "avenue";
  id: string;
  title: string;
  subtitle: string;
  avatar?: string;
  link: string;
  score: number;
}

function matchScore(text: string, query: string): number {
  const lower = text.toLowerCase();
  const q = query.toLowerCase();
  if (lower === q) return 100;
  if (lower.startsWith(q)) return 80;
  if (lower.includes(q)) return 60;
  const words = q.split(/\s+/);
  const matched = words.filter((w) => lower.includes(w)).length;
  if (matched > 0) return (matched / words.length) * 40;
  return 0;
}

export function globalSearch(query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  botUsers.forEach((u: BotUser) => {
    const nameScore = matchScore(u.displayName, q);
    const userScore = matchScore(u.username, q);
    const bioScore = matchScore(u.bio, q) * 0.5;
    const score = Math.max(nameScore, userScore, bioScore);
    if (score > 0) {
      results.push({
        type: "user",
        id: u.username,
        title: u.displayName,
        subtitle: `@${u.username}`,
        link: `/profile/${u.username}`,
        score,
      });
    }
  });

  const posts = getAllPosts();
  posts.forEach((p: Post) => {
    if (p.type === "ad") return;
    let text = "";
    if (p.type === "text") text = p.content;
    else if (p.type === "video") text = p.caption || "";
    else if (p.type === "listing") text = p.title;
    const score = matchScore(text, q);
    if (score > 0) {
      results.push({
        type: p.type === "listing" ? "listing" : "post",
        id: p.id,
        title: p.type === "listing" ? p.title : text.slice(0, 80),
        subtitle: `@${p.user}`,
        link: p.type === "listing" ? "/mall" : "/",
        score,
      });
    }
  });

  try {
    const groups = getGroups();
    groups.forEach((g) => {
      const nameScore = matchScore(g.name, q);
      const descScore = matchScore(g.description, q) * 0.5;
      const score = Math.max(nameScore, descScore);
      if (score > 0) {
        results.push({
          type: "group",
          id: g.id,
          title: g.name,
          subtitle: `${g.memberCount} members`,
          link: "/groups",
          score,
        });
      }
    });
  } catch {}

  try {
    const avenues = getAllAvenues();
    avenues.forEach((a) => {
      const nameScore = matchScore(a.name, q);
      const descScore = matchScore(a.description, q) * 0.5;
      const score = Math.max(nameScore, descScore);
      if (score > 0) {
        results.push({
          type: "avenue",
          id: a.id,
          title: `av/${a.name}`,
          subtitle: a.description.slice(0, 60),
          link: `/av/${a.name}`,
          score,
        });
      }
    });
  } catch {}

  return results.sort((a, b) => b.score - a.score).slice(0, 30);
}
