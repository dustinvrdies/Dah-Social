import { useState } from "react";
import { Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { getLiveStreams, getTopLiveStreams, formatViewerCount, formatStreamDuration, gifts, sendGift, LiveStream } from "@/lib/live";
import { getWallet } from "@/lib/dahCoins";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Radio,
  Users,
  Coins,
  Heart,
  Star,
  Flame,
  Gem,
  Crown,
  Rocket,
  Sparkles,
  Flower2,
  MessageCircle,
  Share2,
  Gift,
  TrendingUp,
} from "lucide-react";

const iconMap: Record<string, any> = {
  heart: Heart,
  star: Star,
  flame: Flame,
  gem: Gem,
  crown: Crown,
  rocket: Rocket,
  sparkles: Sparkles,
  "flower-2": Flower2,
};

function LiveCard({ stream, onClick }: { stream: LiveStream; onClick: () => void }) {
  return (
    <Card
      className="overflow-hidden cursor-pointer hover-elevate"
      onClick={onClick}
      data-testid={`card-live-${stream.id}`}
    >
      <div className="relative aspect-video bg-muted">
        {stream.thumbnailUrl ? (
          <img src={stream.thumbnailUrl} alt={stream.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-dah-gradient flex items-center justify-center">
            <Radio className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-2 left-2 bg-red-500 text-white border-0 gap-1">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
          LIVE
        </Badge>
        <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white">
          <Users className="w-3 h-3" />
          {formatViewerCount(stream.viewerCount)}
        </div>
        <div className="absolute bottom-2 left-2 right-2">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8 ring-2 ring-red-500">
              <AvatarFallback className="bg-card text-xs">{stream.hostUsername.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">{stream.hostUsername}</p>
              <p className="text-white/70 text-xs">{formatStreamDuration(stream.startedAt)}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3">
        <p className="font-medium text-sm line-clamp-2">{stream.title}</p>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Gift className="w-3 h-3" />
            {stream.giftCount}
          </span>
          <span className="flex items-center gap-1">
            <Coins className="w-3 h-3" />
            {stream.totalCoins}
          </span>
          <Badge variant="secondary" className="text-xs">{stream.category}</Badge>
        </div>
      </div>
    </Card>
  );
}

function LiveViewer({ stream, onClose }: { stream: LiveStream; onClose: () => void }) {
  const { session } = useAuth();
  const { toast } = useToast();
  const [selectedGift, setSelectedGift] = useState(gifts[0]);
  const [quantity, setQuantity] = useState(1);

  const wallet = session ? getWallet(session.username) : null;

  const handleSendGift = () => {
    if (!session) {
      toast({ title: "Please log in to send gifts", variant: "destructive" });
      return;
    }

    const result = sendGift(stream.id, session.username, session.age, selectedGift.id, quantity);
    if (result.success) {
      toast({ title: result.message });
      setQuantity(1);
    } else {
      toast({ title: result.message, variant: "destructive" });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="relative flex-1 bg-black">
            {stream.thumbnailUrl ? (
              <img src={stream.thumbnailUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-dah-gradient" />
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <Radio className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                <p className="text-lg font-medium">Simulated Live Stream</p>
                <p className="text-sm text-white/70">Full streaming requires WebRTC integration</p>
              </div>
            </div>

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10 ring-2 ring-red-500">
                  <AvatarFallback>{stream.hostUsername.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-white font-medium">{stream.hostUsername}</p>
                  <Badge className="bg-red-500 text-white border-0 text-xs">LIVE</Badge>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-1 text-white text-sm">
                  <Users className="w-4 h-4" />
                  {formatViewerCount(stream.viewerCount)}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card p-4 border-t">
            <div className="flex items-center gap-4 mb-4">
              <p className="font-medium flex-1">{stream.title}</p>
              <Button variant="outline" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {gifts.map((gift) => {
                  const Icon = iconMap[gift.icon] || Heart;
                  return (
                    <button
                      key={gift.id}
                      onClick={() => setSelectedGift(gift)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg min-w-[60px] ${
                        selectedGift.id === gift.id ? "bg-primary/20 ring-2 ring-primary" : "hover:bg-muted"
                      }`}
                      data-testid={`button-gift-${gift.id}`}
                    >
                      <Icon className="w-6 h-6 text-primary" />
                      <span className="text-xs flex items-center gap-0.5">
                        <Coins className="w-3 h-3" />
                        {gift.coinCost}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 border rounded-lg">
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                    -
                  </Button>
                  <span className="w-8 text-center text-sm">{quantity}</span>
                  <Button variant="ghost" size="sm" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>
                <Button onClick={handleSendGift} className="bg-dah-gradient-strong gap-2" data-testid="button-send-gift">
                  <Gift className="w-4 h-4" />
                  Send ({selectedGift.coinCost * quantity})
                </Button>
              </div>
            </div>

            {wallet && (
              <p className="text-xs text-muted-foreground mt-2">
                Your balance: {wallet.available} DAH Coins
              </p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function LivePage() {
  const [streams] = useState(() => getLiveStreams());
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const topStreams = getTopLiveStreams(5);
  const categories = ["all", ...Array.from(new Set(streams.map((s) => s.category)))];

  const filteredStreams = activeCategory === "all" ? streams : streams.filter((s) => s.category === activeCategory);

  return (
    <PageLayout>
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Radio className="w-6 h-6 text-red-500" />
              DAH Live
            </h1>
            <p className="text-muted-foreground">Watch live streams and support creators with gifts</p>
          </div>
          <Button className="bg-dah-gradient-strong gap-2" data-testid="button-go-live">
            <Radio className="w-4 h-4" />
            Go Live
          </Button>
        </div>

        {topStreams.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-semibold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Top Live Now
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
              {topStreams.map((stream) => (
                <LiveCard key={stream.id} stream={stream} onClick={() => setSelectedStream(stream)} />
              ))}
            </div>
          </div>
        )}

        <Tabs value={activeCategory} onValueChange={setActiveCategory}>
          <TabsList className="flex-wrap h-auto gap-1">
            {categories.map((cat) => (
              <TabsTrigger key={cat} value={cat} className="capitalize">
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredStreams.map((stream) => (
            <LiveCard key={stream.id} stream={stream} onClick={() => setSelectedStream(stream)} />
          ))}
        </div>

        {filteredStreams.length === 0 && (
          <div className="text-center py-12">
            <Radio className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No live streams in this category</p>
          </div>
        )}

        {selectedStream && <LiveViewer stream={selectedStream} onClose={() => setSelectedStream(null)} />}
      </div>
    </PageLayout>
  );
}
