import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle2, Circle } from "lucide-react";

interface OnboardingChecklistProps {
  steps?: string[];
  completedSteps?: string[];
}

export function OnboardingChecklist({ 
  steps = ["Create Profile", "Add Bio", "Follow 3 Creators", "Post your first update"],
  completedSteps = ["Create Profile"]
}: OnboardingChecklistProps) {
  return (
    <Card className="border-dah-pink/20 bg-dah-pink/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold">Getting Started</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {steps.map(step => {
          const isCompleted = completedSteps.includes(step);
          return (
            <div key={step} className="flex items-center gap-3 text-sm">
              {isCompleted ? (
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={isCompleted ? "text-muted-foreground line-through" : "text-foreground"}>
                {step}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
