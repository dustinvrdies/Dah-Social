import { useState } from "react";
import { MainNav } from "@/components/MainNav";
import { MallLanding } from "@/components/MallLanding";
import { PostRenderer } from "@/components/PostRenderer";
import { getListingsByCategory } from "@/lib/feedData";
import { ListingCategory } from "@/lib/postTypes";

export default function MallPage() {
  const [category, setCategory] = useState<ListingCategory | null>(null);
  const listings = getListingsByCategory(category);

  const categoryTitles: Record<ListingCategory, string> = {
    "flea-market": "Flea Market",
    "thrift-shop": "Thrift Shop",
    "electronics": "Electronics",
    "exchange": "Exchange",
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <MallLanding selectedCategory={category} onSelectCategory={setCategory} />
        
        {category && (
          <h2 className="text-lg font-semibold" data-testid="text-category-title">
            {categoryTitles[category]} Listings ({listings.length})
          </h2>
        )}
        
        <div className="space-y-4">
          {listings.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No listings in this category yet.
            </p>
          ) : (
            listings.map((p) => (
              <PostRenderer key={p.id} post={p} />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
