import { Link } from "wouter";
import { Plus, Play, ShoppingBag, Sparkles, Video, Radio } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "./AuthProvider";

interface Imagination {
  id: string;
  username: string;
  avatar?: string;
  hasNew: boolean;
  type: "imagination" | "live" | "video" | "product";
  label?: string;
}

const mockImaginations: Imagination[] = [
  { id: "1", username: "trending", hasNew: true, type: "video", label: "For You" },
  { id: "2", username: "maya_designs", hasNew: true, type: "imagination" },
  { id: "3", username: "tech_hub", hasNew: true, type: "live", label: "LIVE" },
  { id: "4", username: "streetwear", hasNew: false, type: "product" },
  { id: "5", username: "gaming_pro", hasNew: true, type: "video" },
  { id: "6", username: "music_vibes", hasNew: true, type: "imagination" },
  { id: "7", username: "fitness_coach", hasNew: false, type: "imagination" },
  { id: "8", username: "dah_mall", hasNew: true, type: "product", label: "Shop" },
  { id: "9", username: "art_collective", hasNew: true, type: "imagination" },
  { id: "10", username: "crypto_news", hasNew: false, type: "video" },
];

export function ImaginationBubbles() {
  const { session } = useAuth();

  const getTypeIcon = (type: Imagination["type"]) => {
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

  const getTypeColor = (type: Imagination["type"]) => {
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
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex items-start gap-4 px-4 py-4 min-w-max">
        {session && (
          <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-card border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover-elevate cursor-pointer">
                <Plus className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Plus className="w-3 h-3 text-primary-foreground" />
              </div>
            </div>
            <span className="text-xs text-muted-foreground">Add Imagination</span>
          </div>
        )}
        
        {mockImaginations.map((item) => (
          <Link key={item.id} href={`/profile/${item.username}`}>
            <div 
              className="flex flex-col items-center gap-1.5 flex-shrink-0 cursor-pointer group"
              data-testid={`imagination-bubble-${item.username}`}
            >
              <div className={`p-[3px] rounded-full ${item.hasNew ? 'ring-gradient-dah' : 'bg-muted'}`}>
                <div className="bg-background rounded-full p-[2px]">
                  <Avatar className="w-14 h-14 group-hover:scale-105 transition-transform">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback className="bg-card text-foreground text-sm font-medium">
                      {item.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
              
              {item.type !== "imagination" && (
                <div className={`absolute mt-11 ml-10 flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white ${getTypeColor(item.type)}`}>
                  {getTypeIcon(item.type)}
                  {item.label && <span>{item.label}</span>}
                </div>
              )}
              
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors truncate max-w-[64px]">
                {item.label || item.username.split('_')[0]}
              </span>
            </div>
          </Link>
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
  );
}
