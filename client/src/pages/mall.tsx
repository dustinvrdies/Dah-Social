import { useState, useMemo } from "react";
import { PageLayout } from "@/components/PageLayout";
import { MallLanding } from "@/components/MallLanding";
import { SellerDashboard } from "@/components/SellerDashboard";
import { PostRenderer } from "@/components/PostRenderer";
import { getListingsByCategory } from "@/lib/feedData";
import { ListingCategory, ListingPost } from "@/lib/postTypes";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal, Grid2X2, List, X } from "lucide-react";

export default function MallPage() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [priceSort, setPriceSort] = useState<"none" | "low" | "high">("none");
  const [conditionFilter, setConditionFilter] = useState<string>("all");

  const allListings = useMemo(() => getListingsByCategory(category), [category]);

  const listings = useMemo(() => {
    let result = allListings;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => {
        if (p.type === "listing") {
          return p.title.toLowerCase().includes(q) || (p.location || "").toLowerCase().includes(q);
        }
        return false;
      });
    }

    if (conditionFilter !== "all") {
      result = result.filter((p) => {
        if (p.type === "listing") return (p as ListingPost).condition === conditionFilter;
        return true;
      });
    }

    if (priceSort !== "none") {
      result = [...result].sort((a, b) => {
        const pa = a.type === "listing" ? (a as ListingPost).price : 0;
        const pb = b.type === "listing" ? (b as ListingPost).price : 0;
        return priceSort === "low" ? pa - pb : pb - pa;
      });
    }

    return result;
  }, [allListings, searchQuery, conditionFilter, priceSort]);

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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/50 border-0"
              data-testid="input-search-mall"
            />
          </div>
          <Button
            variant={showFilters ? "default" : "outline"}
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            data-testid="button-filters"
          >
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

        {showFilters && (
          <div className="flex items-center gap-3 flex-wrap">
            <Select value={priceSort} onValueChange={(v) => setPriceSort(v as "none" | "low" | "high")}>
              <SelectTrigger className="w-[160px]" data-testid="select-price-sort">
                <SelectValue placeholder="Sort by price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No sort</SelectItem>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={conditionFilter} onValueChange={setConditionFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-condition">
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Conditions</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="like-new">Like New</SelectItem>
                <SelectItem value="used">Used</SelectItem>
                <SelectItem value="for-parts">For Parts</SelectItem>
              </SelectContent>
            </Select>
            {(searchQuery || conditionFilter !== "all" || priceSort !== "none") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSearchQuery(""); setConditionFilter("all"); setPriceSort("none"); }}
                data-testid="button-clear-filters"
              >
                <X className="w-3 h-3 mr-1" /> Clear
              </Button>
            )}
          </div>
        )}
        
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

        {searchQuery && (
          <div className="flex items-center gap-2">
            <Badge variant="outline">
              Searching: "{searchQuery}" ({listings.length} results)
            </Badge>
          </div>
        )}
        
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {listings.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              {searchQuery ? `No results for "${searchQuery}"` : "No listings in this category yet. Be the first to sell!"}
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
