import { useRef, useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX, Bookmark } from "lucide-react";

interface VideoPostProps {
  src: string;
  user: string;
  caption?: string;
  postId?: string;
}

export function VideoPost({ src, user, caption }: VideoPostProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount] = useState(Math.floor(Math.random() * 10000) + 100);
  const [commentCount] = useState(Math.floor(Math.random() * 500) + 10);

  const toggle = async () => {
    if (!ref.current) return;
    if (ref.current.paused) {
      await ref.current.play();
      setIsPlaying(true);
    } else {
      ref.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!ref.current) return;
    ref.current.muted = !ref.current.muted;
    setIsMuted(!isMuted);
  };

  return (
    <Card className="relative w-full aspect-[9/16] max-h-[80vh] overflow-hidden bg-black" data-testid={`card-video-${user}`}>
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover cursor-pointer"
        loop
        muted={isMuted}
        playsInline
        onClick={toggle}
        data-testid="video-player"
      />
      
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Play className="w-8 h-8 text-white fill-current ml-1" />
          </div>
        </div>
      )}
      
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-4">
        <Link href={`/profile/${user}`}>
          <div className="ring-gradient-dah p-[2px] rounded-full cursor-pointer">
            <Avatar className="w-12 h-12">
              <AvatarImage src={undefined} />
              <AvatarFallback className="bg-card text-sm font-medium">
                {user.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </Link>
        
        <div className="flex flex-col items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setLiked(!liked)}
            className={`text-white ${liked ? "text-pink-500" : ""}`}
            data-testid="button-like-video"
          >
            <Heart className={`w-7 h-7 ${liked ? "fill-current" : ""}`} />
          </Button>
          <span className="text-xs text-white font-medium">{(likeCount + (liked ? 1 : 0)).toLocaleString()}</span>
        </div>
        
        <div className="flex flex-col items-center gap-1">
          <Button variant="ghost" size="icon" className="text-white" data-testid="button-comment-video">
            <MessageCircle className="w-7 h-7" />
          </Button>
          <span className="text-xs text-white font-medium">{commentCount}</span>
        </div>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => setSaved(!saved)}
          className={`text-white ${saved ? "text-primary" : ""}`}
          data-testid="button-save-video"
        >
          <Bookmark className={`w-7 h-7 ${saved ? "fill-current" : ""}`} />
        </Button>
        
        <Button variant="ghost" size="icon" className="text-white" data-testid="button-share-video">
          <Share2 className="w-7 h-7" />
        </Button>
      </div>
      
      <div className="absolute bottom-3 left-3 right-16 space-y-2">
        <Link href={`/profile/${user}`}>
          <div className="font-bold text-white drop-shadow-lg cursor-pointer hover:text-primary transition-colors" data-testid="text-video-user">
            @{user}
          </div>
        </Link>
        {caption && (
          <div className="text-sm text-white/90 drop-shadow-lg line-clamp-2" data-testid="text-video-caption">
            {caption}
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMute}
        className="absolute top-3 right-3 text-white bg-black/30 backdrop-blur-sm"
        data-testid="button-mute-video"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
    </Card>
  );
}
