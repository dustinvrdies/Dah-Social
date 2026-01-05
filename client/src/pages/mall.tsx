import { MainNav } from "@/components/MainNav";
import { MallLanding } from "@/components/MallLanding";
import { PostRenderer } from "@/components/PostRenderer";
import { mallOnlyFeed } from "@/lib/feedData";

export default function MallPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-3xl mx-auto p-6 space-y-6">
        <MallLanding />
        <div className="space-y-4">
          {mallOnlyFeed.map((p) => (
            <PostRenderer key={p.id} post={p} />
          ))}
        </div>
      </div>
    </main>
  );
}
