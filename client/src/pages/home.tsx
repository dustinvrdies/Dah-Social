import { MainNav } from "@/components/MainNav";
import { Feed } from "@/components/Feed";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-3xl mx-auto p-6">
        <Feed />
      </div>
    </main>
  );
}
