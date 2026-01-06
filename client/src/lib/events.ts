import { lsGet, lsSet } from "./storage";

export interface Event {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  startTime: number;
  endTime: number;
  location: string;
  locationType: "online" | "in-person" | "hybrid";
  hostUsername: string;
  category: string;
  rsvpCount: number;
  isRecurring: boolean;
}

export interface RSVP {
  eventId: string;
  username: string;
  status: "going" | "interested" | "not-going";
  timestamp: number;
}

const EVENTS_KEY = "dah.events";
const RSVPS_KEY = (u: string) => `dah.events.rsvps.${u}`;

const picsum = (id: number) => `https://picsum.photos/id/${id}/1200/600`;

const initialEvents: Event[] = [
  {
    id: "e1",
    title: "Weekend Flea Market Meetup",
    description: "Join fellow collectors at the downtown flea market. We'll hunt for treasures together and share tips!",
    coverImage: picsum(1067),
    startTime: Date.now() + 2 * 86400000,
    endTime: Date.now() + 2 * 86400000 + 4 * 3600000,
    location: "Downtown Flea Market",
    locationType: "in-person",
    hostUsername: "mike_flips",
    category: "Shopping",
    rsvpCount: 45,
    isRecurring: true,
  },
  {
    id: "e2",
    title: "Creator Monetization Workshop",
    description: "Learn how to maximize your DAH Coins earnings. Tips from top creators.",
    coverImage: picsum(180),
    startTime: Date.now() + 5 * 86400000,
    endTime: Date.now() + 5 * 86400000 + 2 * 3600000,
    location: "DAH Live Stream",
    locationType: "online",
    hostUsername: "dah",
    category: "Workshop",
    rsvpCount: 234,
    isRecurring: false,
  },
  {
    id: "e3",
    title: "Vintage Fashion Show",
    description: "Models wearing curated vintage pieces from our top sellers. Live auction follows!",
    coverImage: picsum(996),
    startTime: Date.now() + 7 * 86400000,
    endTime: Date.now() + 7 * 86400000 + 3 * 3600000,
    location: "Hybrid - City Hall + Live Stream",
    locationType: "hybrid",
    hostUsername: "sarah_thrifts",
    category: "Fashion",
    rsvpCount: 156,
    isRecurring: false,
  },
  {
    id: "e4",
    title: "Tech Trade Tuesday",
    description: "Weekly electronics swap meet. Bring your gadgets!",
    coverImage: picsum(366),
    startTime: Date.now() + 3 * 86400000,
    endTime: Date.now() + 3 * 86400000 + 2 * 3600000,
    location: "Tech Hub Cafe",
    locationType: "in-person",
    hostUsername: "techie_marcus",
    category: "Tech",
    rsvpCount: 67,
    isRecurring: true,
  },
  {
    id: "e5",
    title: "Art Market Pop-Up",
    description: "Local artists selling original works. Support handmade!",
    coverImage: picsum(1084),
    startTime: Date.now() + 10 * 86400000,
    endTime: Date.now() + 10 * 86400000 + 6 * 3600000,
    location: "Arts District Park",
    locationType: "in-person",
    hostUsername: "maya_creates",
    category: "Art",
    rsvpCount: 89,
    isRecurring: false,
  },
];

export function getEvents(): Event[] {
  return lsGet<Event[]>(EVENTS_KEY, initialEvents);
}

export function getUpcomingEvents(): Event[] {
  const now = Date.now();
  return getEvents()
    .filter((e) => e.endTime > now)
    .sort((a, b) => a.startTime - b.startTime);
}

export function getEventById(id: string): Event | undefined {
  return getEvents().find((e) => e.id === id);
}

export function getUserRSVPs(username: string): RSVP[] {
  return lsGet<RSVP[]>(RSVPS_KEY(username), []);
}

export function getRSVPStatus(username: string, eventId: string): RSVP["status"] | null {
  const rsvp = getUserRSVPs(username).find((r) => r.eventId === eventId);
  return rsvp?.status || null;
}

export function setRSVP(username: string, eventId: string, status: RSVP["status"]): void {
  const rsvps = getUserRSVPs(username);
  const existing = rsvps.find((r) => r.eventId === eventId);
  const events = getEvents();
  const event = events.find((e) => e.id === eventId);

  if (existing) {
    if (existing.status === "going" && status !== "going" && event) {
      event.rsvpCount = Math.max(0, event.rsvpCount - 1);
    } else if (existing.status !== "going" && status === "going" && event) {
      event.rsvpCount++;
    }
    existing.status = status;
    existing.timestamp = Date.now();
  } else {
    rsvps.push({ eventId, username, status, timestamp: Date.now() });
    if (status === "going" && event) {
      event.rsvpCount++;
    }
  }

  lsSet(RSVPS_KEY(username), rsvps);
  lsSet(EVENTS_KEY, events);
}

export function createEvent(
  title: string,
  description: string,
  startTime: number,
  endTime: number,
  location: string,
  locationType: Event["locationType"],
  hostUsername: string,
  category: string
): Event {
  const events = getEvents();
  const event: Event = {
    id: `e-${Date.now()}`,
    title,
    description,
    startTime,
    endTime,
    location,
    locationType,
    hostUsername,
    category,
    rsvpCount: 1,
    isRecurring: false,
  };
  events.unshift(event);
  lsSet(EVENTS_KEY, events);

  setRSVP(hostUsername, event.id, "going");
  return event;
}

export function formatEventDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export const eventCategories = ["Shopping", "Workshop", "Fashion", "Tech", "Art", "Music", "Sports", "Networking", "Other"];
