import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getWallet, getLedger, Wallet, Entry } from "@/lib/dahCoins";
import { Card } from "@/components/ui/card";

export function WalletSummary() {
  const { session } = useAuth();
  const [w, setW] = useState<Wallet | null>(null);
  const [l, setL] = useState<Entry[]>([]);

  useEffect(() => {
    if (!session) return;
    setW(getWallet(session.username));
    setL(
      getLedger()
        .filter((e) => e.username === session.username)
        .slice(0, 10)
    );
  }, [session]);

  if (!session || !w) return null;

  return (
    <Card className="p-4 space-y-3" data-testid="card-wallet-summary">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <span className="font-bold">DAH Coins</span>
        <span className="text-xs text-muted-foreground">Trading disabled</span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="p-3 rounded-md bg-muted">
          <div className="text-xs text-muted-foreground">Available</div>
          <div className="text-lg font-bold" data-testid="text-wallet-available">{w.available}</div>
        </div>
        <div className="p-3 rounded-md bg-muted">
          <div className="text-xs text-muted-foreground">Locked (College)</div>
          <div className="text-lg font-bold" data-testid="text-wallet-locked">{w.lockedForCollege}</div>
        </div>
      </div>
      {l.length > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Recent activity</div>
          {l.slice(0, 3).map((e) => (
            <div key={e.id} className="text-xs flex justify-between gap-2">
              <span>{e.event}</span>
              <span className="text-primary">+{e.available}</span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
