import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/components/AuthProvider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import VideoPage from "@/pages/video";
import MallPage from "@/pages/mall";
import StorePage from "@/pages/store";
import ProfilePage from "@/pages/profile";
import NotificationsPage from "@/pages/notifications";
import LoginPage from "@/pages/login";
import InboxPage from "@/pages/inbox";

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
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
