import { useState } from "react";
import { Link } from "wouter";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/components/AuthProvider";
import { 
  getAllAvenues, 
  getTrendingAvenues, 
  searchAvenues, 
  getAvenuesByCategory,
  createAvenue,
  isSubscribed,
  subscribeToAvenue,
  unsubscribeFromAvenue,
  getUserSubscriptions,
  avenueCategories,
  formatCount,
  type Avenue,
  type AvenueCategory
} from "@/lib/avenues";
import { TrendingUp, Search, Plus, Users, Flame, Sparkles, MessageSquare, ChevronRight } from "lucide-react";

export default function AvenuesPage() {
  const { session } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<AvenueCategory | "all">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [, setRefresh] = useState(0);

  const trending = getTrendingAvenues(10);
  const allAvenues = getAllAvenues();
  const subscriptions = session ? getUserSubscriptions(session.username) : [];
  const subscribedAvenues = allAvenues.filter(a => subscriptions.includes(a.id));

  const filteredAvenues = searchQuery
    ? searchAvenues(searchQuery)
    : selectedCategory === "all"
    ? allAvenues
    : getAvenuesByCategory(selectedCategory);

  const handleSubscribe = (avenueId: string) => {
    if (isSubscribed(avenueId)) {
      unsubscribeFromAvenue(avenueId);
    } else {
      subscribeToAvenue(avenueId);
    }
    setRefresh(r => r + 1);
  };

  const handleCreateAvenue = (data: {
    name: string;
    displayName: string;
    description: string;
    category: AvenueCategory;
    isPrivate: boolean;
    isNSFW: boolean;
  }) => {
    createAvenue({
      ...data,
      flairs: [],
    });
    setCreateOpen(false);
    setRefresh(r => r + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-primary" />
              DAH Avenues
            </h1>
            <p className="text-muted-foreground">Topic-based discussions and communities</p>
          </div>
          
          {session && (
            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
              <DialogTrigger asChild>
                <Button data-testid="button-create-avenue">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Avenue
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a New Avenue</DialogTitle>
                </DialogHeader>
                <CreateAvenueForm onSubmit={handleCreateAvenue} onCancel={() => setCreateOpen(false)} />
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search avenues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              data-testid="input-search-avenues"
            />
          </div>
        </div>

        <Tabs defaultValue="trending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="trending" data-testid="tab-trending">
              <Flame className="w-4 h-4 mr-1" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="browse" data-testid="tab-browse">
              <Sparkles className="w-4 h-4 mr-1" />
              Browse
            </TabsTrigger>
            {session && (
              <TabsTrigger value="subscribed" data-testid="tab-subscribed">
                <Users className="w-4 h-4 mr-1" />
                My Avenues
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="trending" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trending.map((avenue, idx) => (
                <AvenueCard
                  key={avenue.id}
                  avenue={avenue}
                  rank={idx + 1}
                  isSubscribed={isSubscribed(avenue.id)}
                  onSubscribe={() => handleSubscribe(avenue.id)}
                  showRank
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="browse" className="space-y-6">
            <div className="flex flex-wrap gap-2 mb-4">
              <Badge
                variant={selectedCategory === "all" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory("all")}
              >
                All
              </Badge>
              {avenueCategories.map(cat => (
                <Badge
                  key={cat}
                  variant={selectedCategory === cat ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Badge>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAvenues.map(avenue => (
                <AvenueCard
                  key={avenue.id}
                  avenue={avenue}
                  isSubscribed={isSubscribed(avenue.id)}
                  onSubscribe={() => handleSubscribe(avenue.id)}
                />
              ))}
            </div>

            {filteredAvenues.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                No avenues found matching your search.
              </div>
            )}
          </TabsContent>

          {session && (
            <TabsContent value="subscribed" className="space-y-6">
              {subscribedAvenues.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {subscribedAvenues.map(avenue => (
                    <AvenueCard
                      key={avenue.id}
                      avenue={avenue}
                      isSubscribed={true}
                      onSubscribe={() => handleSubscribe(avenue.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No subscriptions yet</h3>
                  <p className="text-muted-foreground mb-4">Join some Avenues to see them here</p>
                  <Button variant="outline" onClick={() => {}}>
                    Browse Avenues
                  </Button>
                </div>
              )}
            </TabsContent>
          )}
        </Tabs>
      </main>
    </div>
  );
}

function AvenueCard({
  avenue,
  rank,
  isSubscribed,
  onSubscribe,
  showRank,
}: {
  avenue: Avenue;
  rank?: number;
  isSubscribed: boolean;
  onSubscribe: () => void;
  showRank?: boolean;
}) {
  return (
    <Card className="hover-elevate">
      <Link href={`/av/${avenue.name}`}>
        <CardHeader className="pb-2">
          <div className="flex items-start gap-3">
            {showRank && rank && (
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm">
                {rank}
              </div>
            )}
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary font-bold">
                {avenue.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-base truncate">a/{avenue.name}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{avenue.displayName}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          </div>
        </CardHeader>
      </Link>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{avenue.description}</p>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              {formatCount(avenue.memberCount)}
            </span>
            <Badge variant="secondary" className="text-xs">
              {avenue.category}
            </Badge>
          </div>
          <Button
            variant={isSubscribed ? "outline" : "default"}
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSubscribe();
            }}
            data-testid={`button-subscribe-${avenue.id}`}
          >
            {isSubscribed ? "Joined" : "Join"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function CreateAvenueForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: {
    name: string;
    displayName: string;
    description: string;
    category: AvenueCategory;
    isPrivate: boolean;
    isNSFW: boolean;
  }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<AvenueCategory>("Discussion");
  const [isPrivate, setIsPrivate] = useState(false);
  const [isNSFW, setIsNSFW] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !displayName.trim()) return;
    
    onSubmit({
      name: name.replace(/\s+/g, ""),
      displayName,
      description,
      category,
      isPrivate,
      isNSFW,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Avenue Name (no spaces)</Label>
        <div className="flex items-center">
          <span className="text-muted-foreground mr-1">a/</span>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s+/g, ""))}
            placeholder="MyAvenue"
            required
            data-testid="input-avenue-name"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="displayName">Display Name</Label>
        <Input
          id="displayName"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="My Avenue"
          required
          data-testid="input-avenue-display-name"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is this avenue about?"
          rows={3}
          data-testid="input-avenue-description"
        />
      </div>

      <div className="space-y-2">
        <Label>Category</Label>
        <Select value={category} onValueChange={(v) => setCategory(v as AvenueCategory)}>
          <SelectTrigger data-testid="select-avenue-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {avenueCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="private">Private Avenue</Label>
        <Switch
          id="private"
          checked={isPrivate}
          onCheckedChange={setIsPrivate}
        />
      </div>

      <div className="flex items-center justify-between">
        <Label htmlFor="nsfw">18+ Content</Label>
        <Switch
          id="nsfw"
          checked={isNSFW}
          onCheckedChange={setIsNSFW}
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" data-testid="button-submit-create-avenue">
          Create Avenue
        </Button>
      </div>
    </form>
  );
}
