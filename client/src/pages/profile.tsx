import { useEffect, useMemo, useState } from "react";
import { useRoute } from "wouter";
import { MainNav } from "@/components/MainNav";
import { ProfileBlocks } from "@/components/ProfileBlocks";
import { ProfileThemeProvider } from "@/components/ProfileThemeProvider";
import { ProfileThemeSwitcher } from "@/components/ProfileThemeSwitcher";
import { WalletSummary } from "@/components/WalletSummary";
import { useAuth } from "@/components/AuthProvider";
import { defaultTheme, ProfileTheme } from "@/lib/profileTheme";
import { follow, unfollow, isFollowing } from "@/lib/follows";
import { getReputation } from "@/lib/reputation";
import { pushNotification } from "@/lib/notifications";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "dah.profile.theme";

export default function ProfilePage() {
  const [, params] = useRoute("/profile/:username");
  const username = (params?.username || "unknown").trim().toLowerCase();
  const { session } = useAuth();

  const [theme, setTheme] = useState<ProfileTheme>(defaultTheme);
  const [following, setFollowing] = useState(false);

  const rep = useMemo(() => getReputation(username), [username]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTheme(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(theme));
    } catch {}
  }, [theme]);

  useEffect(() => {
    if (!session) return;
    setFollowing(isFollowing(session.username, username));
  }, [session, username]);

  const canFollow = session && session.username !== username;

  const toggleFollow = () => {
    if (!session) return;
    if (following) {
      unfollow(session.username, username);
      setFollowing(false);
    } else {
      follow(session.username, username);
      setFollowing(true);
      pushNotification(username, {
        username,
        type: "follow",
        message: `@${session.username} followed you.`,
      });
    }
  };

  return (
    <ProfileThemeProvider theme={theme}>
      <MainNav />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <Card className={`${theme.card} p-5 space-y-3`}>
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <div>
              <h1 className={`text-2xl font-bold ${theme.accent}`} data-testid="text-profile-username">
                @{username}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                MySpace-level customization with modern stability.
              </p>
            </div>

            {canFollow && (
              <Button
                variant={following ? "secondary" : "default"}
                size="sm"
                onClick={toggleFollow}
                data-testid="button-follow"
              >
                {following ? "Unfollow" : "Follow"}
              </Button>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Reputation: <span className="text-foreground">{rep.score}</span> · Verified sales:{" "}
            <span className="text-foreground">{rep.verifiedSales}</span>
          </div>

          {session?.username === username && <WalletSummary />}

          {session?.username === username && <ProfileThemeSwitcher setTheme={setTheme} />}
        </Card>

        <Card className={`${theme.card} p-5`}>
          <ProfileBlocks profileUsername={username} />
        </Card>
      </div>
    </ProfileThemeProvider>
  );
}
