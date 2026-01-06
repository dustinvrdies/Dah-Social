import { Badge } from "@/components/ui/badge";
import { ShieldCheck, ShieldAlert, Shield } from "lucide-react";

interface EscrowStatusProps {
  status: "pending" | "released" | "disputed";
}

export function EscrowStatus({ status }: EscrowStatusProps) {
  const config = {
    pending: { label: "In Escrow", icon: Shield, class: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
    released: { label: "Released", icon: ShieldCheck, class: "bg-green-500/10 text-green-500 border-green-500/20" },
    disputed: { label: "Disputed", icon: ShieldAlert, class: "bg-destructive/10 text-destructive border-destructive/20" },
  };

  const { label, icon: Icon, class: className } = config[status];

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="text-muted-foreground font-medium">SafeTrade Status:</span>
      <Badge variant="outline" className={`gap-1.5 ${className}`}>
        <Icon className="w-3.5 h-3.5" />
        {label}
      </Badge>
    </div>
  );
}
