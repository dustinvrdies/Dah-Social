import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, ChevronLeft, ChevronRight, X, Heart, Send, Eye } from "lucide-react";
import { lsGet, lsSet } from "@/lib/storage";

interface Story {
  id: string;
  username: string;
  displayName?: string;
  avatar?: string;
  media: string;
  mediaType: "image" | "video";
  caption?: string;
  timestamp: number;
  views: number;
}

const STORIES_KEY = "dah.stories";

const picsum = (id: number) => `https://picsum.photos/id/${id}/1080/1920`;

const initialStories: Story[] = [
  { id: "s1", username: "maya_creates", displayName: "Maya", media: picsum(1015), mediaType: "image", caption: "Golden hour vibes", timestamp: Date.now() - 3600000, views: 234 },
  { id: "s2", username: "techie_marcus", displayName: "Marcus", media: picsum(180), mediaType: "image", caption: "New setup finally complete", timestamp: Date.now() - 7200000, views: 156 },
  { id: "s3", username: "sarah_thrifts", displayName: "Sarah", media: picsum(1025), mediaType: "image", caption: "Today's finds", timestamp: Date.now() - 10800000, views: 189 },
  { id: "s4", username: "alex_trades", displayName: "Alex", media: picsum(1036), mediaType: "image", caption: "Market day", timestamp: Date.now() - 14400000, views: 312 },
  { id: "s5", username: "jenna_vintage", displayName: "Jenna", media: picsum(1047), mediaType: "image", caption: "90s forever", timestamp: Date.now() - 18000000, views: 278 },
  { id: "s6", username: "mike_flips", displayName: "Mike", media: picsum(1067), mediaType: "image", caption: "Estate sale score", timestamp: Date.now() - 21600000, views: 445 },
  { id: "s7", username: "maya_creates", media: picsum(1084), mediaType: "image", caption: "Studio update", timestamp: Date.now() - 1800000, views: 567 },
  { id: "s8", username: "techie_marcus", media: picsum(366), mediaType: "image", caption: "Retro tech", timestamp: Date.now() - 5400000, views: 123 },
];

function getStories(): Story[] {
  return lsGet<Story[]>(STORIES_KEY, initialStories);
}

function addStory(story: Story) {
  const stories = getStories();
  stories.unshift(story);
  if (stories.length > 50) stories.pop();
  lsSet(STORIES_KEY, stories);
}

function groupStoriesByUser(stories: Story[]) {
  const map = new Map<string, Story[]>();
  stories.forEach((s) => {
    const list = map.get(s.username) || [];
    list.push(s);
    map.set(s.username, list);
  });
  return Array.from(map.entries()).map(([username, storyList]) => ({
    username,
    displayName: storyList[0].displayName || username,
    avatar: storyList[0].avatar,
    stories: storyList.sort((a, b) => a.timestamp - b.timestamp),
    latestTimestamp: Math.max(...storyList.map((s) => s.timestamp)),
  }));
}

