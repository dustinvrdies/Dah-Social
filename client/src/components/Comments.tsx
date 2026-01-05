import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useAuth } from "./AuthProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  getComments, 
  addComment, 
  deleteComment, 
  editComment, 
  subscribeToEngagement,
  Comment 
} from "@/lib/engagement";
import { Trash2, Pencil, Check, X } from "lucide-react";

interface CommentsProps {
  postId: string;
}

export function Comments({ postId }: CommentsProps) {
  const { session } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    const refresh = () => setComments(getComments(postId));
    refresh();
    
    const unsubscribe = subscribeToEngagement(refresh);
    return unsubscribe;
  }, [postId]);

  const handleSubmit = () => {
    if (!session || !input.trim()) return;
    addComment(postId, session.username, input.trim());
    setInput("");
  };

  const handleDelete = (commentId: string) => {
    deleteComment(postId, commentId);
  };

  const handleEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditContent(comment.content);
  };

  const handleSaveEdit = () => {
    if (!editingId || !editContent.trim()) return;
    editComment(postId, editingId, editContent.trim());
    setEditingId(null);
    setEditContent("");
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  const formatTime = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "now";
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(hours / 24);
    return `${days}d`;
  };

  return (
    <div className="mt-3 space-y-3 border-t border-border/50 pt-3">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-2" data-testid={`comment-${comment.id}`}>
          <Link href={`/profile/${comment.username}`}>
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarFallback className="text-xs bg-muted">
                {comment.username.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            {editingId === comment.id ? (
              <div className="flex items-center gap-2">
                <Input
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="flex-1 h-8 text-sm"
                  autoFocus
                  data-testid="input-edit-comment"
                />
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleSaveEdit}>
                  <Check className="w-4 h-4 text-green-500" />
                </Button>
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleCancelEdit}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </Button>
              </div>
            ) : (
              <div className="group">
                <p className="text-sm">
                  <Link href={`/profile/${comment.username}`}>
                    <span className="font-semibold hover:text-primary cursor-pointer">
                      {comment.username}
                    </span>
                  </Link>
                  {" "}
                  <span data-testid="text-comment-content">{comment.content}</span>
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-muted-foreground">{formatTime(comment.createdAt)}</span>
                  {comment.editedAt && (
                    <span className="text-xs text-muted-foreground">(edited)</span>
                  )}
                  {session?.username === comment.username && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(comment)}
                        className="text-xs text-muted-foreground hover:text-foreground"
                        data-testid="button-edit-comment"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button 
                        onClick={() => handleDelete(comment.id)}
                        className="text-xs text-muted-foreground hover:text-destructive"
                        data-testid="button-delete-comment"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
      
      {session && (
        <div className="flex items-center gap-2">
          <Avatar className="w-8 h-8 flex-shrink-0">
            <AvatarFallback className="text-xs bg-muted">
              {session.username.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Input
            placeholder="Add a comment..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmit();
            }}
            className="flex-1 h-9 text-sm bg-muted/50 border-0"
            data-testid="input-add-comment"
          />
          <Button 
            size="sm" 
            variant="ghost"
            onClick={handleSubmit}
            disabled={!input.trim()}
            className="text-primary"
            data-testid="button-submit-comment"
          >
            Post
          </Button>
        </div>
      )}
    </div>
  );
}
