import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { addPost } from "@/lib/posts";
import { initialFeed } from "@/lib/feedData";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { Post } from "@/lib/postTypes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface CreatePostModalProps {
  onPostCreated: (posts: Post[]) => void;
}

export function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState("");

  if (!session) return null;

  const handleCreate = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: `p-${Date.now()}`,
      type: "text",
      user: session.username,
      content: content.trim(),
    };

    const updated = addPost(newPost, initialFeed);
    onPostCreated(updated);
    setContent("");
    setOpen(false);

    addCoins(session.username, session.age, "Created a post", 5);
    pushNotification(session.username, {
      username: session.username,
      type: "coin",
      message: "You earned 5 DAH Coins for creating a post.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-post">
          <Plus className="w-4 h-4 mr-1" />
          Create Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Post</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            data-testid="input-post-content"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)} data-testid="button-cancel-post">
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!content.trim()} data-testid="button-submit-post">
              Post
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
