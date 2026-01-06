interface RiskFlagProps {
  level?: "low" | "medium" | "high";
}

export function RiskFlag({ level = "low" }: RiskFlagProps) {
  const colors = {
    low: "text-green-500",
    medium: "text-yellow-500",
    high: "text-red-500",
  };

  return (
    <span className={`text-[10px] font-bold uppercase tracking-tighter ${colors[level]}`}>
      Risk: {level}
    </span>
  );
}
