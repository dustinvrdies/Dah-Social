import { Progress } from "@/components/ui/progress";
import { ShieldCheck } from "lucide-react";

interface TrustScoreProps {
  score: number;
}

export function TrustScore({ score }: TrustScoreProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          Trust Score
        </span>
        <span className="font-bold text-foreground">{score}/100</span>
      </div>
      <Progress value={score} className="h-1.5" />
    </div>
  );
}
