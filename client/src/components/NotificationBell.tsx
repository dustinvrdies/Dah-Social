import { Link } from "wouter";
import { useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";
import { getNotifications } from "@/lib/notifications";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotificationBell() {
  const { session } = useAuth();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!session) return;
    const list = getNotifications(session.username);
    setCount(list.slice(0, 10).length);
  }, [session]);

  if (!session) return null;

  return (
    <Link href="/notifications">
      <Button variant="ghost" size="icon" className="relative" data-testid="link-notifications">
        <Bell className="w-4 h-4" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 text-xs bg-primary text-primary-foreground rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
            {count}
          </span>
        )}
      </Button>
    </Link>
  );
}
