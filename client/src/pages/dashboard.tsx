import { useState, useMemo } from "react";
import { Link } from "wouter";
import { useAuth } from "@/components/AuthProvider";
import { AppHeader } from "@/components/AppHeader";
import { BottomNav } from "@/components/BottomNav";
import { getWallet, getTransactionHistory } from "@/lib/dahCoins";
import { getAllPosts } from "@/lib/feedData";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  Eye,
  MessageCircle,
  Share2,
  BarChart3,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Target,
  Lock,
} from "lucide-react";

function StatCard({ title, value, change, changeType, icon: Icon }: { title: string; value: string; change?: string; changeType?: "up" | "down"; icon: any }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-muted-foreground">{title}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold">{value}</p>
      {change && (
        <div className={`flex items-center gap-1 text-sm mt-1 ${changeType === "up" ? "text-green-500" : "text-red-500"}`}>
          {changeType === "up" ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
          {change} vs last week
        </div>
      )}
    </Card>
  );
}

export default function DashboardPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  if (!session) {
    return (
      <main className="min-h-screen bg-background pb-20">
        <AppHeader />
        <div className="container mx-auto py-12 px-4">
          <Card className="p-8 text-center max-w-md mx-auto">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Log in to view your dashboard</h2>
            <p className="text-muted-foreground mb-4">Track your earnings, analytics, and growth</p>
            <Link href="/login">
              <Button className="bg-dah-gradient-strong">Log In</Button>
            </Link>
          </Card>
        </div>
        <BottomNav />
      </main>
    );
  }

  const wallet = getWallet(session.username);
  const transactions = getTransactionHistory(session.username);
  const posts = getAllPosts().filter((p) => p.type !== "ad" && (p as any).user === session.username);

  const stats = {
    followers: Math.floor(Math.random() * 5000 + 500),
    following: Math.floor(Math.random() * 200 + 50),
    totalViews: Math.floor(Math.random() * 50000 + 5000),
    totalLikes: Math.floor(Math.random() * 10000 + 1000),
    engagementRate: (Math.random() * 5 + 2).toFixed(1),
    postCount: posts.length,
  };

  const weeklyEarnings = transactions
    .filter((t: { timestamp: number; amount: number }) => t.timestamp > Date.now() - 7 * 86400000 && t.amount > 0)
    .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

  const monthlyEarnings = transactions
    .filter((t: { timestamp: number; amount: number }) => t.timestamp > Date.now() - 30 * 86400000 && t.amount > 0)
    .reduce((sum: number, t: { amount: number }) => sum + t.amount, 0);

  const recentTransactions = transactions.slice(0, 10);

  const analyticsData = [
    { day: "Mon", views: 1200, likes: 340 },
    { day: "Tue", views: 1800, likes: 520 },
    { day: "Wed", views: 1500, likes: 430 },
    { day: "Thu", views: 2200, likes: 680 },
    { day: "Fri", views: 2800, likes: 890 },
    { day: "Sat", views: 3200, likes: 1020 },
    { day: "Sun", views: 2600, likes: 780 },
  ];

  const maxViews = Math.max(...analyticsData.map((d) => d.views));

  return (
    <main className="min-h-screen bg-background pb-20">
      <AppHeader />
      <div className="container mx-auto py-6 px-4 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <BarChart3 className="w-6 h-6" />
              Creator Dashboard
            </h1>
            <p className="text-muted-foreground">Track your growth, earnings, and performance</p>
          </div>
          <Card className="px-4 py-2 flex items-center gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Available</p>
              <p className="font-bold text-lg flex items-center gap-1">
                <Coins className="w-4 h-4 text-primary" />
                {wallet.available}
              </p>
            </div>
            {wallet.lockedForCollege > 0 && (
              <div className="border-l pl-3">
                <p className="text-xs text-muted-foreground">Locked</p>
                <p className="font-bold text-lg flex items-center gap-1">
                  <Lock className="w-4 h-4 text-muted-foreground" />
                  {wallet.lockedForCollege}
                </p>
              </div>
            )}
          </Card>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard title="Followers" value={stats.followers.toLocaleString()} change="+12%" changeType="up" icon={Users} />
          <StatCard title="Total Views" value={stats.totalViews.toLocaleString()} change="+24%" changeType="up" icon={Eye} />
          <StatCard title="Engagement Rate" value={`${stats.engagementRate}%`} change="+0.3%" changeType="up" icon={Heart} />
          <StatCard title="Posts" value={stats.postCount.toString()} icon={MessageCircle} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="lg:col-span-2 p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Weekly Performance
            </h3>
            <div className="flex items-end gap-2 h-40">
              {analyticsData.map((day) => (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full flex flex-col gap-1">
                    <div
                      className="w-full bg-primary/80 rounded-t"
                      style={{ height: `${(day.views / maxViews) * 100}px` }}
                    />
                    <div
                      className="w-full bg-pink-500/80 rounded-t"
                      style={{ height: `${(day.likes / maxViews) * 30}px` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-6 mt-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded" />
                Views
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-pink-500 rounded" />
                Likes
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Earnings Summary
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">This Week</span>
                  <span className="font-bold">{weeklyEarnings} DAH</span>
                </div>
                <Progress value={(weeklyEarnings / 100) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Daily cap: 100 DAH</p>
              </div>
              <div>
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-muted-foreground">This Month</span>
                  <span className="font-bold">{monthlyEarnings} DAH</span>
                </div>
                <Progress value={(monthlyEarnings / 2000) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">Monthly cap: 2,000 DAH</p>
              </div>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">Lifetime Earnings</p>
                <p className="text-xl font-bold flex items-center gap-1">
                  <Coins className="w-5 h-5 text-primary" />
                  {wallet.available + wallet.lockedForCollege + Math.floor(Math.random() * 5000)}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-4">
          <h3 className="font-semibold mb-4">Recent Transactions</h3>
          {recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {recentTransactions.map((tx: { amount: number; description: string; timestamp: number }, idx: number) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${tx.amount > 0 ? "bg-green-500/20" : "bg-red-500/20"}`}>
                      {tx.amount > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.amount > 0 ? "text-green-500" : "text-red-500"}`}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-4">No transactions yet</p>
          )}
        </Card>
      </div>
      <BottomNav />
    </main>
  );
}
