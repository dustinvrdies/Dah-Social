import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdPost } from "@/lib/postTypes";
import { recordImpression, recordClick } from "@/lib/ads";
import { useAuth } from "@/components/AuthProvider";
import { Heart, MessageCircle, Send, Bookmark, Volume2, VolumeX, MoreHorizontal, Megaphone } from "lucide-react";

interface AdCardProps {
  ad: AdPost;
}

export function AdCard({ ad }: AdCardProps) {
  const { session } = useAuth();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [muted, setMuted] = useState(true);
  const [impressionRecorded, setImpressionRecorded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (impressionRecorded) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && session) {
          recordImpression(ad.id, session.username);
          setImpressionRecorded(true);
        }
      },
      { threshold: 0.5 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [ad.id, session, impressionRecorded]);

  const handleCtaClick = () => {
    if (session) {
      recordClick(ad.id, session.username);
    }
  };

  const isVideo = !!ad.videoSrc;

  return (
    <Card ref={cardRef} className="overflow-visible" data-testid={`card-ad-${ad.id}`}>
      <div className="p-4 flex items-center gap-3">
        <Avatar className="w-10 h-10 ring-2 ring-gradient-dah ring-offset-2 ring-offset-background">
          <AvatarFallback className="bg-dah-gradient-strong text-white font-semibold">
            {ad.advertiser.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm truncate">{ad.advertiser}</span>
            <Badge variant="secondary" className="text-xs bg-muted/50">
              <Megaphone className="w-3 h-3 mr-1" />
              Sponsored
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{ad.headline}</p>
        </div>
        <Button variant="ghost" size="icon" data-testid="button-ad-menu">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative">
        {isVideo ? (
          <div className="relative aspect-[4/5] bg-black">
            <video
              ref={videoRef}
              src={ad.videoSrc}
              className="w-full h-full object-cover"
              loop
              muted={muted}
              autoPlay
              playsInline
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3 bg-black/50 text-white"
              onClick={() => setMuted(!muted)}
              data-testid="button-ad-mute"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>
          </div>
        ) : ad.media ? (
          <div className="aspect-[4/5] bg-muted">
            <img
              src={ad.media}
              alt={ad.headline}
              className="w-full h-full object-cover"
            />
          </div>
        ) : null}
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setLiked(!liked)}
              className={liked ? "text-pink-500" : ""}
              data-testid="button-ad-like"
            >
              <Heart className={`w-6 h-6 ${liked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-ad-comment">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon" data-testid="button-ad-share">
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSaved(!saved)}
            className={saved ? "text-primary" : ""}
            data-testid="button-ad-save"
          >
            <Bookmark className={`w-6 h-6 ${saved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <p className="text-sm">
          <span className="font-semibold">{ad.advertiser}</span>{" "}
          <span className="text-muted-foreground">{ad.caption}</span>
        </p>

        <Link href={ad.ctaUrl} onClick={handleCtaClick}>
          <Button className="w-full bg-dah-gradient-strong" data-testid="button-ad-cta">
            {ad.cta}
          </Button>
        </Link>
      </div>
    </Card>
  );
}
