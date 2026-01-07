import { Link } from "wouter";
import { useAuth } from "./AuthProvider";
import { NotificationBell } from "./NotificationBell";
import { SearchBar } from "./SearchBar";
import { LogIn, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

export function AppHeader() {
  const { session } = useAuth();
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-card/98 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between gap-3 h-14 px-4 max-w-7xl mx-auto">
        <Link href="/" data-testid="link-home-logo">
          <span className="font-bold text-2xl text-gradient-dah tracking-tight">DAH</span>
        </Link>

        {showSearch ? (
          <div className="flex-1 max-w-md">
            <SearchBar 
              onSearch={(q) => {
                console.log("Searching for:", q);
                setShowSearch(false);
              }} 
            />
          </div>
        ) : (
          <div className="hidden sm:flex flex-1 max-w-md">
            <SearchBar onSearch={(q) => console.log("Searching for:", q)} />
          </div>
        )}

        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="sm:hidden"
            onClick={() => setShowSearch(!showSearch)}
            data-testid="button-search-toggle"
          >
            <Search className="w-5 h-5" />
          </Button>

          {session ? (
            <>
              <NotificationBell />
              <Link href={`/profile/${session.username}`}>
                <div className="ring-gradient-dah p-[2px] rounded-full cursor-pointer">
                  <Avatar className="w-8 h-8" data-testid="link-profile-avatar">
                    <AvatarImage src={undefined} />
                    <AvatarFallback className="bg-card text-sm font-medium">
                      {session.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            </>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="bg-dah-gradient-strong" data-testid="link-login">
                <LogIn className="w-4 h-4 mr-1.5" />
                Join
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
