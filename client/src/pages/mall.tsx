import { useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { MallLanding } from "@/components/MallLanding";
import { SellerDashboard } from "@/components/SellerDashboard";
import { PostRenderer } from "@/components/PostRenderer";
import { getListingsByCategory } from "@/lib/feedData";
import { ListingCategory } from "@/lib/postTypes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal, Grid2X2, List } from "lucide-react";

export default function MallPage() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const listings = getListingsByCategory(category);

  const categoryTitles: Record<ListingCategory, string> = {
    "flea-market": "Flea Market",
    "thrift-shop": "Thrift Shop",
    "electronics": "Electronics",
    "exchange": "Exchange",
  };

  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
        <SellerDashboard />
        <MallLanding selectedCategory={category} onSelectCategory={setCategory} />
        
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-9 bg-muted/50 border-0"
              data-testid="input-search-mall"
            />
          </div>
          <Button variant="outline" size="icon" data-testid="button-filters">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>
          <div className="flex items-center gap-1 border border-border rounded-md p-1">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("grid")}
              data-testid="button-view-grid"
            >
              <Grid2X2 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode("list")}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {category && (
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold" data-testid="text-category-title">
              {categoryTitles[category]}
            </h2>
            <span className="text-sm text-muted-foreground">
              {listings.length} items
            </span>
          </div>
        )}
        
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {listings.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No listings in this category yet. Be the first to sell!
            </div>
          ) : (
            listings.map((p) => (
              <PostRenderer key={p.id} post={p} />
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
