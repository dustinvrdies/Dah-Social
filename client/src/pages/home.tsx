import { MainNav } from "@/components/MainNav";
import { Feed } from "@/components/Feed";
import { ImaginationBubbles } from "@/components/ImaginationBubbles";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-2xl mx-auto">
        <div className="border-b border-border/50">
          <ImaginationBubbles />
        </div>
        <div className="p-4">
          <Feed />
        </div>
      </div>
    </main>
  );
}
