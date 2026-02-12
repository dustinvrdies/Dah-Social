import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/AuthProvider";
import { EnvironmentBadge } from "@/components/EnvironmentBadge";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VideoPage from "@/pages/video";
import MallPage from "@/pages/mall";
import StorePage from "@/pages/store";
import ProfilePage from "@/pages/profile";
import NotificationsPage from "@/pages/notifications";
import LoginPage from "@/pages/login";
import InboxPage from "@/pages/inbox";
import LivePage from "@/pages/live";
import GroupsPage from "@/pages/groups";
import EventsPage from "@/pages/events";
import DiscoverPage from "@/pages/discover";
import QuestsPage from "@/pages/quests";
import DashboardPage from "@/pages/dashboard";
import AvenuesPage from "@/pages/avenues";
import AvenueDetailPage from "@/pages/avenue-detail";
import AvenuePostPage from "@/pages/avenue-post";
import TermsPage from "@/pages/terms";
import PrivacyPage from "@/pages/privacy";
import CommunityGuidelinesPage from "@/pages/community-guidelines";
import DMCAPage from "@/pages/dmca";
import AcceptableUsePage from "@/pages/acceptable-use";
import CookiePolicyPage from "@/pages/cookie-policy";
import VerificationPage from "@/pages/verification";
import GamesPage from "@/pages/games";
import SearchPage from "@/pages/search";
import RewardsPage from "@/pages/rewards";
import LeaderboardPage from "@/pages/leaderboard";
import { AIChatbot } from "@/components/AIChatbot";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/video" component={VideoPage} />
      <Route path="/mall" component={MallPage} />
      <Route path="/mall/store/:storeId" component={StorePage} />
      <Route path="/profile/:username" component={ProfilePage} />
      <Route path="/notifications" component={NotificationsPage} />
      <Route path="/inbox" component={InboxPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/live" component={LivePage} />
      <Route path="/groups" component={GroupsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/discover" component={DiscoverPage} />
      <Route path="/quests" component={QuestsPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/games" component={GamesPage} />
      <Route path="/avenues" component={AvenuesPage} />
      <Route path="/av/:name" component={AvenueDetailPage} />
      <Route path="/av/:name/post/:postId" component={AvenuePostPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/community-guidelines" component={CommunityGuidelinesPage} />
      <Route path="/dmca" component={DMCAPage} />
      <Route path="/acceptable-use" component={AcceptableUsePage} />
      <Route path="/cookie-policy" component={CookiePolicyPage} />
      <Route path="/verification" component={VerificationPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/rewards" component={RewardsPage} />
      <Route path="/leaderboard" component={LeaderboardPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <EnvironmentBadge env="dev" />
          <Router />
          <AIChatbot />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
