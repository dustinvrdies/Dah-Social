import { useState } from "react";
import { Post } from "@/lib/postTypes";
import { Button } from "@/components/ui/button";
import { LayoutGrid, MessageSquare, ShoppingBag } from "lucide-react";

interface FeedFilterProps {
  onFilterChange: (type: string) => void;
  activeFilter: string;
}

export default function FeedFilter({ onFilterChange, activeFilter }: FeedFilterProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-muted/30 rounded-lg w-fit border border-border/50">
      <Button
        variant={activeFilter === "all" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("all")}
        className="h-8 gap-1.5"
        data-testid="filter-all"
      >
        <LayoutGrid className="w-3.5 h-3.5" />
        All
      </Button>
      <Button
        variant={activeFilter === "text" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("text")}
        className="h-8 gap-1.5"
        data-testid="filter-social"
      >
        <MessageSquare className="w-3.5 h-3.5" />
        Social
      </Button>
      <Button
        variant={activeFilter === "listing" ? "secondary" : "ghost"}
        size="sm"
        onClick={() => onFilterChange("listing")}
        className="h-8 gap-1.5"
        data-testid="filter-market"
      >
        <ShoppingBag className="w-3.5 h-3.5" />
        Market
      </Button>
    </div>
  );
}
