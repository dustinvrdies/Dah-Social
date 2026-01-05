import { Card } from "@/components/ui/card";

const categories = [
  { title: "Flea Market", subtitle: "Local exchange and used goods" },
  { title: "Thrift Shop", subtitle: "Secondhand finds" },
  { title: "Electronics", subtitle: "Devices, parts, gear" },
  { title: "Exchange", subtitle: "Trade requests and swaps" },
];

export function MallLanding() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">DAH Mall</h1>
      <p className="text-muted-foreground">
        Social marketplace. Listings show up in your feed. Coins trading is disabled for safety.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {categories.map((c) => (
          <Card
            key={c.title}
            className="p-4 hover-elevate cursor-pointer"
            data-testid={`card-category-${c.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <div className="font-semibold">{c.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{c.subtitle}</div>
          </Card>
        ))}
      </div>

      <div className="text-sm text-muted-foreground">
        Store auto-generation (based on user demand) will be added in a later iteration.
      </div>
    </div>
  );
}
