import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function GatedPostNotice() {
  return (
    <Card className="border-dashed border-primary/30 bg-primary/5">
      <CardContent className="flex flex-col items-center justify-center py-10 text-center space-y-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Lock className="w-6 h-6 text-primary" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold">Subscriber-only Content</h3>
          <p className="text-sm text-muted-foreground">Subscribe to this creator to unlock this post.</p>
        </div>
        <Button className="bg-dah-gradient-strong">
          Subscribe Now
        </Button>
      </CardContent>
    </Card>
  );
}
