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
      message: "Welcome to DAH Social! You earned 10 DAH Coins.",
    });
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-md mx-auto p-6 space-y-6">
        <Card className="p-6 space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-primary">Welcome to DAH Social</h1>
            <p className="text-muted-foreground text-sm">
              Create your account to start earning DAH Coins
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
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
                data-testid="input-age"
              />
              <p className="text-xs text-muted-foreground">
                Users 13-17 earn double coins: half available now, half locked for college.
              </p>
            </div>

            {error && (
              <p className="text-destructive text-sm" data-testid="text-login-error">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" data-testid="button-login-submit">
              Join DAH Social
            </Button>
          </form>

          <div className="text-center text-xs text-muted-foreground">
            This is a demo app. No real authentication is performed.
            <br />
            Data is stored locally in your browser.
          </div>
        </Card>
      </div>
    </main>
  );
}
