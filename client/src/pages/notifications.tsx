import { useEffect, useState } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { getNotifications, Notification } from "@/lib/notifications";
import { Card } from "@/components/ui/card";

export default function NotificationsPage() {
  const { session } = useAuth();
  const [list, setList] = useState<Notification[]>([]);

  useEffect(() => {
    if (!session) return;
    setList(getNotifications(session.username));
  }, [session]);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Alerts</h1>
        {!session ? (
          <div className="text-muted-foreground">Login to view alerts.</div>
        ) : list.length ? (
          <div className="space-y-2">
            {list.map((n) => (
              <Card key={n.id} className="p-3" data-testid={`card-notification-${n.id}`}>
                <div className="text-sm" data-testid="text-notification-message">{n.message}</div>
                <div className="text-xs text-muted-foreground">
                  {new Date(n.ts).toLocaleString()}
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">No alerts yet.</div>
        )}
      </div>
    </PageLayout>
  );
}
