import { useState } from "react";
import { useLocation } from "wouter";
import { MainNav } from "@/components/MainNav";
import { useAuth } from "@/components/AuthProvider";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Users, ShoppingBag, Video } from "lucide-react";

export default function LoginPage() {
  const [, navigate] = useLocation();
  const { session, login } = useAuth();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [error, setError] = useState("");

  if (session) {
    navigate("/");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedUsername = username.trim().toLowerCase();
    const parsedAge = parseInt(age, 10);

    if (!trimmedUsername) {
      setError("Username is required");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }

    if (isNaN(parsedAge) || parsedAge < 13 || parsedAge > 120) {
      setError("Age must be 13 or older");
      return;
    }

    login(trimmedUsername, parsedAge);
    addCoins(trimmedUsername, parsedAge, "Welcome bonus", 10);
    pushNotification(trimmedUsername, {
      username: trimmedUsername,
      type: "system",
      message: "Welcome to DAH! You earned 10 DAH Coins.",
    });
    navigate("/");
  };

  const features = [
    { icon: Users, title: "Connect", desc: "Follow friends and creators" },
    { icon: Video, title: "Share", desc: "Post videos and content" },
    { icon: ShoppingBag, title: "Shop", desc: "Buy and sell in the Mall" },
    { icon: Sparkles, title: "Earn", desc: "Get DAH Coins for activity" },
  ];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid md:grid-cols-2 gap-8 items-center min-h-[calc(100vh-200px)]">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold">
                <span className="text-gradient-dah">Welcome to DAH</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                The social platform where you connect, create, and earn.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div key={f.title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-10 h-10 rounded-lg bg-dah-gradient-strong flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{f.title}</div>
                      <div className="text-xs text-muted-foreground">{f.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Card className="p-6 space-y-6 border-gradient-dah">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">Join DAH</h2>
              <p className="text-muted-foreground text-sm">
                Create your account to start earning DAH Coins
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-muted/50 border-0"
                  data-testid="input-username"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  min="13"
                  max="120"
                  placeholder="Your age (13+)"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="bg-muted/50 border-0"
                  data-testid="input-age"
                />
                <p className="text-xs text-muted-foreground">
                  Users 13-17 earn double coins: half now, half locked for college.
                </p>
              </div>

              {error && (
                <p className="text-destructive text-sm" data-testid="text-login-error">
                  {error}
                </p>
              )}

              <Button type="submit" className="w-full bg-dah-gradient-strong" data-testid="button-login-submit">
                Join DAH
              </Button>
            </form>

            <div className="text-center text-xs text-muted-foreground">
              Demo app. Data stored locally in your browser.
            </div>
          </Card>
        </div>
      </div>
    </main>
  );
}
