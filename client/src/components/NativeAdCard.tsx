import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { NativeAd, recordImpression, recordClick, recordViewTime } from "@/lib/ads";
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, BadgeCheck, MapPin, Tag } from "lucide-react";

interface NativeAdCardProps {
  ad: NativeAd;
  variant?: "feed" | "video" | "listing";
}

export function NativeAdCard({ ad, variant = "feed" }: NativeAdCardProps) {
  const { session } = useAuth();
  const [hasRecordedImpression, setHasRecordedImpression] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const startTimeRef = useRef<number>(0);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !cardRef.current || hasRecordedImpression) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasRecordedImpression) {
            startTimeRef.current = Date.now();
            recordImpression(ad.id, session?.username || "anonymous");
            setHasRecordedImpression(true);
          } else if (!entry.isIntersecting && startTimeRef.current > 0) {
            const viewTime = Date.now() - startTimeRef.current;
            recordViewTime(ad.id, session?.username || "anonymous", viewTime);
            startTimeRef.current = 0;
          }
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, [ad.id, session?.username, hasRecordedImpression]);

  const handleCTAClick = () => {
    recordClick(ad.id, session?.username || "anonymous");
  };

  if (variant === "video" && ad.videoSrc) {
    return (
      <div ref={cardRef} className="relative w-full h-full bg-black">
        <video
          src={ad.videoSrc}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
        
        <div className="absolute bottom-0 left-0 right-16 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-card text-sm font-medium">
                {ad.advertiser.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white text-sm">@{ad.advertiserHandle}</span>
                {ad.advertiserVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
                <span className="text-white/50 text-xs">· Sponsored</span>
              </div>
            </div>
          </div>
          
          <p className="text-white text-sm leading-relaxed">{ad.caption}</p>
          
          <Button 
            size="sm"
            variant="secondary"
            className="bg-white/20 backdrop-blur-sm text-white border-white/30"
            data-testid={`button-ad-cta-${ad.id}`}
            onClick={() => {
              handleCTAClick();
              window.open(ad.ctaUrl, "_blank", "noopener,noreferrer");
            }}
          >
            {ad.cta}
          </Button>
        </div>

        <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
          <button
            className="flex flex-col items-center gap-1"
            onClick={() => setIsLiked(!isLiked)}
          >
            <div className={`p-2 rounded-full bg-black/30 backdrop-blur-sm ${isLiked ? 'text-pink-500' : 'text-white'}`}>
              <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
            </div>
            <span className="text-white text-xs">2.4K</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
              <MessageCircle className="w-6 h-6" />
            </div>
            <span className="text-white text-xs">89</span>
          </button>
          <button className="flex flex-col items-center gap-1">
            <div className="p-2 rounded-full bg-black/30 backdrop-blur-sm text-white">
              <Send className="w-6 h-6" />
            </div>
            <span className="text-white text-xs">Share</span>
          </button>
          <button
            className="flex flex-col items-center gap-1"
            onClick={() => setIsSaved(!isSaved)}
          >
            <div className={`p-2 rounded-full bg-black/30 backdrop-blur-sm ${isSaved ? 'text-primary' : 'text-white'}`}>
              <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
            </div>
          </button>
        </div>
      </div>
    );
  }

  if (ad.format === "listing" && ad.listingData) {
    return (
      <Card ref={cardRef} className="overflow-hidden" data-testid={`card-ad-${ad.id}`}>
        <div className="p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="ring-gradient-dah p-[2px] rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-card text-sm font-medium">
                  {ad.advertiser.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-sm">@{ad.advertiserHandle}</span>
                {ad.advertiserVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
              </div>
              <p className="text-xs text-muted-foreground">Sponsored</p>
            </div>
          </div>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>

        {ad.media && (
          <div className="aspect-square bg-muted relative">
            <img 
              src={ad.media} 
              alt={ad.mediaAlt || ad.listingData.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={isLiked ? "text-pink-500" : ""}
              >
                <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="w-6 h-6" />
              </Button>
              <Button variant="ghost" size="icon">
                <Send className="w-6 h-6" />
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsSaved(!isSaved)}
              className={isSaved ? "text-primary" : ""}
            >
              <Bookmark className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold text-primary">${ad.listingData.price}</span>
              {ad.listingData.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${ad.listingData.originalPrice}
                </span>
              )}
            </div>
            <p className="text-sm">
              <span className="font-semibold">{ad.listingData.title}</span>
            </p>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {ad.listingData.location}
              </div>
              <div className="flex items-center gap-1">
                <Tag className="w-3 h-3" />
                {ad.listingData.category}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{ad.caption}</p>
          </div>

          <Button 
            className="w-full"
            variant="secondary"
            data-testid={`button-ad-cta-${ad.id}`}
            onClick={() => {
              handleCTAClick();
              window.open(ad.ctaUrl, "_blank", "noopener,noreferrer");
            }}
          >
            {ad.cta}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="overflow-hidden" data-testid={`card-ad-${ad.id}`}>
      <div className="p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="ring-gradient-dah p-[2px] rounded-full">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-card text-sm font-medium">
                {ad.advertiser.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">@{ad.advertiserHandle}</span>
              {ad.advertiserVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Sponsored</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {ad.media && (
        <div className="aspect-square bg-muted">
          <img 
            src={ad.media} 
            alt={ad.mediaAlt || ad.headline}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {ad.videoSrc && !ad.media && (
        <div className="aspect-video bg-muted">
          <video
            src={ad.videoSrc}
            className="w-full h-full object-cover"
            controls
            muted
            playsInline
          />
        </div>
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsLiked(!isLiked)}
              className={isLiked ? "text-pink-500" : ""}
            >
              <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-6 h-6" />
            </Button>
            <Button variant="ghost" size="icon">
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setIsSaved(!isSaved)}
            className={isSaved ? "text-primary" : ""}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="space-y-1">
          <p className="font-semibold text-sm">1,234 likes</p>
          <p className="text-sm">
            <span className="font-semibold">{ad.advertiserHandle}</span>
            {" "}
            <span>{ad.headline}</span>
            {ad.caption && ad.caption !== ad.headline && (
              <span className="text-muted-foreground"> {ad.caption}</span>
            )}
          </p>
        </div>

        <Button 
          className="w-full"
          variant="secondary"
          data-testid={`button-ad-cta-${ad.id}`}
          onClick={() => {
            handleCTAClick();
            window.open(ad.ctaUrl, "_blank", "noopener,noreferrer");
          }}
        >
          {ad.cta}
        </Button>
      </div>
    </Card>
  );
}
