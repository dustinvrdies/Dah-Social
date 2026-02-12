import { useState, useMemo } from "react";
import { Link, useSearch } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { globalSearch, SearchResult } from "@/lib/search";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Search, User, FileText, ShoppingBag, Users, Hash } from "lucide-react";

export default function SearchPage() {
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const initialQuery = params.get("q") || "";
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState("all");

  const results = useMemo(() => globalSearch(query), [query]);

  const filtered = useMemo(() => {
    if (tab === "all") return results;
    return results.filter((r) => r.type === tab);
  }, [results, tab]);

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: results.length };
    results.forEach((r) => {
      c[r.type] = (c[r.type] || 0) + 1;
    });
    return c;
  }, [results]);

  const typeIcons: Record<string, typeof User> = {
    user: User,
    post: FileText,
    listing: ShoppingBag,
    group: Users,
    avenue: Hash,
  };

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input
            placeholder="Search everything on DAH..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-11 text-lg h-12 bg-muted/30 border-border/50"
            autoFocus
            data-testid="input-search-page"
          />
        </div>

        {query.trim().length >= 2 && (
          <>
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="w-full justify-start overflow-x-auto">
                <TabsTrigger value="all">All ({counts.all || 0})</TabsTrigger>
                <TabsTrigger value="user">People ({counts.user || 0})</TabsTrigger>
                <TabsTrigger value="post">Posts ({counts.post || 0})</TabsTrigger>
                <TabsTrigger value="listing">Listings ({counts.listing || 0})</TabsTrigger>
                <TabsTrigger value="group">Groups ({counts.group || 0})</TabsTrigger>
                <TabsTrigger value="avenue">Avenues ({counts.avenue || 0})</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="space-y-2">
              {filtered.length === 0 ? (
                <Card className="p-8 text-center">
                  <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No results found for "{query}"</p>
                </Card>
              ) : (
                filtered.map((r) => {
                  const Icon = typeIcons[r.type] || FileText;
                  return (
                    <Link key={`${r.type}-${r.id}`} href={r.link}>
                      <Card className="p-3 flex items-center gap-3 cursor-pointer hover-elevate" data-testid={`result-${r.type}-${r.id}`}>
                        {r.type === "user" ? (
                          <Avatar className="w-10 h-10">
                            <AvatarFallback className="bg-muted">{r.title.slice(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{r.title}</p>
                          <p className="text-sm text-muted-foreground truncate">{r.subtitle}</p>
                        </div>
                        <Badge variant="outline" className="capitalize flex-shrink-0">{r.type}</Badge>
                      </Card>
                    </Link>
                  );
                })
              )}
            </div>
          </>
        )}

        {query.trim().length < 2 && (
          <Card className="p-8 text-center">
            <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-lg font-medium mb-1">Search DAH Social</p>
            <p className="text-muted-foreground">Find people, posts, listings, groups, and avenues</p>
          </Card>
        )}
      </div>
    </PageLayout>
  );
}
