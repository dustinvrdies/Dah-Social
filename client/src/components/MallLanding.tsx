import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ListingCategory } from "@/lib/postTypes";
import { Store, ShoppingBag, Cpu, ArrowLeftRight } from "lucide-react";

interface CategoryInfo {
  id: ListingCategory;
  title: string;
  subtitle: string;
  icon: typeof Store;
}

const categories: CategoryInfo[] = [
  { id: "flea-market", title: "Flea Market", subtitle: "Local exchange and used goods", icon: Store },
  { id: "thrift-shop", title: "Thrift Shop", subtitle: "Secondhand finds", icon: ShoppingBag },
  { id: "electronics", title: "Electronics", subtitle: "Devices, parts, gear", icon: Cpu },
  { id: "exchange", title: "Exchange", subtitle: "Trade requests and swaps", icon: ArrowLeftRight },
];

interface MallLandingProps {
  selectedCategory: ListingCategory | null;
  onSelectCategory: (category: ListingCategory | null) => void;
}

export function MallLanding({ selectedCategory, onSelectCategory }: MallLandingProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">DAH Mall</h1>
          <p className="text-muted-foreground text-sm">
            Social marketplace. Click a store to browse listings.
          </p>
        </div>
        {selectedCategory && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectCategory(null)}
            data-testid="button-show-all"
          >
            Show All
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
              className={`p-4 cursor-pointer transition-colors ${
                isActive
                  ? "bg-primary/10 border-primary"
                  : "hover-elevate"
              }`}
              data-testid={`card-category-${c.id}`}
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon className="w-5 h-5 text-primary" />
                <span className="font-semibold">{c.title}</span>
              </div>
              <div className="text-xs text-muted-foreground">{c.subtitle}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
