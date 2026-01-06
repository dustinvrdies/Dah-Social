import { useState, useMemo } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getUpcomingEvents, getRSVPStatus, setRSVP, formatEventDate, eventCategories, Event } from "@/lib/events";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Calendar, MapPin, Users, Clock, Video, Building, Plus, Star, Check } from "lucide-react";

function EventCard({ event, rsvpStatus, onRSVP }: { event: Event; rsvpStatus: string | null; onRSVP: (status: "going" | "interested") => void }) {
  const locationIcon = event.locationType === "online" ? Video : event.locationType === "hybrid" ? Building : MapPin;
  const LocationIcon = locationIcon;

  return (
    <Card className="overflow-hidden" data-testid={`card-event-${event.id}`}>
      <div className="aspect-[2/1] bg-muted relative">
        {event.coverImage ? (
          <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-dah-gradient flex items-center justify-center">
            <Calendar className="w-12 h-12 text-white/50" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {event.isRecurring && (
          <Badge className="absolute top-2 left-2 bg-primary/90 border-0">Recurring</Badge>
        )}
        <Badge className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm border-0" variant="secondary">
          <LocationIcon className="w-3 h-3 mr-1" />
          {event.locationType}
        </Badge>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex flex-col items-center justify-center bg-primary/10 rounded-lg p-2 min-w-[50px]">
            <span className="text-xs text-primary font-medium uppercase">
              {new Date(event.startTime).toLocaleDateString("en-US", { month: "short" })}
            </span>
            <span className="text-xl font-bold">{new Date(event.startTime).getDate()}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold line-clamp-2">{event.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">by @{event.hostUsername}</p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatEventDate(event.startTime)}
          </div>
          <div className="flex items-center gap-2">
            <LocationIcon className="w-4 h-4" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            {event.rsvpCount} going
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant={rsvpStatus === "going" ? "default" : "outline"}
            className={`flex-1 ${rsvpStatus === "going" ? "bg-dah-gradient-strong" : ""}`}
            onClick={() => onRSVP("going")}
            data-testid={`button-going-${event.id}`}
          >
            {rsvpStatus === "going" ? <Check className="w-4 h-4 mr-1" /> : null}
            Going
          </Button>
          <Button
            variant={rsvpStatus === "interested" ? "default" : "outline"}
            onClick={() => onRSVP("interested")}
            data-testid={`button-interested-${event.id}`}
          >
            <Star className={`w-4 h-4 ${rsvpStatus === "interested" ? "fill-current" : ""}`} />
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function EventsPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [events, setEvents] = useState(() => getUpcomingEvents());
  const [activeCategory, setActiveCategory] = useState("all");
  const [, forceUpdate] = useState(0);

  const filteredEvents = useMemo(() => {
    if (activeCategory === "all") return events;
    return events.filter((e) => e.category === activeCategory);
  }, [events, activeCategory]);

  const handleRSVP = (eventId: string, status: "going" | "interested") => {
    if (!session) {
      toast({ title: "Please log in to RSVP", variant: "destructive" });
      return;
    }

    const currentStatus = getRSVPStatus(session.username, eventId);
    if (currentStatus === status) {
      setRSVP(session.username, eventId, "not-going");
    } else {
      setRSVP(session.username, eventId, status);
    }

    setEvents(getUpcomingEvents());
    forceUpdate((n) => n + 1);
    toast({ title: status === "going" ? "You're going!" : "Added to interested" });
  };

  return (
    <main className="container mx-auto py-6 px-4 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calendar className="w-6 h-6" />
            Events
          </h1>
          <p className="text-muted-foreground">Discover and join local meetups and online events</p>
        </div>
        <Button className="bg-dah-gradient-strong gap-2" data-testid="button-create-event">
          <Plus className="w-4 h-4" />
          Create Event
        </Button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
        >
          All Events
        </Button>
        {eventCategories.map((cat) => (
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
        {filteredEvents.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            rsvpStatus={session ? getRSVPStatus(session.username, event.id) : null}
            onRSVP={(status) => handleRSVP(event.id, status)}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">No upcoming events in this category</p>
        </div>
      )}
    </main>
  );
}