function StoryViewer({
  userStories,
  initialIndex,
  onClose,
}: {
  userStories: { username: string; stories: Story[] }[];
  initialIndex: number;
  onClose: () => void;
}) {
  const [userIdx, setUserIdx] = useState(initialIndex);
  const [storyIdx, setStoryIdx] = useState(0);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<number | null>(null);

  const currentUser = userStories[userIdx];
  const currentStory = currentUser?.stories[storyIdx];

  useEffect(() => {
    if (!currentStory) return;

    setProgress(0);
    const duration = currentStory.mediaType === "video" ? 15000 : 5000;
    const interval = 50;
    let elapsed = 0;

    timerRef.current = window.setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);
      if (elapsed >= duration) {
        goNext();
      }
    }, interval);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [userIdx, storyIdx, currentStory?.id]);

  const goNext = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (storyIdx < currentUser.stories.length - 1) {
      setStoryIdx(storyIdx + 1);
    } else if (userIdx < userStories.length - 1) {
      setUserIdx(userIdx + 1);
      setStoryIdx(0);
    } else {
      onClose();
    }
  };

  const goPrev = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (storyIdx > 0) {
      setStoryIdx(storyIdx - 1);
    } else if (userIdx > 0) {
      setUserIdx(userIdx - 1);
      const prevUser = userStories[userIdx - 1];
      setStoryIdx(prevUser.stories.length - 1);
    }
  };

  if (!currentStory) return null;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md h-[90vh] p-0 bg-black border-0 overflow-hidden">
        <div className="relative w-full h-full">
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-2">
            {currentUser.stories.map((_, i) => (
              <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-100"
                  style={{ width: i < storyIdx ? "100%" : i === storyIdx ? `${progress}%` : "0%" }}
                />
              </div>
            ))}
          </div>

          <div className="absolute top-6 left-0 right-0 z-20 flex items-center justify-between px-3">
            <div className="flex items-center gap-2">
              <Avatar className="w-8 h-8 ring-2 ring-white/50">
                <AvatarImage src={currentStory.avatar} />
                <AvatarFallback className="bg-card text-xs">{currentUser.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white text-sm font-medium">{currentUser.username}</p>
                <p className="text-white/60 text-xs">{formatTimeAgo(currentStory.timestamp)}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
              <X className="w-5 h-5" />
            </Button>
          </div>

          {currentStory.mediaType === "video" ? (
            <video
              ref={videoRef}
              src={currentStory.media}
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <img src={currentStory.media} alt="" className="w-full h-full object-cover" />
          )}

          <div className="absolute inset-0 flex">
            <div className="w-1/3 h-full cursor-pointer" onClick={goPrev} />
            <div className="w-1/3 h-full" />
            <div className="w-1/3 h-full cursor-pointer" onClick={goNext} />
          </div>

          {currentStory.caption && (
            <div className="absolute bottom-20 left-0 right-0 px-4">
              <p className="text-white text-center text-lg font-medium drop-shadow-lg">{currentStory.caption}</p>
            </div>
          )}

          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Reply to story..."
                className="flex-1 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white text-sm placeholder:text-white/50"
              />
              <Button size="icon" variant="ghost" className="text-white">
                <Heart className="w-6 h-6" />
              </Button>
              <Button size="icon" variant="ghost" className="text-white">
                <Send className="w-6 h-6" />
              </Button>
            </div>
          </div>

          <div className="absolute bottom-4 right-4 flex items-center gap-1 text-white/60 text-xs">
            <Eye className="w-4 h-4" />
            {currentStory.views}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatTimeAgo(timestamp: number) {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export function Stories() {
  const { session } = useAuth();
  const [stories] = useState(() => getStories());
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const grouped = groupStoriesByUser(stories);

  const openViewer = (idx: number) => {
    setViewerIndex(idx);
    setViewerOpen(true);
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide py-2 px-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex-shrink-0 flex flex-col items-center gap-1 w-16">
          <div className="relative">
            <Avatar className="w-16 h-16 ring-2 ring-dashed ring-muted-foreground/30">
              <AvatarFallback className="bg-muted text-lg">
                {session?.username?.slice(0, 2).toUpperCase() || "ME"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center ring-2 ring-background">
              <Plus className="w-4 h-4 text-white" />
            </div>
          </div>
          <span className="text-xs text-muted-foreground truncate w-full text-center">Your Story</span>
        </div>

        {grouped.map((user, idx) => (
          <button
            key={user.username}
            className="flex-shrink-0 flex flex-col items-center gap-1 w-16"
            onClick={() => openViewer(idx)}
            data-testid={`button-story-${user.username}`}
          >
            <div className="ring-gradient-dah p-[3px] rounded-full">
              <Avatar className="w-14 h-14 ring-2 ring-background">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-card text-sm">{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <span className="text-xs text-foreground truncate w-full text-center">{user.displayName || user.username}</span>
          </button>
        ))}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm shadow-sm hidden md:flex"
        onClick={scrollLeft}
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm shadow-sm hidden md:flex"
        onClick={scrollRight}
      >
        <ChevronRight className="w-4 h-4" />
      </Button>

      {viewerOpen && (
        <StoryViewer
          userStories={grouped}
          initialIndex={viewerIndex}
          onClose={() => setViewerOpen(false)}
        />
      )}
    </div>
  );
}
