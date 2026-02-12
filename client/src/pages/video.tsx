import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { NativeAdCard } from "@/components/NativeAdCard";
import { videoOnlyFeed, getAllPosts } from "@/lib/feedData";
import { getVideoAds, NativeAd } from "@/lib/ads";
import { VideoPost as VideoPostType } from "@/lib/postTypes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  Music2, 
  Volume2, 
  VolumeX,
  BadgeCheck,
  Plus,
  ArrowLeft
} from "lucide-react";

const VIDEO_AD_FREQUENCY = 4;

type VideoFeedItem = { type: "video"; post: VideoPostType } | { type: "ad"; ad: NativeAd };

function TikTokVideoCard({ post, isMuted, onToggleMute, isActive }: { post: VideoPostType; isMuted: boolean; onToggleMute: () => void; isActive: boolean }) {
  const { session } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (isActive) {
      const playPromise = videoRef.current.play();
      if (playPromise) playPromise.catch(() => {});
    } else {
      videoRef.current.pause();
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
    }
  };

  const user = post.user || "unknown";
  const caption = post.caption || "";

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-dvh bg-black snap-start snap-always flex-shrink-0"
    >
      <video
        ref={videoRef}
        src={post.src}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        onClick={togglePlay}
        data-testid={`video-player-${post.id}`}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
      
      <div className="absolute bottom-0 left-0 right-16 p-4 space-y-3">
        <Link href={`/profile/${user}`}>
          <div className="flex items-center gap-3 cursor-pointer">
            <Avatar className="w-10 h-10 ring-2 ring-white/30">
              <AvatarFallback className="bg-card text-sm font-medium">
                {user.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white text-sm">@{user}</span>
              <Button size="sm" variant="outline" className="h-6 px-3 text-xs bg-transparent border-white/50 text-white">
                Follow
              </Button>
            </div>
          </div>
        </Link>
        
        <p className="text-white text-sm leading-relaxed line-clamp-3">{caption}</p>
        
        <div className="flex items-center gap-2 text-white/70">
          <Music2 className="w-3 h-3" />
          <span className="text-xs">Original Sound - {user}</span>
        </div>
      </div>

      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <Link href={`/profile/${user}`}>
          <div className="relative">
            <Avatar className="w-11 h-11 ring-2 ring-white">
              <AvatarFallback className="bg-card font-medium">
                {user.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
              <Plus className="w-3 h-3 text-white" />
            </div>
          </div>
        </Link>
        
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setIsLiked(!isLiked)}
          data-testid={`button-like-video-${post.id}`}
        >
          <Heart className={`w-7 h-7 ${isLiked ? 'text-pink-500 fill-current' : 'text-white'}`} />
          <span className="text-white text-xs font-medium">
            {Math.floor(Math.random() * 50 + 10)}K
          </span>
        </button>
        
        <button className="flex flex-col items-center gap-1" data-testid={`button-comment-video-${post.id}`}>
          <MessageCircle className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">{Math.floor(Math.random() * 500 + 50)}</span>
        </button>
        
        <button className="flex flex-col items-center gap-1" data-testid={`button-share-video-${post.id}`}>
          <Send className="w-7 h-7 text-white" />
          <span className="text-white text-xs font-medium">Share</span>
        </button>
        
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => setIsSaved(!isSaved)}
          data-testid={`button-save-video-${post.id}`}
        >
          <Bookmark className={`w-7 h-7 ${isSaved ? 'text-primary fill-current' : 'text-white'}`} />
        </button>
      </div>

      <button
        onClick={onToggleMute}
        className="absolute top-4 right-4 p-2 rounded-full bg-black/30 backdrop-blur-sm text-white"
        data-testid="button-toggle-mute"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}

export default function VideoPage() {
  const [isMuted, setIsMuted] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const allVideos = useMemo(() => {
    const allPosts = getAllPosts();
    return allPosts.filter((p): p is VideoPostType => p.type === "video");
  }, []);

  const feedWithAds = useMemo((): VideoFeedItem[] => {
    const videoAds = getVideoAds();
    const result: VideoFeedItem[] = [];
    let adIndex = 0;

    const videos: VideoPostType[] = allVideos.length > 0 ? allVideos : videoOnlyFeed;

    videos.forEach((post, i) => {
      result.push({ type: "video", post });
      if ((i + 1) % VIDEO_AD_FREQUENCY === 0 && videoAds.length > 0) {
        result.push({ type: "ad", ad: videoAds[adIndex % videoAds.length] });
        adIndex++;
      }
    });

    return result;
  }, [allVideos]);

  const handleScroll = useCallback(() => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const itemHeight = container.clientHeight;
    const newIndex = Math.round(container.scrollTop / itemHeight);
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 overflow-hidden">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-scroll snap-y snap-mandatory scrollbar-hide"
          style={{ scrollSnapType: "y mandatory" }}
        >
          {feedWithAds.length === 0 ? (
            <div className="h-full flex items-center justify-center text-white/60">
              No videos yet. Be the first to share!
            </div>
          ) : (
            feedWithAds.map((item, idx) => {
              if (item.type === "ad") {
                return (
                  <div 
                    key={`ad-${item.ad.id}-${idx}`} 
                    className="w-full h-dvh snap-start snap-always flex-shrink-0"
                  >
                    <NativeAdCard ad={item.ad} variant="video" />
                  </div>
                );
              }
              return (
                <TikTokVideoCard 
                  key={`${item.post.id}-${idx}`} 
                  post={item.post} 
                  isMuted={isMuted}
                  onToggleMute={() => setIsMuted(!isMuted)}
                  isActive={idx === activeIndex}
                />
              );
            })
          )}
        </div>
      </div>
      <div className="absolute top-4 left-4 z-10">
        <Link href="/">
          <Button size="icon" variant="ghost" className="text-white bg-black/30 backdrop-blur-sm" data-testid="button-back-from-video">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
