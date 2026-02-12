import { useState, useRef, useEffect } from "react";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { globalSearch, SearchResult } from "@/lib/search";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, User, FileText, ShoppingBag, Users, Hash } from "lucide-react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

const typeIcons: Record<string, typeof User> = {
  user: User,
  post: FileText,
  listing: ShoppingBag,
  group: Users,
  avenue: Hash,
};

export function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [, navigate] = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    onSearch?.(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      if (value.trim().length >= 2) {
        const r = globalSearch(value);
        setResults(r.slice(0, 8));
        setOpen(true);
      } else {
        setResults([]);
        setOpen(false);
      }
    }, 200);
  };

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery("");
    navigate(result.link);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && query.trim().length >= 2) {
      setOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
    }
  };

  return (
    <div className="relative w-full max-w-sm" ref={wrapperRef}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        placeholder="Search DAH Social..."
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
        className="pl-9 bg-muted/30 border-border/50 focus-visible:ring-primary/30"
        data-testid="input-search"
      />
      {open && results.length > 0 && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-card border border-border rounded-md shadow-lg z-50 overflow-hidden">
          {results.map((r) => {
            const Icon = typeIcons[r.type] || FileText;
            return (
              <button
                key={`${r.type}-${r.id}`}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover-elevate"
                onClick={() => handleSelect(r)}
                data-testid={`search-result-${r.type}-${r.id}`}
              >
                {r.type === "user" ? (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-muted text-xs">
                      {r.title.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{r.title}</p>
                  <p className="text-xs text-muted-foreground truncate">{r.subtitle}</p>
                </div>
              </button>
            );
          })}
          <button
            className="w-full px-3 py-2 text-sm text-primary text-center hover-elevate border-t border-border"
            onClick={() => {
              setOpen(false);
              navigate(`/search?q=${encodeURIComponent(query.trim())}`);
              setQuery("");
            }}
            data-testid="button-see-all-results"
          >
            See all results
          </button>
        </div>
      )}
    </div>
  );
}
