import { Post, AdPost } from "@/lib/postTypes";
import { getPostMedia } from "@/lib/posts";
import { PostCard } from "./PostCard";
import { VideoPost } from "./VideoPost";
import { ListingCard } from "./ListingCard";
import { AdCard } from "./AdCard";

interface PostRendererProps {
  post: Post;
}

export function PostRenderer({ post }: PostRendererProps) {
  const storedMedia = getPostMedia(post.id);

  switch (post.type) {
    case "video":
      return <VideoPost user={post.user} src={post.src} caption={post.caption} postId={post.id} />;
    case "listing":
      return (
        <ListingCard
          user={post.user}
          title={post.title}
          price={post.price}
          location={post.location}
          media={post.media || storedMedia}
          postId={post.id}
          dropship={post.dropship}
          condition={post.condition}
        />
      );
    case "ad":
      return <AdCard ad={post as AdPost} />;
    case "text":
    default:
      return <PostCard user={post.user} content={post.content} postId={post.id} image={post.media || storedMedia} />;
  }
}
