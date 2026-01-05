import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Plus, Play, ShoppingBag, Sparkles, Video, Radio, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "./AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { 
  addImagination, 
  getImaginationsGroupedByUser, 
  getUserImaginations,
  Imagination,
  deleteImagination 
} from "@/lib/imaginations";
import { addCoins } from "@/lib/dahCoins";

interface BubbleData {
  username: string;
  avatar?: string;
  hasNew: boolean;
  type: "imagination" | "live" | "video" | "product";
  label?: string;
  imaginations?: Imagination[];
}

const staticBubbles: BubbleData[] = [
  { username: "trending", hasNew: true, type: "video", label: "For You" },
  { username: "tech_hub", hasNew: true, type: "live", label: "LIVE" },
  { username: "dah_mall", hasNew: true, type: "product", label: "Shop" },
];

export function ImaginationBubbles() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [content, setContent] = useState("");
  const [bubbles, setBubbles] = useState<BubbleData[]>(staticBubbles);
  const [viewingUser, setViewingUser] = useState<string | null>(null);
  const [viewingImaginations, setViewingImaginations] = useState<Imagination[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    refreshBubbles();
  }, []);

  const refreshBubbles = () => {
    const grouped = getImaginationsGroupedByUser();
    const userBubbles: BubbleData[] = [];
    
    grouped.forEach((imaginations, username) => {
      userBubbles.push({
        username,
        hasNew: true,
        type: "imagination",
        imaginations,
      });
    });
    
    setBubbles([...userBubbles, ...staticBubbles]);
  };

  const handleCreate = () => {
    if (!session || !content.trim()) return;
    
    addImagination(session.username, content.trim());
    addCoins(session.username, session.age, "Created an Imagination", 3);
    
    toast({
      title: "Imagination created!",
      description: "Your imagination will be visible for 24 hours.",
    });
    
    setContent("");
    setCreateOpen(false);
    refreshBubbles();
  };

  const handleViewImagination = (bubble: BubbleData) => {
    if (bubble.type !== "imagination" || !bubble.imaginations?.length) return;
    
    setViewingUser(bubble.username);
    setViewingImaginations(bubble.imaginations);
    setCurrentIndex(0);
    setViewOpen(true);
  };

  const handleDeleteImagination = (id: string) => {
    deleteImagination(id);
    toast({ title: "Imagination deleted" });
    setViewOpen(false);
    refreshBubbles();
  };

  const hasOwnImagination = session ? getUserImaginations(session.username).length > 0 : false;

  const getTypeIcon = (type: BubbleData["type"]) => {
    switch (type) {
      case "live":
        return <Radio className="w-3 h-3" />;
      case "video":
        return <Play className="w-3 h-3" />;
      case "product":
        return <ShoppingBag className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: BubbleData["type"]) => {
    switch (type) {
      case "live":
        return "bg-red-500";
      case "video":
        return "bg-blue-500";
      case "product":
        return "bg-pink-500";
      default:
        return "bg-muted";
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto scrollbar-hide">
        <div className="flex items-start gap-4 px-4 py-4 min-w-max">
          {session && (
            <div 
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer"
              onClick={() => setCreateOpen(true)}
              data-testid="button-add-imagination"
            >
              <div className="relative">
                <div className={`w-16 h-16 rounded-full ${hasOwnImagination ? 'ring-gradient-dah p-[3px]' : 'bg-card border-2 border-dashed border-muted-foreground/30'} flex items-center justify-center hover-elevate`}>
                  {hasOwnImagination ? (
                    <Avatar className="w-full h-full">
                      <AvatarFallback className="bg-card text-foreground">
                        {session.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <Plus className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                  <Plus className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {hasOwnImagination ? "Add More" : "Add Imagination"}
              </span>
            </div>
          )}
          
          {bubbles.map((bubble, idx) => (
            <div 
              key={`${bubble.username}-${idx}`}
              onClick={() => bubble.type === "imagination" ? handleViewImagination(bubble) : undefined}
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
              data-testid={`imagination-bubble-${bubble.username}`}
            >
              {bubble.type === "imagination" ? (
                <div className={`p-[3px] rounded-full ${bubble.hasNew ? 'ring-gradient-dah' : 'bg-muted'}`}>
                  <div className="bg-background rounded-full p-[2px]">
                    <Avatar className="w-14 h-14 group-hover:scale-105 transition-transform">
                      <AvatarImage src={bubble.avatar} />
                      <AvatarFallback className="bg-card text-foreground text-sm font-medium">
                        {bubble.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              ) : (
                <Link href={bubble.type === "product" ? "/mall" : bubble.type === "video" ? "/video" : `/profile/${bubble.username}`}>
                  <div className={`p-[3px] rounded-full ${bubble.hasNew ? 'ring-gradient-dah' : 'bg-muted'}`}>
                    <div className="bg-background rounded-full p-[2px]">
                      <Avatar className="w-14 h-14 group-hover:scale-105 transition-transform">
                        <AvatarImage src={bubble.avatar} />
                        <AvatarFallback className="bg-card text-foreground text-sm font-medium">
                          {bubble.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </Link>
              )}
              
              {bubble.type !== "imagination" && (
                <div className={`absolute mt-11 ml-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white ${getTypeColor(bubble.type)}`}>
                  {getTypeIcon(bubble.type)}
                  {bubble.label && <span>{bubble.label}</span>}
                </div>
              )}
              
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[64px]">
                {bubble.label || bubble.username.split('_')[0]}
              </span>
            </div>
          ))}
          
          <Link href="/mall">
            <div 
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
              data-testid="imagination-bubble-mall"
            >
              <div className="ring-gradient-dah p-[3px] rounded-full">
                <div className="bg-background rounded-full p-[2px]">
                  <div className="w-14 h-14 rounded-full bg-dah-gradient-strong flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
              <span className="text-xs text-primary font-medium">DAH Mall</span>
            </div>
          </Link>
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create Imagination</DialogTitle>
            <DialogDescription>
              Share a thought, moment, or idea. It will be visible for 24 hours.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Textarea
              placeholder="What's on your imagination?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              className="resize-none"
              data-testid="input-imagination-content"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreate} 
                disabled={!content.trim()}
                className="bg-dah-gradient-strong"
                data-testid="button-submit-imagination"
              >
                Share Imagination
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          <div className="relative bg-gradient-to-b from-card to-background min-h-[400px] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-border/50">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="bg-primary/20 text-primary">
                    {viewingUser?.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-sm">{viewingUser}</div>
                  <div className="text-xs text-muted-foreground">
                    {viewingImaginations[currentIndex] && 
                      new Date(viewingImaginations[currentIndex].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                  </div>
                </div>
              </div>
              {session?.username === viewingUser && viewingImaginations[currentIndex] && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteImagination(viewingImaginations[currentIndex].id)}
                  data-testid="button-delete-imagination"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            
            {viewingImaginations.length > 1 && (
              <div className="flex gap-1 px-4 pt-2">
                {viewingImaginations.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${i === currentIndex ? 'bg-primary' : 'bg-muted'}`}
                    onClick={() => setCurrentIndex(i)}
                  />
                ))}
              </div>
            )}
            
            <div className="flex-1 flex items-center justify-center p-6">
              <p className="text-lg text-center" data-testid="text-imagination-content">
                {viewingImaginations[currentIndex]?.content}
              </p>
            </div>
            
            {viewingImaginations.length > 1 && (
              <div className="flex justify-between p-4">
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={currentIndex === 0}
                  onClick={() => setCurrentIndex(i => i - 1)}
                >
                  Previous
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  disabled={currentIndex === viewingImaginations.length - 1}
                  onClick={() => setCurrentIndex(i => i + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
