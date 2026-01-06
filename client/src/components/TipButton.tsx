import { Button } from "@/components/ui/button";
import { Coins } from "lucide-react";

interface TipButtonProps {
  onTip: (amount: number) => void;
  disabled?: boolean;
}

export function TipButton({ onTip, disabled }: TipButtonProps) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => onTip(1)}
      disabled={disabled}
      className="gap-1.5 border-primary/20 hover:bg-primary/10 hover:text-primary transition-colors"
      data-testid="button-tip-1"
    >
      <Coins className="w-3.5 h-3.5" />
      Tip 1 Coin
    </Button>
  );
}
