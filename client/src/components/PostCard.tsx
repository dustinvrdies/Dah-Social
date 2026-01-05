import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "./AuthProvider";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { hidePost, reportPost } from "@/lib/moderation";
import { Comments } from "./Comments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2, Flag, EyeOff } from "lucide-react";

interface PostCardProps {
  user: string;
  content: string;
  postId: string;
}

export function PostCard({ user, content, postId }: PostCardProps) {
  const { session } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));
  const [showComments, setShowComments] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleLike = () => {
    if (!session) return;
    if (!liked) {
      setLikeCount((c) => c + 1);
      setLiked(true);
      addCoins(session.username, session.age, "Liked a post", 1);
      pushNotification(session.username, {
        username: session.username,
        type: "coin",
        message: "You earned 1 DAH Coin for liking a post.",
      });
    } else {
      setLikeCount((c) => c - 1);
      setLiked(false);
    }
  };

  const handleHide = () => {
    if (!session) return;
    hidePost(session.username, postId);
    setHidden(true);
  };

  const handleReport = () => {
    if (!session) return;
    reportPost(session.username, postId, "User reported");
    alert("Post reported. Thank you for helping keep DAH Social safe.");
  };

  if (hidden) {
    return (
      <Card className="p-4 text-muted-foreground text-sm" data-testid={`card-post-hidden-${postId}`}>
        Post hidden.
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-3" data-testid={`card-post-${postId}`}>
      <div className="flex items-center justify-between gap-2">
        <Link href={`/profile/${user}`}>
          <span className="text-sm font-medium text-primary hover:underline cursor-pointer" data-testid="link-post-user">
            @{user}
          </span>
        </Link>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleHide}
            title="Hide post"
            data-testid="button-hide-post"
          >
            <EyeOff className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReport}
            title="Report post"
            data-testid="button-report-post"
          >
            <Flag className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <p className="text-foreground" data-testid="text-post-content">{content}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <Button
          variant={liked ? "default" : "ghost"}
          size="sm"
          onClick={handleLike}
          data-testid="button-like-post"
        >
          <Heart className={`w-4 h-4 mr-1 ${liked ? "fill-current" : ""}`} />
          {likeCount}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowComments(!showComments)}
          data-testid="button-toggle-comments"
        >
          <MessageCircle className="w-4 h-4 mr-1" />
          Comments
        </Button>
        <Button variant="ghost" size="sm" data-testid="button-share-post">
          <Share2 className="w-4 h-4 mr-1" />
          Share
        </Button>
      </div>

      {showComments && <Comments />}
    </Card>
  );
}
