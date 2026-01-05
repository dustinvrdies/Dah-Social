import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "./AuthProvider";
import { getReputation, recordVerifiedSale } from "@/lib/reputation";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShoppingBag, MapPin, Star, Heart, MessageCircle, Share2, ShieldCheck } from "lucide-react";

interface ListingCardProps {
  user: string;
  title: string;
  price: number;
  location?: string;
  image?: string;
}

export function ListingCard({ user, title, price, location, image }: ListingCardProps) {
  const { session } = useAuth();
  const [rep, setRep] = useState<{ score: number; verifiedSales: number } | null>(null);
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    setRep(getReputation(user));
  }, [user]);

  const canMarkSold = session?.username === user;

  const markSold = () => {
    if (!session) return;
    const updated = recordVerifiedSale(session.username);
    setRep(updated);
    addCoins(session.username, session.age, "Verified sale", 20);
    pushNotification(session.username, {
      username: session.username,
      type: "sale",
      message: "Verified sale recorded. DAH Coins awarded.",
    });
  };

  return (
    <Card className="overflow-hidden" data-testid={`card-listing-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="relative">
        {image ? (
          <div className="aspect-square bg-muted">
            <img src={image} alt={title} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="aspect-square bg-dah-gradient flex items-center justify-center">
            <ShoppingBag className="w-16 h-16 text-primary/50" />
          </div>
        )}
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setLiked(!liked)}
          className={`absolute top-3 right-3 bg-black/30 backdrop-blur-sm text-white ${liked ? "text-pink-500" : ""}`}
          data-testid="button-like-listing"
        >
          <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
        </Button>
        
        <Badge className="absolute bottom-3 left-3 bg-dah-gradient-strong text-white border-0 text-lg font-bold px-3 py-1" data-testid="text-listing-price">
          ${price}
        </Badge>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="font-semibold text-lg" data-testid="text-listing-title">{title}</div>
        
        <Link href={`/profile/${user}`}>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="ring-gradient-dah p-[2px] rounded-full">
              <Avatar className="w-8 h-8">
                <AvatarImage src={undefined} />
                <AvatarFallback className="bg-card text-xs font-medium">
                  {user.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium group-hover:text-primary transition-colors">@{user}</span>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                {rep && rep.verifiedSales > 0 && (
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-primary" />
                    {rep.verifiedSales} sales
                  </span>
                )}
                {rep && (
                  <span className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500 fill-current" />
                    {rep.score}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Link>
        
        {location && (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground" data-testid="text-listing-location">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
        )}
        
        <div className="flex items-center gap-2 pt-2 border-t border-border/50">
          {canMarkSold ? (
            <Button variant="default" className="flex-1 bg-dah-gradient-strong" onClick={markSold} data-testid="button-mark-sold">
              Mark as Sold
            </Button>
          ) : (
            <Button variant="default" className="flex-1 bg-dah-gradient-strong" data-testid="button-buy-listing">
              Buy Now
            </Button>
          )}
          <Button variant="outline" size="icon" data-testid="button-message-seller">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="outline" size="icon" data-testid="button-share-listing">
            <Share2 className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
