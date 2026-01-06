import { useState, useRef, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { addReaction, getUserReaction, getReactionCounts, getTotalReactions, getTopReactions, reactionConfig, ReactionType } from "@/lib/reactions";
import { Button } from "@/components/ui/button";
import { ThumbsUp, Heart, Smile, AlertCircle, Frown, Flame, DollarSign, Angry } from "lucide-react";

const iconMap: Record<string, any> = {
  "thumbs-up": ThumbsUp,
  heart: Heart,
  laugh: Smile,
  "circle-alert": AlertCircle,
  frown: Frown,
  angry: Angry,
  flame: Flame,
  "dollar-sign": DollarSign,
};

interface ReactionsProps {
  postId: string;
  postOwner: string;
  compact?: boolean;
}

export function Reactions({ postId, postOwner, compact = false }: ReactionsProps) {
  const { session } = useAuth();
  const [showPicker, setShowPicker] = useState(false);
  const [currentReaction, setCurrentReaction] = useState<ReactionType | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [topReactions, setTopReactions] = useState<ReactionType[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    if (session) {
      setCurrentReaction(getUserReaction(postId, session.username));
    }
    setTotalCount(getTotalReactions(postId));
    setTopReactions(getTopReactions(postId));
  }, [postId, session]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setShowPicker(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setShowPicker(false);
    }, 300);
  };

  const handleReact = (type: ReactionType) => {
    if (!session) return;

    const added = addReaction(postId, session.username, type, postOwner, 25);
    if (currentReaction === type) {
      setCurrentReaction(null);
      setTotalCount((c) => Math.max(0, c - 1));
    } else {
      if (!currentReaction) {
        setTotalCount((c) => c + 1);
      }
      setCurrentReaction(type);
    }
    setTopReactions(getTopReactions(postId));
    setShowPicker(false);
  };

  const handleQuickReact = () => {
    if (!session) return;
    handleReact(currentReaction || "like");
  };

  const CurrentIcon = currentReaction ? iconMap[reactionConfig[currentReaction].icon] : ThumbsUp;
  const currentColor = currentReaction ? reactionConfig[currentReaction].color : "text-muted-foreground";

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        {topReactions.length > 0 && (
          <div className="flex -space-x-1">
            {topReactions.map((type) => {
              const Icon = iconMap[reactionConfig[type].icon];
              return (
                <div key={type} className={`w-4 h-4 rounded-full bg-muted flex items-center justify-center ${reactionConfig[type].color}`}>
                  <Icon className="w-2.5 h-2.5" />
                </div>
              );
            })}
          </div>
        )}
        <span className="text-xs text-muted-foreground">{totalCount > 0 ? totalCount : ""}</span>
      </div>
    );
  }

  return (
    <div className="relative" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <Button
        variant="ghost"
        size="sm"
        className={`gap-1.5 ${currentReaction ? currentColor : ""}`}
        onClick={handleQuickReact}
        data-testid={`button-react-${postId}`}
      >
        <CurrentIcon className={`w-4 h-4 ${currentReaction ? "fill-current" : ""}`} />
        <span>{totalCount > 0 ? totalCount : "Like"}</span>
      </Button>

      {showPicker && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-0 mb-2 flex items-center gap-1 bg-card border rounded-full px-2 py-1.5 shadow-lg z-50"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {(Object.keys(reactionConfig) as ReactionType[]).map((type) => {
            const Icon = iconMap[reactionConfig[type].icon];
            const config = reactionConfig[type];
            return (
              <button
                key={type}
                onClick={() => handleReact(type)}
                className={`p-1.5 rounded-full transition-transform hover:scale-125 ${
                  currentReaction === type ? "bg-primary/20" : "hover:bg-muted"
                }`}
                title={config.label}
                data-testid={`button-reaction-${type}`}
              >
                <Icon className={`w-5 h-5 ${config.color}`} />
              </button>
            );
          })}
        </div>
      )}

      {topReactions.length > 0 && totalCount > 0 && (
        <div className="absolute -top-1 -right-2 flex -space-x-1">
          {topReactions.slice(0, 2).map((type) => {
            const Icon = iconMap[reactionConfig[type].icon];
            return (
              <div key={type} className={`w-4 h-4 rounded-full bg-card border flex items-center justify-center ${reactionConfig[type].color}`}>
                <Icon className="w-2.5 h-2.5 fill-current" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
