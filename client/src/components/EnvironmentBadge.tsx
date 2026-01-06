import { Badge } from "@/components/ui/badge";

interface EnvironmentBadgeProps {
  env?: "prod" | "staging" | "dev";
}

export function EnvironmentBadge({ env = "prod" }: EnvironmentBadgeProps) {
  const colors = {
    prod: "bg-green-500/10 text-green-500 border-green-500/20",
    staging: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    dev: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className="fixed bottom-4 left-4 z-[10000]">
      <Badge variant="outline" className={`px-2 py-1 font-mono text-[10px] uppercase tracking-wider ${colors[env]}`}>
        {env}
      </Badge>
    </div>
  );
}
