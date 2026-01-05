import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ListingCategory, Store as StoreType } from "@/lib/postTypes";
import { getFeaturedStores } from "@/lib/feedData";
import { Store, ShoppingBag, Cpu, ArrowLeftRight, Sparkles, TrendingUp, Tag, Zap, Star, ChevronRight } from "lucide-react";

interface CategoryInfo {
  id: ListingCategory;
  title: string;
  subtitle: string;
  icon: typeof Store;
  gradient: string;
}

const categories: CategoryInfo[] = [
  { id: "flea-market", title: "Flea Market", subtitle: "Local finds", icon: Store, gradient: "from-orange-500 to-rose-500" },
  { id: "thrift-shop", title: "Thrift", subtitle: "Secondhand", icon: ShoppingBag, gradient: "from-purple-500 to-pink-500" },
  { id: "electronics", title: "Tech", subtitle: "Devices", icon: Cpu, gradient: "from-blue-500 to-cyan-500" },
  { id: "exchange", title: "Trade", subtitle: "Swaps", icon: ArrowLeftRight, gradient: "from-emerald-500 to-teal-500" },
];

interface MallLandingProps {
  selectedCategory: ListingCategory | null;
  onSelectCategory: (category: ListingCategory | null) => void;
}

export function MallLanding({ selectedCategory, onSelectCategory }: MallLandingProps) {
  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-xl bg-dah-gradient-strong p-6 text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-6 h-6" />
            <h1 className="text-2xl font-bold">DAH Mall</h1>
          </div>
          <p className="text-white/80 text-sm max-w-md">
            Discover unique items from the community. Shop, sell, and connect.
          </p>
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <TrendingUp className="w-3 h-3 mr-1" />
              Trending
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Tag className="w-3 h-3 mr-1" />
              Deals
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-0">
              <Zap className="w-3 h-3 mr-1" />
              Flash Sale
            </Badge>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-1/2 w-48 h-48 bg-white/5 rounded-full translate-y-1/2" />
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-semibold">Categories</h2>
        {selectedCategory && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectCategory(null)}
            data-testid="button-show-all"
          >
            Clear Filter
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((c) => {
          const isActive = selectedCategory === c.id;
          const Icon = c.icon;
          return (
            <Card
              key={c.id}
              onClick={() => onSelectCategory(c.id)}
              className={`p-4 cursor-pointer transition-all ${
                isActive
                  ? "ring-2 ring-primary bg-primary/10"
                  : "hover-elevate"
              }`}
              data-testid={`card-category-${c.id}`}
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${c.gradient} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-sm">{c.title}</div>
              <div className="text-xs text-muted-foreground">{c.subtitle}</div>
            </Card>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="font-semibold">Featured Stores</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {getFeaturedStores().map((store) => {
          const gradient = categories.find(c => c.id === store.category)?.gradient || "from-gray-500 to-gray-600";
          return (
            <Link key={store.id} href={`/mall/store/${store.id}`}>
              <Card
                className="p-4 cursor-pointer hover-elevate transition-all"
                data-testid={`card-store-${store.id}`}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={store.avatar} />
                    <AvatarFallback className={`bg-gradient-to-br ${gradient} text-white font-bold`}>
                      {store.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold truncate">{store.name}</span>
                      <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {store.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 flex-wrap">
                      <div className="flex items-center gap-1 text-xs">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span>{store.rating}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{store.sales} sales</span>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
