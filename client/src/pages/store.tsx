import { useRoute, Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { PostRenderer } from "@/components/PostRenderer";
import { getStoreById, getListingsByStore } from "@/lib/feedData";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, Star, Package, MessageCircle, Heart, ShieldCheck, Mail } from "lucide-react";
import { TrustScore } from "@/components/TrustScore";

export default function StorePage() {
  const [, params] = useRoute("/mall/store/:storeId");
  const storeId = params?.storeId;
  
  const store = storeId ? getStoreById(storeId) : undefined;
  const listings = store ? getListingsByStore(store.owner) : [];

  if (!store) {
    return (
      <PageLayout>
        <div className="max-w-4xl mx-auto p-6 text-center">
          <h1 className="text-2xl font-bold mb-4">Store not found</h1>
          <Link href="/mall">
            <Button data-testid="button-back-mall">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mall
            </Button>
          </Link>
        </div>
      </PageLayout>
    );
  }

  const categoryColors: Record<string, string> = {
    "flea-market": "from-orange-500 to-rose-500",
    "thrift-shop": "from-purple-500 to-pink-500",
    "electronics": "from-blue-500 to-cyan-500",
    "exchange": "from-emerald-500 to-teal-500",
  };

  return (
    <PageLayout>
      <div className="relative h-32 md:h-40 bg-gradient-to-br from-card to-muted overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${categoryColors[store.category]} opacity-60`} />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="relative -mt-16 mb-6">
          <div className="flex items-start gap-8 flex-wrap md:flex-nowrap">
            <div className="relative shrink-0">
              <div className="ring-gradient-dah p-[3px] rounded-full">
                <Avatar className="w-24 h-24 md:w-32 md:h-32 border-4 border-background">
                  <AvatarImage src={store.avatar} />
                  <AvatarFallback className="bg-card text-2xl font-bold">
                    {store.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
            
            <div className="flex-1 space-y-4 pt-16 md:pt-20">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold" data-testid="text-store-name">
                    {store.name}
                  </h1>
                  <p className="text-muted-foreground text-sm">@{store.owner}</p>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" data-testid="button-follow-store">
                    <Heart className="w-4 h-4 mr-1" />
                    Follow
                  </Button>
                  <Button size="sm" className="bg-dah-gradient-strong" data-testid="button-message-store">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    Message
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
                <Card className="p-3 bg-muted/20 border-border/30">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <TrustScore score={92} />
                    </div>
                    <div className="h-8 w-px bg-border/50" />
                    <div className="text-center px-2">
                      <div className="font-bold flex items-center justify-center gap-1">
                        <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                        {store.rating}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Rating</div>
                    </div>
                  </div>
                </Card>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 px-4 py-2 bg-muted/10 rounded-lg border border-border/30">
                    <div className="text-sm font-semibold">{store.sales}</div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Total Sales</div>
                  </div>
                  <Badge variant="secondary" className="h-fit">
                    {store.category.replace("-", " ")}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-muted-foreground mb-8 max-w-3xl" data-testid="text-store-description">
          {store.description}
        </p>

        <div className="flex items-center justify-between gap-2 mb-4">
          <h2 className="text-lg font-semibold">Products</h2>
          <span className="text-sm text-muted-foreground">{listings.length} items</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
          {listings.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              This store hasn't listed any products yet.
            </div>
          ) : (
            listings.map((p) => (
              <PostRenderer key={p.id} post={p} />
            ))
          )}
        </div>

        <div className="pb-8">
          <Link href="/mall">
            <Button variant="outline" data-testid="button-back-mall">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Mall
            </Button>
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}
