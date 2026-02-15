import { useState, useRef } from "react";
import { useAuth } from "./AuthProvider";
import { addPost } from "@/lib/posts";
import { initialFeed } from "@/lib/feedData";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Image, Video } from "lucide-react";

interface ComposeBoxProps {
  onPostCreated?: () => void;
}

export function ComposeBox({ onPostCreated }: ComposeBoxProps) {
  const { session } = useAuth();
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  if (!session) return null;

  const handlePost = () => {
    if (!content.trim() && !media) return;

    const newPost = {
      id: `post-${Date.now()}`,
      type: "text" as const,
      user: session.username,
      content: content.trim(),
      media: media || undefined,
      timestamp: Date.now(),
    };

    addPost(newPost, initialFeed);
    addCoins(session.username, session.age, "Created a post", 5);
    pushNotification(session.username, {
      username: session.username,
      type: "coin",
      message: "+5 DAH Coins for creating a post",
    });

    setContent("");
    setMedia(null);
    onPostCreated?.();
  };

  const handleMediaSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setMedia(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-md bg-card border border-border/50" data-testid="compose-box">
      <Avatar className="w-9 h-9 flex-shrink-0">
        <AvatarFallback className="bg-primary/15 text-primary text-sm font-semibold">
          {session.username.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handlePost(); } }}
          placeholder="What's manifesting in your brain today?"
          className="w-full bg-transparent text-sm placeholder:text-muted-foreground/60 outline-none py-1"
          data-testid="input-compose"
        />
        {media && (
          <div className="mt-2 relative inline-block">
            <img src={media} alt="" className="max-h-24 rounded-md" />
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-1 -right-1 bg-background/80 backdrop-blur-sm"
              onClick={() => setMedia(null)}
              data-testid="button-remove-compose-media"
            >
              <span className="text-xs">x</span>
            </Button>
          </div>
        )}
        <div className="flex items-center justify-between gap-2 mt-2">
          <div className="flex items-center gap-1">
            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleMediaSelect} />
            <Button variant="ghost" size="icon" onClick={() => imageRef.current?.click()} data-testid="button-compose-image">
              <Image className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-compose-video">
              <Video className="w-4 h-4 text-muted-foreground" />
            </Button>
          </div>
          <Button
            size="sm"
            onClick={handlePost}
            disabled={!content.trim() && !media}
            className="bg-primary text-primary-foreground font-semibold px-5"
            data-testid="button-compose-post"
          >
            POST
          </Button>
        </div>
      </div>
    </div>
  );
}
