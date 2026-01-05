import { MainNav } from "@/components/MainNav";
import { Feed } from "@/components/Feed";
import { StoryBubbles } from "@/components/StoryBubbles";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-2xl mx-auto">
        <div className="border-b border-border/50">
          <StoryBubbles />
        </div>
        <div className="p-4">
          <Feed />
        </div>
      </div>
    </main>
  );
}
