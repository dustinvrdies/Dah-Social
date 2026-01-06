import { MainNav } from "@/components/MainNav";
import { Feed } from "@/components/Feed";
import { Stories } from "@/components/Stories";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-2xl mx-auto">
        <div className="border-b border-border/50 px-4 py-3">
          <Stories />
        </div>
        <div className="p-4">
          <Feed />
        </div>
      </div>
    </main>
  );
}
