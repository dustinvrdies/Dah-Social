import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ChevronRight, Radio, Users, Calendar, Target, MessageSquare, 
  TrendingUp, Flame, Eye, Gift, Clock, MapPin, CheckCircle2,
  ArrowBigUp, ShoppingBag
} from "lucide-react";
import { getGroups } from "@/lib/groups";
import { getEvents } from "@/lib/events";
import { getLiveStreams } from "@/lib/live";
import { getQuestState } from "@/lib/quests";
import { getAllAvenues, sortPosts, getAvenuePosts, type Avenue } from "@/lib/avenues";
import { useAuth } from "./AuthProvider";
import { formatDistanceToNow } from "date-fns";

function SectionHeader({ title, href, icon: Icon }: { title: string; href: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <Icon className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-lg">{title}</h2>
      </div>
      <Link href={href}>
        <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" data-testid={`link-see-all-${title.toLowerCase().replace(/\s/g, '-')}`}>
          See all
          <ChevronRight className="w-4 h-4" />
        </Button>
      </Link>
    </div>
  );
}

export function LiveNowSection() {
  const streams = getLiveStreams().filter(s => s.isLive).slice(0, 3);
  
  if (streams.length === 0) return null;

  return (
    <section className="mb-6">
      <SectionHeader title="Live Now" href="/live" icon={Radio} />
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {streams.map((stream) => (
          <Link key={stream.id} href="/live">
            <Card className="w-48 flex-shrink-0 overflow-hidden hover-elevate cursor-pointer" data-testid={`card-stream-${stream.id}`}>
              <div className="relative">
                <img 
                  src={stream.thumbnailUrl} 
                  alt={stream.title} 
                  className="w-full h-24 object-cover"
                />
                <Badge className="absolute top-2 left-2 bg-red-500 text-white text-[10px]">
                  <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse" />
                  LIVE
                </Badge>
                <div className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {stream.viewerCount}
                </div>
              </div>
              <CardContent className="p-2">
                <p className="text-xs font-medium line-clamp-1">{stream.title}</p>
                <p className="text-[10px] text-muted-foreground">@{stream.hostUsername}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

const categoryColors: Record<string, string> = {
  Technology: "#3B82F6",
  Gaming: "#8B5CF6",
  Crypto: "#F59E0B",
  Memes: "#EC4899",
  News: "#EF4444",
  Music: "#10B981",
  Fitness: "#14B8A6",
  Art: "#E85D8C",
  Discussion: "#6366F1",
};

export function AvenuesSpotlight() {
  const avenues = getAllAvenues().slice(0, 3);
  
  return (
    <section className="mb-6">
      <SectionHeader title="Avenues" href="/avenues" icon={MessageSquare} />
      <div className="space-y-2">
        {avenues.map((avenue) => {
          const posts = sortPosts(getAvenuePosts(avenue.id), "hot", "day").slice(0, 1);
          const topPost = posts[0];
          const color = categoryColors[avenue.category] || "#3B82F6";
          
          return (
            <Link key={avenue.id} href={`/av/${avenue.name}`}>
              <Card className="hover-elevate cursor-pointer" data-testid={`card-avenue-${avenue.id}`}>
                <CardContent className="p-3 flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-md flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: color + "20", color: color }}
                  >
                    {avenue.icon || <MessageSquare className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">a/{avenue.name}</span>
                      <span className="text-xs text-muted-foreground">{(avenue.memberCount / 1000).toFixed(1)}k</span>
                    </div>
                    {topPost && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{topPost.title}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function GroupsSection() {
  const groups = getGroups().slice(0, 3);
  
  return (
    <section className="mb-6">
      <SectionHeader title="Groups" href="/groups" icon={Users} />
      <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
        {groups.map((group) => (
          <Link key={group.id} href="/groups">
            <Card className="w-40 flex-shrink-0 overflow-hidden hover-elevate cursor-pointer" data-testid={`card-group-${group.id}`}>
              <div className="h-16 bg-gradient-to-br from-primary/30 to-accent/30" 
                style={{ backgroundImage: group.coverImage ? `url(${group.coverImage})` : undefined, backgroundSize: "cover" }}
              />
              <CardContent className="p-2">
                <p className="text-xs font-medium line-clamp-1">{group.name}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Users className="w-3 h-3" />
                  {group.memberCount.toLocaleString()}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function EventsSection() {
  const events = getEvents()
    .filter(e => e.startTime > Date.now())
    .sort((a, b) => a.startTime - b.startTime)
    .slice(0, 3);
  
  if (events.length === 0) return null;

  return (
    <section className="mb-6">
      <SectionHeader title="Upcoming Events" href="/events" icon={Calendar} />
      <div className="space-y-2">
        {events.map((event) => (
          <Link key={event.id} href="/events">
            <Card className="hover-elevate cursor-pointer" data-testid={`card-event-${event.id}`}>
              <CardContent className="p-3 flex gap-3">
                <div className="w-12 h-12 rounded-md bg-primary/10 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] text-primary uppercase font-medium">
                    {new Date(event.startTime).toLocaleDateString("en", { month: "short" })}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {new Date(event.startTime).getDate()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium line-clamp-1">{event.title}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(event.startTime).toLocaleTimeString("en", { hour: "numeric", minute: "2-digit" })}
                    </span>
                    <Badge variant="outline" className="text-[10px] h-4">
                      {event.locationType}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}

export function QuestsSection() {
  const { session } = useAuth();
  if (!session) return null;
  
  const state = getQuestState(session.username);
  const activeQuests = state.quests
    .filter(q => !q.claimed && q.type === "daily")
    .slice(0, 3);
  
  const completedCount = state.quests.filter(q => q.completed && !q.claimed).length;

  return (
    <section className="mb-6">
      <SectionHeader title="Daily Quests" href="/quests" icon={Target} />
      <Card>
        <CardContent className="p-3">
          {completedCount > 0 && (
            <div className="flex items-center gap-2 mb-3 p-2 rounded-md bg-primary/10">
              <Gift className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">{completedCount} rewards ready to claim!</span>
            </div>
          )}
          <div className="space-y-2">
            {activeQuests.map((quest) => (
              <div key={quest.id} className="flex items-center gap-3" data-testid={`quest-${quest.id}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  quest.completed ? "bg-primary/20 text-primary" : "bg-muted"
                }`}>
                  {quest.completed ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Target className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{quest.title}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all"
                        style={{ width: `${(quest.progress / quest.requirement) * 100}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{quest.progress}/{quest.requirement}</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-[10px]">+{quest.reward}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

export function MarketplacePicksSection() {
  return (
    <section className="mb-6">
      <SectionHeader title="Marketplace" href="/mall" icon={ShoppingBag} />
      <Card className="overflow-hidden hover-elevate">
        <Link href="/mall">
          <div className="h-24 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 flex items-center justify-center cursor-pointer">
            <div className="text-center">
              <ShoppingBag className="w-8 h-8 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium">Browse the DAH Mall</p>
              <p className="text-xs text-muted-foreground">Discover unique items from creators</p>
            </div>
          </div>
        </Link>
      </Card>
    </section>
  );
}

export function QuickActions() {
  const { session } = useAuth();
  
  const actions = [
    { href: "/video", icon: "play", label: "Videos", color: "#E85D8C" },
    { href: "/live", icon: "radio", label: "Live", color: "#EF4444" },
    { href: "/avenues", icon: "message", label: "Avenues", color: "#3B82F6" },
    { href: "/groups", icon: "users", label: "Groups", color: "#8B5CF6" },
    { href: "/events", icon: "calendar", label: "Events", color: "#10B981" },
    { href: "/quests", icon: "target", label: "Quests", color: "#F59E0B" },
    { href: "/mall", icon: "shop", label: "Mall", color: "#EC4899" },
    { href: "/dashboard", icon: "chart", label: "Dashboard", color: "#6366F1" },
  ];

  return (
    <section className="mb-6">
      <div className="flex gap-4 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
        {actions.map((action) => (
          <Link key={action.href} href={action.href}>
            <button
              className="flex flex-col items-center gap-1 min-w-14"
              data-testid={`quick-action-${action.label.toLowerCase()}`}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: action.color + "20" }}
              >
                <ActionIcon name={action.icon} color={action.color} />
              </div>
              <span className="text-[10px] text-muted-foreground">{action.label}</span>
            </button>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ActionIcon({ name, color }: { name: string; color: string }) {
  const iconClass = "w-5 h-5";
  const style = { color };
  
  switch (name) {
    case "play": return <div className={iconClass} style={style}><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg></div>;
    case "radio": return <Radio className={iconClass} style={style} />;
    case "message": return <MessageSquare className={iconClass} style={style} />;
    case "users": return <Users className={iconClass} style={style} />;
    case "calendar": return <Calendar className={iconClass} style={style} />;
    case "target": return <Target className={iconClass} style={style} />;
    case "shop": return <ShoppingBag className={iconClass} style={style} />;
    case "chart": return <TrendingUp className={iconClass} style={style} />;
    default: return null;
  }
}
