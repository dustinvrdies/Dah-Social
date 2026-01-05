import { MainNav } from "@/components/MainNav";
import { PostRenderer } from "@/components/PostRenderer";
import { videoOnlyFeed } from "@/lib/feedData";

export default function VideoPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <h1 className="text-2xl font-bold">Video</h1>
        {videoOnlyFeed.length === 0 ? (
          <p className="text-muted-foreground">No videos yet.</p>
        ) : (
          videoOnlyFeed.map((p) => <PostRenderer key={p.id} post={p} />)
        )}
      </div>
    </main>
  );
}
