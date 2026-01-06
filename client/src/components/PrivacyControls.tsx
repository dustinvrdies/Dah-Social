import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Lock } from "lucide-react";

export function PrivacyControls() {
  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Privacy Settings</CardTitle>
        <Lock className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="public-profile" className="text-xs">Public Profile</Label>
          <Switch id="public-profile" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="allow-dms" className="text-xs">Allow DMs</Label>
          <Switch id="allow-dms" defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="activity-status" className="text-xs">Show Activity Status</Label>
          <Switch id="activity-status" />
        </div>
      </CardContent>
    </Card>
  );
}
