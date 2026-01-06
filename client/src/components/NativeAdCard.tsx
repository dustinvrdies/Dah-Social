import { useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { NativeAd, recordImpression, recordClick, recordViewTime } from "@/lib/ads";
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal, BadgeCheck, MapPin, Tag, ExternalLink } from "lucide-react";

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
    if (!cardRef.current || hasRecordedImpression) return;

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
      <div ref={cardRef} className="relative aspect-[9/16] bg-black rounded-lg overflow-hidden group">
        <video
          src={ad.videoSrc}
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />
        
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className="bg-primary/90 text-primary-foreground text-[10px]">
            Sponsored
          </Badge>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-3">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10 ring-2 ring-primary">
              <AvatarFallback className="bg-primary text-primary-foreground">
                {ad.advertiser.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <span className="font-semibold text-white">@{ad.advertiserHandle}</span>
                {ad.advertiserVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
              </div>
              <span className="text-xs text-white/70">{ad.advertiser}</span>
            </div>
          </div>
          
          <p className="text-white text-sm">{ad.caption}</p>
          
          <Link href={ad.ctaUrl}>
            <Button 
              className="w-full bg-dah-gradient-strong"
              onClick={handleCTAClick}
              data-testid={`button-ad-cta-${ad.id}`}
            >
              {ad.cta}
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        <div className="absolute right-3 bottom-32 flex flex-col gap-4">
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-full bg-black/30 backdrop-blur-sm ${isLiked ? 'text-red-500' : 'text-white'}`}
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full bg-black/30 backdrop-blur-sm text-white">
            <MessageCircle className="w-6 h-6" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full bg-black/30 backdrop-blur-sm text-white">
            <Share2 className="w-6 h-6" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={`rounded-full bg-black/30 backdrop-blur-sm ${isSaved ? 'text-primary' : 'text-white'}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
      </div>
    );
  }

  if (ad.format === "listing" && ad.listingData) {
    return (
      <Card ref={cardRef} className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
        <div className="flex items-center gap-3 p-3 border-b border-border/30">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-primary/20 text-primary text-xs">
              {ad.advertiser.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-medium text-sm truncate">@{ad.advertiserHandle}</span>
              {ad.advertiserVerified && <BadgeCheck className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
            </div>
            <span className="text-xs text-muted-foreground">{ad.headline}</span>
          </div>
          <Badge variant="secondary" className="text-[10px] flex-shrink-0">
            Sponsored
          </Badge>
        </div>

        {ad.media && (
          <div className="aspect-square relative">
            <img 
              src={ad.media} 
              alt={ad.mediaAlt || ad.listingData.title}
              className="w-full h-full object-cover"
            />
            {ad.listingData.originalPrice && (
              <Badge className="absolute top-3 left-3 bg-red-500 text-white">
                {Math.round((1 - ad.listingData.price / ad.listingData.originalPrice) * 100)}% OFF
              </Badge>
            )}
          </div>
        )}

        <div className="p-4 space-y-3">
          <div>
            <h3 className="font-semibold">{ad.listingData.title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xl font-bold text-primary">${ad.listingData.price}</span>
              {ad.listingData.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${ad.listingData.originalPrice}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
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

          <Link href={ad.ctaUrl}>
            <Button 
              className="w-full bg-dah-gradient-strong"
              onClick={handleCTAClick}
              data-testid={`button-ad-cta-${ad.id}`}
            >
              {ad.cta}
            </Button>
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card ref={cardRef} className="overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 ring-2 ring-primary/30">
            <AvatarFallback className="bg-primary/20 text-primary">
              {ad.advertiser.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-sm">@{ad.advertiserHandle}</span>
              {ad.advertiserVerified && <BadgeCheck className="w-4 h-4 text-primary" />}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>{ad.advertiser}</span>
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                Sponsored
              </Badge>
            </div>
          </div>
        </div>
        <Button size="icon" variant="ghost">
          <MoreHorizontal className="w-5 h-5" />
        </Button>
      </div>

      {ad.media && (
        <div className="aspect-video relative">
          <img 
            src={ad.media} 
            alt={ad.mediaAlt || ad.headline}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {ad.videoSrc && (
        <div className="aspect-video relative">
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
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className={isLiked ? 'text-red-500' : ''}
              onClick={() => setIsLiked(!isLiked)}
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            </Button>
            <Button size="icon" variant="ghost">
              <MessageCircle className="w-5 h-5" />
            </Button>
            <Button size="icon" variant="ghost">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className={isSaved ? 'text-primary' : ''}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        <div>
          <p className="font-semibold">{ad.headline}</p>
          <p className="text-sm text-muted-foreground mt-1">{ad.caption}</p>
        </div>

        <Link href={ad.ctaUrl}>
          <Button 
            className="w-full bg-dah-gradient-strong"
            onClick={handleCTAClick}
            data-testid={`button-ad-cta-${ad.id}`}
          >
            {ad.cta}
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}
