import { useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { getPosts } from "@/lib/posts";
import { initialFeed } from "@/lib/feedData";
import { getHidden } from "@/lib/moderation";
import { Post } from "@/lib/postTypes";
import { PostRenderer } from "./PostRenderer";
import { CreatePostModal } from "./CreatePostModal";

export function Feed() {
  const { session } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    setPosts(getPosts(initialFeed));
    if (session) {
      setHidden(getHidden(session.username));
    }
  }, [session]);

  const visiblePosts = posts.filter((p) => !hidden.includes(p.id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h1 className="text-2xl font-bold">Feed</h1>
        <CreatePostModal onPostCreated={setPosts} />
      </div>

      {visiblePosts.length === 0 ? (
        <p className="text-muted-foreground">No posts yet. Create the first one!</p>
      ) : (
        <div className="space-y-4">
          {visiblePosts.map((post) => (
            <PostRenderer key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
