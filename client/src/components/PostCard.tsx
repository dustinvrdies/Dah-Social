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
import { RiskFlag } from "./RiskFlag";
import { analyzePostRisk } from "@/lib/safetyAI";
import { 
  Heart, 
  MessageCircle, 
  Flag, 
  EyeOff, 
  MoreHorizontal,
  Bookmark,
  Share2,
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

  const [showCoinEarned, setShowCoinEarned] = useState(false);

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
        message: "+1 DAH Coin added to your balance.",
      });
      setShowCoinEarned(true);
      setTimeout(() => setShowCoinEarned(false), 1500);
    }
  };

  const handleTip = (amount: number) => {
    if (!session) return;
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
    if (!timestamp) {
      const hash = postId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
      const hrs = (hash % 23) + 1;
      return `${hrs}h`;
    }
    const diff = Date.now() - timestamp;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d`;
    return `${Math.floor(days / 7)}w`;
  };

  return (
    <Card className="overflow-hidden border-border/50" data-testid={`card-post-${postId}`}>
      <div className="px-4 pt-3 pb-2 flex items-center justify-between gap-3">
        <Link href={`/profile/${user}`}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="ring-gradient-dah p-[2px] rounded-full">
              <Avatar className="w-9 h-9 group-hover:scale-105 transition-transform">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-card text-xs font-semibold">
                  {user.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm group-hover:text-primary transition-colors" data-testid="link-post-user">
                {user}
              </span>
              <RiskFlag level={analyzePostRisk(content)} />
              <span className="text-xs text-muted-foreground">{formatTimeAgo()}</span>
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

      {content && (
        <div className="px-4 pb-2">
          <p className="text-sm leading-relaxed" data-testid="text-post-content">{content}</p>
        </div>
      )}

      {image && (
        <div className="mt-1 bg-muted/30">
          <img 
            src={image} 
            alt="Post" 
            className="w-full max-h-[500px] object-cover" 
            loading="lazy"
          />
        </div>
      )}

      <div className="px-4 py-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={liked ? "text-pink-500" : "text-muted-foreground"}
              data-testid="button-like-post"
            >
              <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowComments(!showComments)}
              className="text-muted-foreground"
              data-testid="button-toggle-comments"
            >
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground" data-testid="button-share-post">
              <Share2 className="w-5 h-5" />
            </Button>
            {session && session.username !== user && (
              <TipButton onTip={handleTip} />
            )}
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setSaved(!saved)}
            className={saved ? "text-primary" : "text-muted-foreground"}
            data-testid="button-save-post"
          >
            <Bookmark className={`w-5 h-5 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="flex items-center gap-3 mt-1 px-1">
          {likeCount > 0 && (
            <span className="text-xs font-semibold" data-testid="text-like-count">
              {likeCount.toLocaleString()} {likeCount === 1 ? "like" : "likes"}
            </span>
          )}
          {commentCount > 0 && (
            <button 
              onClick={() => setShowComments(true)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-view-comments"
            >
              {commentCount} {commentCount === 1 ? "comment" : "comments"}
            </button>
          )}
          {showCoinEarned && (
            <span className="text-xs font-bold text-primary coin-earned" data-testid="text-coin-earned">
              +1 DAH
            </span>
          )}
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-3 border-t border-border/30">
          <Comments postId={postId} />
        </div>
      )}
    </Card>
  );
}
