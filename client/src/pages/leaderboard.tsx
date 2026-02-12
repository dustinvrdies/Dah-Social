import { useState, useMemo } from "react";
import { Link } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { botUsers } from "@/lib/botUsers";
import { getWallet } from "@/lib/dahCoins";
import { getFollowers } from "@/lib/follows";
import { getUserLevel } from "@/lib/levels";
import { getCheckinState } from "@/lib/checkin";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Trophy, Coins, Users, Flame, TrendingUp, Crown, Medal, Award } from "lucide-react";

interface LeaderEntry {
  username: string;
  displayName: string;
  value: number;
  label: string;
}

function getRankIcon(idx: number) {
  if (idx === 0) return <Crown className="w-5 h-5 text-yellow-500" />;
  if (idx === 1) return <Medal className="w-5 h-5 text-gray-400" />;
  if (idx === 2) return <Award className="w-5 h-5 text-amber-600" />;
  return <span className="text-sm text-muted-foreground font-mono w-5 text-center">{idx + 1}</span>;
}

function LeaderboardList({ entries, icon }: { entries: LeaderEntry[]; icon: typeof Coins }) {
  const Icon = icon;
  return (
    <div className="space-y-2">
      {entries.map((entry, idx) => (
        <Link key={entry.username} href={`/profile/${entry.username}`}>
          <Card
            className={`p-3 flex items-center gap-3 cursor-pointer hover-elevate ${idx < 3 ? "border-primary/20" : ""}`}
            data-testid={`leaderboard-entry-${entry.username}`}
          >
            <div className="w-8 flex justify-center flex-shrink-0">{getRankIcon(idx)}</div>
            <Avatar className="w-9 h-9 flex-shrink-0">
              <AvatarFallback className="bg-muted text-sm">{entry.username.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{entry.displayName}</p>
              <p className="text-xs text-muted-foreground">@{entry.username}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <Icon className="w-4 h-4 text-primary" />
              <span className="font-bold text-sm tabular-nums">{entry.value.toLocaleString()}</span>
              <span className="text-xs text-muted-foreground">{entry.label}</span>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}

export default function LeaderboardPage() {
  const { session } = useAuth();
  const [tab, setTab] = useState("coins");

  const allUsers = useMemo(() => {
    const users = botUsers.map((b) => ({
      username: b.username,
      displayName: b.displayName,
    }));
    if (session) {
      users.push({ username: session.username, displayName: session.username });
    }
    return users;
  }, [session]);

  const coinLeaders = useMemo(() => {
    return allUsers
      .map((u) => {
        const w = getWallet(u.username);
        return { ...u, value: w.available + w.lockedForCollege, label: "coins" };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [allUsers]);

  const followerLeaders = useMemo(() => {
    return allUsers
      .map((u) => {
        const followers = getFollowers(u.username);
        return { ...u, value: followers.length, label: "followers" };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [allUsers]);

  const levelLeaders = useMemo(() => {
    return allUsers
      .map((u) => {
        const level = getUserLevel(u.username);
        return { ...u, value: level.level, label: `Lv.` };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [allUsers]);

  const streakLeaders = useMemo(() => {
    return allUsers
      .map((u) => {
        const checkin = getCheckinState(u.username);
        return { ...u, value: checkin.streak, label: "days" };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 20);
  }, [allUsers]);

  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-3">
          <Trophy className="w-7 h-7 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Leaderboard</h1>
            <p className="text-sm text-muted-foreground">Top performers on DAH Social</p>
          </div>
        </div>

        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="coins" className="flex-1 gap-1.5">
              <Coins className="w-4 h-4" /> Top Earners
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex-1 gap-1.5">
              <Users className="w-4 h-4" /> Most Followed
            </TabsTrigger>
            <TabsTrigger value="level" className="flex-1 gap-1.5">
              <TrendingUp className="w-4 h-4" /> Highest Level
            </TabsTrigger>
            <TabsTrigger value="streak" className="flex-1 gap-1.5">
              <Flame className="w-4 h-4" /> Best Streaks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="coins">
            <LeaderboardList entries={coinLeaders} icon={Coins} />
          </TabsContent>
          <TabsContent value="followers">
            <LeaderboardList entries={followerLeaders} icon={Users} />
          </TabsContent>
          <TabsContent value="level">
            <LeaderboardList entries={levelLeaders} icon={TrendingUp} />
          </TabsContent>
          <TabsContent value="streak">
            <LeaderboardList entries={streakLeaders} icon={Flame} />
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
