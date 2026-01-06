import { useState } from "react";
import { useRoute, Link } from "wouter";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import {
  getAvenueByName,
  getPost,
  getThreadedComments,
  voteOnPost,
  voteOnComment,
  getPostVote,
  getCommentVote,
  addComment,
  giveAward,
  getPostAwards,
  formatCount,
  awardConfig,
  type Comment as CommentType,
  type AwardType,
} from "@/lib/avenues";
import { getWallet } from "@/lib/dahCoins";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Award, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  ArrowLeft,
  Pin,
  Lock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Reply,
  Medal,
  Trophy,
  Crown,
  Gem,
  Flame,
  Sparkles,
  HelpCircle,
  Heart,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const awardIcons: Record<AwardType, typeof Medal> = {
  silver: Medal,
  gold: Trophy,
  platinum: Crown,
  diamond: Gem,
  fire: Flame,
  mindblown: Sparkles,
  helpful: HelpCircle,
  wholesome: Heart,
};

export default function AvenuePostPage() {
  const [, params] = useRoute("/av/:name/post/:postId");
  const { session } = useAuth();
  const [, setRefresh] = useState(0);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const [showAwards, setShowAwards] = useState(false);

  const avenue = params?.name ? getAvenueByName(params.name) : null;
  const post = avenue && params?.postId ? getPost(avenue.id, params.postId) : null;
  
  if (!avenue || !post) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Post not found</h1>
          <p className="text-muted-foreground mb-4">This post may have been removed or doesn't exist.</p>
          <Link href="/avenues">
            <Button data-testid="button-browse-avenues">Browse Avenues</Button>
          </Link>
        </div>
      </div>
    );
  }

  const comments = getThreadedComments(post.id);
  const vote = getPostVote(post.id);
  const score = post.upvotes - post.downvotes;
  const awards = getPostAwards(post.id);

  const handleVote = (value: 1 | -1) => {
    voteOnPost(avenue.id, post.id, value);
    setRefresh(r => r + 1);
  };

  const handleCommentVote = (commentId: string, value: 1 | -1) => {
    voteOnComment(commentId, post.id, value);
    setRefresh(r => r + 1);
  };

  const handleSubmitComment = (parentId: string | null = null) => {
    if (!commentText.trim()) return;
    addComment(avenue.id, post.id, commentText, parentId);
    setCommentText("");
    setReplyingTo(null);
    setRefresh(r => r + 1);
  };

  const handleGiveAward = (awardType: AwardType) => {
    giveAward(awardType, post.id, post.author);
    setShowAwards(false);
    setRefresh(r => r + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <Link href={`/av/${avenue.name}`}>
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-to-avenue">
              <ArrowLeft className="w-4 h-4" />
              Back to a/{avenue.name}
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-0">
            <div className="flex">
              <div className="flex flex-col items-center p-3 bg-muted/30 gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className={vote === 1 ? "text-primary" : "text-muted-foreground"}
                  onClick={() => handleVote(1)}
                  data-testid="button-upvote-post"
                >
                  <ArrowBigUp className="w-7 h-7" />
                </Button>
                <span className={`text-lg font-bold ${score > 0 ? "text-primary" : score < 0 ? "text-destructive" : ""}`}>
                  {formatCount(score)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className={vote === -1 ? "text-destructive" : "text-muted-foreground"}
                  onClick={() => handleVote(-1)}
                  data-testid="button-downvote-post"
                >
                  <ArrowBigDown className="w-7 h-7" />
                </Button>
              </div>

              <div className="flex-1 p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 flex-wrap">
                  <Link href={`/av/${avenue.name}`}>
                    <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                      a/{avenue.name}
                    </Badge>
                  </Link>
                  {post.isPinned && (
                    <Badge variant="outline" className="gap-1">
                      <Pin className="w-3 h-3" />
                      Pinned
                    </Badge>
                  )}
                  {post.isLocked && (
                    <Badge variant="outline" className="gap-1">
                      <Lock className="w-3 h-3" />
                      Locked
                    </Badge>
                  )}
                  <span>Posted by u/{post.author}</span>
                  <span>{formatDistanceToNow(post.createdAt)} ago</span>
                  {post.flair && (
                    <Badge style={{ backgroundColor: post.flair.bgColor, color: post.flair.color }}>
                      {post.flair.name}
                    </Badge>
                  )}
                </div>

                {awards.length > 0 && (
                  <div className="flex items-center gap-1 mb-2">
                    {Object.entries(
                      awards.reduce((acc, a) => {
                        acc[a.type] = (acc[a.type] || 0) + 1;
                        return acc;
                      }, {} as Record<AwardType, number>)
                    ).map(([type, count]) => {
                      const Icon = awardIcons[type as AwardType];
                      const config = awardConfig[type as AwardType];
                      return (
                        <span 
                          key={type} 
                          className="flex items-center gap-0.5 text-sm"
                          style={{ color: config.color }}
                        >
                          <Icon className="w-4 h-4" />
                          {count > 1 && count}
                        </span>
                      );
                    })}
                  </div>
                )}

                <h1 className="text-xl font-bold mb-3">{post.title}</h1>

                {post.type === "text" && post.content && (
                  <p className="text-sm whitespace-pre-wrap">{post.content}</p>
                )}

                {post.type === "image" && post.mediaUrl && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <img src={post.mediaUrl} alt="" className="max-w-full" />
                  </div>
                )}

                {post.type === "video" && post.mediaUrl && (
                  <div className="mt-2 rounded-md overflow-hidden">
                    <video src={post.mediaUrl} controls className="max-w-full" />
                  </div>
                )}

                {post.type === "link" && post.linkUrl && (
                  <a 
                    href={post.linkUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-2 flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    {post.linkUrl}
                  </a>
                )}

                {post.type === "poll" && post.pollOptions && (
                  <div className="mt-3 space-y-2">
                    {post.pollOptions.map(opt => {
                      const totalVotes = post.pollOptions!.reduce((sum, o) => sum + o.votes, 0);
                      const percent = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                      return (
                        <div key={opt.id} className="relative rounded-md overflow-hidden border">
                          <div 
                            className="absolute inset-0 bg-primary/20"
                            style={{ width: `${percent}%` }}
                          />
                          <div className="relative flex items-center justify-between p-3">
                            <span className="font-medium">{opt.text}</span>
                            <span className="text-muted-foreground">{opt.votes} votes ({percent.toFixed(0)}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-4 text-muted-foreground flex-wrap">
                  <Button variant="ghost" size="sm" className="gap-1" data-testid="button-comments-count">
                    <MessageSquare className="w-4 h-4" />
                    {post.commentCount} Comments
                  </Button>
                  
                  <Dialog open={showAwards} onOpenChange={setShowAwards}>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="gap-1" data-testid="button-give-award">
                        <Award className="w-4 h-4" />
                        Award
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Give an Award</DialogTitle>
                      </DialogHeader>
                      <AwardsGrid onSelect={handleGiveAward} />
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="sm" className="gap-1" data-testid="button-share-post">
                    <Share2 className="w-4 h-4" />
                    Share
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1" data-testid="button-save-post">
                    <Bookmark className="w-4 h-4" />
                    Save
                  </Button>
                  <Button variant="ghost" size="icon" data-testid="button-more-post">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {session && !post.isLocked && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground mb-2">Comment as u/{session.username}</p>
              <Textarea
                placeholder="What are your thoughts?"
                value={replyingTo === null ? commentText : ""}
                onChange={(e) => {
                  setReplyingTo(null);
                  setCommentText(e.target.value);
                }}
                rows={4}
                data-testid="input-comment"
              />
              <div className="flex justify-end mt-2">
                <Button 
                  onClick={() => handleSubmitComment(null)}
                  disabled={!commentText.trim()}
                  data-testid="button-submit-comment"
                >
                  Comment
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map(comment => (
              <CommentThread
                key={comment.id}
                comment={comment}
                postId={post.id}
                isLocked={post.isLocked}
                onVote={handleCommentVote}
                onReply={(parentId) => {
                  setReplyingTo(parentId);
                }}
                replyingTo={replyingTo}
                replyText={commentText}
                onReplyTextChange={setCommentText}
                onSubmitReply={handleSubmitComment}
                onCancelReply={() => setReplyingTo(null)}
              />
            ))
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <MessageSquare className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">No comments yet. Be the first!</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function CommentThread({
  comment,
  postId,
  isLocked,
  onVote,
  onReply,
  replyingTo,
  replyText,
  onReplyTextChange,
  onSubmitReply,
  onCancelReply,
  depth = 0,
}: {
  comment: CommentType;
  postId: string;
  isLocked: boolean;
  onVote: (commentId: string, value: 1 | -1) => void;
  onReply: (parentId: string) => void;
  replyingTo: string | null;
  replyText: string;
  onReplyTextChange: (text: string) => void;
  onSubmitReply: (parentId: string) => void;
  onCancelReply: () => void;
  depth?: number;
}) {
  const { session } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const vote = getCommentVote(comment.id);
  const score = comment.upvotes - comment.downvotes;
  const hasChildren = comment.children && comment.children.length > 0;

  if (comment.isRemoved) {
    return (
      <div className={`${depth > 0 ? "ml-4 pl-4 border-l-2 border-muted" : ""}`}>
        <p className="text-sm text-muted-foreground italic">[removed]</p>
      </div>
    );
  }

  return (
    <div className={`${depth > 0 ? "ml-4 pl-4 border-l-2 border-muted" : ""}`}>
      <div className="flex gap-2">
        <div className="flex flex-col items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 ${vote === 1 ? "text-primary" : "text-muted-foreground"}`}
            onClick={() => onVote(comment.id, 1)}
            data-testid={`button-upvote-comment-${comment.id}`}
          >
            <ArrowBigUp className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-6 w-6 ${vote === -1 ? "text-destructive" : "text-muted-foreground"}`}
            onClick={() => onVote(comment.id, -1)}
            data-testid={`button-downvote-comment-${comment.id}`}
          >
            <ArrowBigDown className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {hasChildren && (
              <Button
                variant="ghost"
                size="icon"
                className="h-5 w-5"
                onClick={() => setCollapsed(!collapsed)}
                data-testid={`button-collapse-comment-${comment.id}`}
              >
                {collapsed ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
              </Button>
            )}
            <span className="font-medium text-foreground">u/{comment.author}</span>
            <span className={`font-medium ${score > 0 ? "text-primary" : score < 0 ? "text-destructive" : ""}`}>
              {score} points
            </span>
            <span>{formatDistanceToNow(comment.createdAt)} ago</span>
            {comment.isEdited && <span className="italic">edited</span>}
          </div>

          {!collapsed && (
            <>
              <p className="text-sm mt-1 whitespace-pre-wrap">{comment.content}</p>

              <div className="flex items-center gap-2 mt-1">
                {session && !isLocked && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 text-xs gap-1"
                    onClick={() => onReply(comment.id)}
                    data-testid={`button-reply-comment-${comment.id}`}
                  >
                    <Reply className="w-3 h-3" />
                    Reply
                  </Button>
                )}
              </div>

              {replyingTo === comment.id && (
                <div className="mt-2 space-y-2">
                  <Textarea
                    placeholder="Write a reply..."
                    value={replyText}
                    onChange={(e) => onReplyTextChange(e.target.value)}
                    rows={3}
                    autoFocus
                    data-testid={`input-reply-${comment.id}`}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => onSubmitReply(comment.id)} data-testid={`button-submit-reply-${comment.id}`}>
                      Reply
                    </Button>
                    <Button size="sm" variant="outline" onClick={onCancelReply} data-testid={`button-cancel-reply-${comment.id}`}>
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              {hasChildren && (
                <div className="mt-3 space-y-3">
                  {comment.children!.map(child => (
                    <CommentThread
                      key={child.id}
                      comment={child}
                      postId={postId}
                      isLocked={isLocked}
                      onVote={onVote}
                      onReply={onReply}
                      replyingTo={replyingTo}
                      replyText={replyText}
                      onReplyTextChange={onReplyTextChange}
                      onSubmitReply={onSubmitReply}
                      onCancelReply={onCancelReply}
                      depth={depth + 1}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AwardsGrid({ onSelect }: { onSelect: (type: AwardType) => void }) {
  const { session } = useAuth();
  const wallet = session ? getWallet(session.username) : null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {(Object.entries(awardConfig) as [AwardType, typeof awardConfig.silver][]).map(([type, config]) => {
        const Icon = awardIcons[type];
        const canAfford = wallet && wallet.available >= config.cost;
        
        return (
          <Button
            key={type}
            variant="outline"
            className="h-auto p-3 flex flex-col items-center gap-2"
            disabled={!canAfford}
            onClick={() => onSelect(type)}
            data-testid={`button-award-${type}`}
          >
            <Icon className="w-8 h-8" style={{ color: config.color }} />
            <span className="font-medium">{config.name}</span>
            <span className="text-sm text-muted-foreground">{config.cost} DAH Coins</span>
          </Button>
        );
      })}
      {wallet && (
        <div className="col-span-2 text-center text-sm text-muted-foreground">
          Your balance: {wallet.available} DAH Coins
        </div>
      )}
    </div>
  );
}
