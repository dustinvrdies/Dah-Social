import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getReputation, recordVerifiedSale } from "@/lib/reputation";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ListingCardProps {
  user: string;
  title: string;
  price: number;
  location?: string;
}

export function ListingCard({ user, title, price, location }: ListingCardProps) {
  const { session } = useAuth();
  const [rep, setRep] = useState<{ score: number; verifiedSales: number } | null>(null);

  useEffect(() => {
    setRep(getReputation(user));
  }, [user]);

  const canMarkSold = session?.username === user;

  const markSold = () => {
    if (!session) return;
    const updated = recordVerifiedSale(session.username);
    setRep(updated);
    addCoins(session.username, session.age, "Verified sale", 20);
    pushNotification(session.username, {
      username: session.username,
      type: "sale",
      message: "Verified sale recorded. DAH Coins awarded.",
    });
  };

  return (
    <Card className="p-4 space-y-3" data-testid={`card-listing-${title.replace(/\s+/g, "-").toLowerCase()}`}>
      <div className="text-sm text-muted-foreground">@{user} listed</div>
      <div className="font-semibold" data-testid="text-listing-title">{title}</div>
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <Badge variant="secondary" className="text-primary font-bold" data-testid="text-listing-price">
          ${price}
        </Badge>
        {location && (
          <span className="text-xs text-muted-foreground" data-testid="text-listing-location">
            {location}
          </span>
        )}
      </div>

      <div className="text-xs text-muted-foreground">
        Seller rep: {rep ? `${rep.score} (sales ${rep.verifiedSales})` : "-"}
      </div>

      {canMarkSold && (
        <Button variant="secondary" size="sm" onClick={markSold} data-testid="button-mark-sold">
          Mark as sold (demo)
        </Button>
      )}

      <div className="text-xs text-muted-foreground">
        Payments and coin trading are disabled at this stage for safety and fraud prevention.
      </div>
    </Card>
  );
}
