import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { useAuth } from "@/components/AuthProvider";
import { getDailyQuests, getWeeklyQuests, getAchievements, getStreak, claimQuestReward, Quest } from "@/lib/quests";
import { getWallet } from "@/lib/dahCoins";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  Coins,
  Flame,
  Target,
  Trophy,
  Gift,
  Heart,
  MessageCircle,
  PlusSquare,
  Play,
  UserPlus,
  Share,
  ShoppingBag,
  Award,
  DollarSign,
  Star,
  TrendingUp,
  Gem,
  Check,
  Lock,
} from "lucide-react";

const iconMap: Record<string, any> = {
  heart: Heart,
  "message-circle": MessageCircle,
  "plus-square": PlusSquare,
  play: Play,
  "user-plus": UserPlus,
  share: Share,
  "shopping-bag": ShoppingBag,
  flame: Flame,
  coins: Coins,
  grid: Target,
  award: Award,
  "dollar-sign": DollarSign,
  star: Star,
  "trending-up": TrendingUp,
  gem: Gem,
};

function QuestCard({
  quest,
  onClaim,
  disabled,
}: {
  quest: Quest;
  onClaim: () => void;
  disabled: boolean;
}) {
  const Icon = iconMap[quest.icon] || Target;
  const progress = (quest.progress / quest.requirement) * 100;

  return (
    <Card className="p-4" data-testid={`card-quest-${quest.id}`}>
      <div className="flex items-start gap-4">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            quest.completed ? "bg-green-500/20" : "bg-primary/10"
          }`}
        >
          {quest.completed ? (
            <Check className="w-6 h-6 text-green-500" />
          ) : (
            <Icon className="w-6 h-6 text-primary" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-semibold">{quest.title}</h3>
              <p className="text-sm text-muted-foreground">{quest.description}</p>
            </div>
            <Badge variant="secondary" className="flex-shrink-0 gap-1">
              <Coins className="w-3 h-3" />
              {quest.reward}
            </Badge>
          </div>

          <div className="mt-3">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-muted-foreground">
                {quest.progress} / {quest.requirement}
              </span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {quest.completed && !quest.claimed && (
            <Button
              size="sm"
              className="mt-3 bg-dah-gradient-strong w-full gap-2"
              onClick={onClaim}
              disabled={disabled}
              data-testid={`button-claim-${quest.id}`}
            >
              <Gift className="w-4 h-4" />
              Claim Reward
            </Button>
          )}

          {quest.claimed && (
            <Badge variant="outline" className="mt-3 text-green-500 border-green-500/50">
              <Check className="w-3 h-3 mr-1" />
              Claimed
            </Badge>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function QuestsPage() {
  const { session } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("daily");
  const [, forceUpdate] = useState(0);

  if (!session) {
    return (
      <main className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="container mx-auto py-6 px-4">
          <Card className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Log in to view quests</h2>
            <p className="text-muted-foreground">Complete quests to earn DAH Coins!</p>
          </Card>
        </div>
        <BottomNav />
      </main>
    );
  }

  const dailyQuests = getDailyQuests(session.username);
  const weeklyQuests = getWeeklyQuests(session.username);
  const achievements = getAchievements(session.username);
  const streak = getStreak(session.username);
  const wallet = getWallet(session.username);

  const completedDaily = dailyQuests.filter((q) => q.completed).length;
  const completedWeekly = weeklyQuests.filter((q) => q.completed).length;
  const unlockedAchievements = achievements.filter((q) => q.completed).length;

  const handleClaim = (questId: string) => {
    const success = claimQuestReward(session.username, questId, session.age);
    if (success) {
      toast({ title: "Reward claimed!", description: "DAH Coins added to your wallet" });
      forceUpdate((n) => n + 1);
    } else {
      toast({ title: "Failed to claim reward", variant: "destructive" });
    }
  };

  return (
    <main className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6" />
              Quests
            </h1>
            <p className="text-muted-foreground">Complete quests to earn DAH Coins</p>
          </div>
          <Card className="px-4 py-2 flex items-center gap-2">
            <Coins className="w-5 h-5 text-primary" />
            <span className="font-bold">{wallet.available}</span>
          </Card>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-2xl font-bold">{streak}</span>
            </div>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Target className="w-5 h-5 text-primary" />
              <span className="text-2xl font-bold">
                {completedDaily}/{dailyQuests.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Daily</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span className="text-2xl font-bold">
                {completedWeekly}/{weeklyQuests.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Weekly</p>
          </Card>

          <Card className="p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-purple-500" />
              <span className="text-2xl font-bold">
                {unlockedAchievements}/{achievements.length}
              </span>
            </div>
            <p className="text-sm text-muted-foreground">Achievements</p>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="gap-1">
              <Target className="w-4 h-4" />
              Daily
            </TabsTrigger>
            <TabsTrigger value="weekly" className="gap-1">
              <Star className="w-4 h-4" />
              Weekly
            </TabsTrigger>
            <TabsTrigger value="achievements" className="gap-1">
              <Trophy className="w-4 h-4" />
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="daily" className="mt-6 space-y-3">
            {dailyQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={() => handleClaim(quest.id)}
                disabled={!quest.completed || quest.claimed}
              />
            ))}
          </TabsContent>

          <TabsContent value="weekly" className="mt-6 space-y-3">
            {weeklyQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={() => handleClaim(quest.id)}
                disabled={!quest.completed || quest.claimed}
              />
            ))}
          </TabsContent>

          <TabsContent value="achievements" className="mt-6 space-y-3">
            {achievements.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                onClaim={() => handleClaim(quest.id)}
                disabled={!quest.completed || quest.claimed}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
      <BottomNav />
    </main>
  );
}
