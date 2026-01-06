import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "./AuthProvider";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { hidePost, reportPost } from "@/lib/moderation";
import { getLikes, hasLiked, toggleLike, getCommentCount, subscribeToEngagement } from "@/lib/engagement";
import { Comments } from "./Comments";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Flag, 
  EyeOff, 
  MoreHorizontal,
  Bookmark,
  Send,
  Coins
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TipButton } from "./TipButton";

interface PostCardProps {
  user: string;
  content: string;
  postId: string;
  image?: string;
  timestamp?: number;
}

export function PostCard({ user, content, postId, image, timestamp }: PostCardProps) {
  const { session } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const refresh = () => {
      const likes = getLikes(postId);
      setLikeCount(likes.count);
      if (session) {
        setLiked(hasLiked(postId, session.username));
      }
      setCommentCount(getCommentCount(postId));
    };
    
    refresh();
    const unsubscribe = subscribeToEngagement(refresh);
    return unsubscribe;
  }, [postId, session]);

  const handleLike = () => {
    if (!session) return;
    
    const nowLiked = toggleLike(postId, session.username);
    setLiked(nowLiked);
    setLikeCount(getLikes(postId).count);
    
    if (nowLiked) {
      addCoins(session.username, session.age, "Liked a post", 1);
      pushNotification(session.username, {
        username: session.username,
        type: "coin",
        message: "You earned 1 DAH Coin for liking a post.",
      });
    }
  };

  const handleTip = (amount: number) => {
    if (!session) return;
    // Tipping adds coins to creator, removes from tipper
    addCoins(user, 25, `Tip from @${session.username}`, amount);
    addCoins(session.username, session.age, `Tipped @${user}`, -amount);
    pushNotification(user, {
      username: user,
      type: "coin",
      message: `@${session.username} sent you a tip of ${amount} DAH Coin!`,
    });
    alert(`Tip of ${amount} DAH Coin sent to @${user}`);
  };

  const handleHide = () => {
    if (!session) return;
    hidePost(session.username, postId);
    setHidden(true);
  };

  const handleReport = () => {
    if (!session) return;
    reportPost(session.username, postId, "User reported");
    alert("Post reported. Thank you for helping keep DAH safe.");
  };

  if (hidden) {
    return (
      <Card className="p-4 text-muted-foreground text-sm" data-testid={`card-post-hidden-${postId}`}>
        Post hidden.
      </Card>
    );
  }

  const formatTimeAgo = () => {
    if (!timestamp) return `${Math.floor(Math.random() * 23) + 1}h`;
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-post-${postId}`}>
      <div className="p-4 flex items-center justify-between gap-3">
        <Link href={`/profile/${user}`}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="ring-gradient-dah p-[2px] rounded-full">
              <Avatar className="w-10 h-10 group-hover:scale-105 transition-transform">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-card text-sm font-medium">
                  {user.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <span className="font-semibold text-sm group-hover:text-primary transition-colors" data-testid="link-post-user">
                {user}
              </span>
              <p className="text-xs text-muted-foreground">{formatTimeAgo()} ago</p>
            </div>
          </div>
        </Link>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" data-testid="button-post-menu">
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleHide} data-testid="button-hide-post">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide post
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleReport} className="text-destructive" data-testid="button-report-post">
              <Flag className="w-4 h-4 mr-2" />
              Report
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {image && (
        <div className="aspect-square bg-muted">
          <img src={image} alt="Post" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={liked ? "text-pink-500" : ""}
              data-testid="button-like-post"
            >
              <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(!showComments)}
              data-testid="button-toggle-comments"
            >
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-share-post">
              <Send className="w-6 h-6" />
            </Button>
            {session && session.username !== user && (
              <TipButton onTip={handleTip} />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSaved(!saved)}
            className={saved ? "text-primary" : ""}
            data-testid="button-save-post"
          >
            <Bookmark className={`w-6 h-6 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-sm" data-testid="text-like-count">
            {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
          </p>
          <p className="text-sm">
            <Link href={`/profile/${user}`}>
              <span className="font-semibold hover:text-primary cursor-pointer">{user}</span>
            </Link>
            {" "}
            <span className="text-foreground" data-testid="text-post-content">{content}</span>
          </p>
          {commentCount > 0 && !showComments && (
            <button 
              onClick={() => setShowComments(true)}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-view-comments"
            >
              View {commentCount === 1 ? "1 comment" : `all ${commentCount} comments`}
            </button>
          )}
        </div>

        {showComments && <Comments postId={postId} />}
      </div>
    </Card>
  );
}
