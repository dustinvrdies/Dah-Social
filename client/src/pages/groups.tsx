import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { getGroups, searchGroups, isGroupMember, joinGroup, leaveGroup, groupCategories, Group } from "@/lib/groups";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Users, Lock, Globe, Search, Plus, TrendingUp, Sparkles } from "lucide-react";

function GroupCard({ group, isMember, onJoin, onLeave }: { group: Group; isMember: boolean; onJoin: () => void; onLeave: () => void }) {
  return (
    <Card className="overflow-hidden" data-testid={`card-group-${group.id}`}>
      <div className="aspect-[3/1] bg-muted relative">
        {group.coverImage ? (
          <img src={group.coverImage} alt={group.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-dah-gradient" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm border-0" variant="secondary">
          {group.privacy === "private" ? <Lock className="w-3 h-3 mr-1" /> : <Globe className="w-3 h-3 mr-1" />}
          {group.privacy}
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{group.name}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {group.memberCount.toLocaleString()} members
          </div>
          <Badge variant="outline">{group.category}</Badge>
        </div>
        {isMember ? (
          <div className="flex gap-2">
            <Link href={`/group/${group.id}`} className="flex-1">
              <Button variant="default" className="w-full" data-testid={`button-view-group-${group.id}`}>
                View Group
              </Button>
            </Link>
            <Button variant="outline" onClick={onLeave} data-testid={`button-leave-group-${group.id}`}>
              Leave
            </Button>
          </div>
        ) : (
          <Button className="w-full bg-dah-gradient-strong" onClick={onJoin} data-testid={`button-join-group-${group.id}`}>
            {group.privacy === "private" ? "Request to Join" : "Join Group"}
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function GroupsPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [groups, setGroups] = useState(() => getGroups());
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("discover");

  const filteredGroups = useMemo(() => {
    let result = searchQuery ? searchGroups(searchQuery) : groups;
    if (activeCategory !== "all") {
      result = result.filter((g) => g.category === activeCategory);
    }
    if (activeTab === "joined" && session) {
      result = result.filter((g) => isGroupMember(session.username, g.id));
    }
    return result;
  }, [groups, searchQuery, activeCategory, activeTab, session]);

  const handleJoin = (groupId: string) => {
    if (!session) {
      toast({ title: "Please log in to join groups", variant: "destructive" });
      return;
    }
    joinGroup(session.username, groupId);
    setGroups(getGroups());
    toast({ title: "Joined group successfully!" });
  };

  const handleLeave = (groupId: string) => {
    if (!session) return;
    leaveGroup(session.username, groupId);
    setGroups(getGroups());
    toast({ title: "Left group" });
  };

  return (
    <main className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="w-6 h-6" />
            Groups
          </h1>
          <p className="text-muted-foreground">Join communities that share your interests</p>
        </div>
        <Button className="bg-dah-gradient-strong gap-2" data-testid="button-create-group">
          <Plus className="w-4 h-4" />
          Create Group
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search groups..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            data-testid="input-search-groups"
          />
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="discover" className="gap-1">
              <Sparkles className="w-4 h-4" />
              Discover
            </TabsTrigger>
            <TabsTrigger value="joined" className="gap-1">
              <Users className="w-4 h-4" />
              Joined
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        {groupCategories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGroups.map((group) => (
          <GroupCard
            key={group.id}
            group={group}
            isMember={session ? isGroupMember(session.username, group.id) : false}
            onJoin={() => handleJoin(group.id)}
            onLeave={() => handleLeave(group.id)}
          />
        ))}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            {activeTab === "joined" ? "You haven't joined any groups yet" : "No groups found"}
          </p>
        </div>
      )}
    </main>
  );
}
