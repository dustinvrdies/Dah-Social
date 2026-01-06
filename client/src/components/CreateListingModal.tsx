import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { uploadFiles, type UploadedFile } from "@/lib/uploadsApi";
import { createListing } from "@/lib/listingsApi";
import { ImagePlus, X, PlusCircle } from "lucide-react";

const categories = [
  "electronics",
  "fashion",
  "home",
  "collectibles",
  "services",
  "vehicles",
  "flea-market",
  "trade",
  "other",
];

export function CreateListingModal({ onCreated }: { onCreated?: () => void }) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("electronics");
  const [condition, setCondition] = useState<"new" | "like-new" | "used" | "for-parts">("used");
  const [price, setPrice] = useState("0");
  const [location, setLocation] = useState("");
  const [attachments, setAttachments] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const canSubmit = title.trim().length >= 2 && !saving && !uploading;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button disabled={!session} className="gap-2" data-testid="button-create-listing">
          <PlusCircle className="h-4 w-4" />
          Create listing
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create a listing</DialogTitle>
        </DialogHeader>

        {!session && (
          <div className="rounded-md border border-border/60 bg-muted/20 p-3 text-sm text-muted-foreground">
            Please log in to create a listing.
          </div>
        )}

        <div className="grid gap-3">
          <div className="grid gap-1">
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., iPhone 13 Pro, like new" data-testid="input-listing-title" />
          </div>

          <div className="grid gap-1">
            <Label>Description</Label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add details buyers care about..." data-testid="input-listing-description" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Category</Label>
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)} data-testid="select-listing-category">
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="grid gap-1">
              <Label>Condition</Label>
              <select className="h-9 rounded-md border border-input bg-background px-2 text-sm" value={condition} onChange={(e) => setCondition(e.target.value as any)} data-testid="select-listing-condition">
                <option value="new">new</option>
                <option value="like-new">like-new</option>
                <option value="used">used</option>
                <option value="for-parts">for-parts</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="grid gap-1">
              <Label>Price (USD)</Label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} inputMode="decimal" placeholder="0.00" data-testid="input-listing-price" />
            </div>

            <div className="grid gap-1">
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="City / pickup notes" data-testid="input-listing-location" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-border/60 bg-background px-3 py-2 text-sm hover:bg-accent/40">
                <ImagePlus className="h-4 w-4" />
                Add photos/videos
                <input
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*,video/mp4,video/webm,video/quicktime"
                  data-testid="input-listing-media"
                  onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    if (!files.length) return;
                    setUploading(true);
                    setErr(null);
                    try {
                      const uploaded = await uploadFiles(files);
                      setAttachments((cur) => [...cur, ...uploaded].slice(0, 12));
                    } catch (ex: any) {
                      setErr(ex?.message || "Upload failed");
                    } finally {
                      setUploading(false);
                      e.currentTarget.value = "";
                    }
                  }}
                />
              </label>

              {uploading && <div className="text-sm text-muted-foreground">Uploading...</div>}
              <div className="text-xs text-muted-foreground ml-auto">Max 25MB per file.</div>
            </div>

            {attachments.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {attachments.map((a, i) => (
                  <div key={a.url} className="relative overflow-hidden rounded-lg border border-border/50 bg-muted/20">
                    {a.type === "image" ? (
                      <img src={a.url} className="h-24 w-full object-cover" alt="" />
                    ) : (
                      <video src={a.url} className="h-24 w-full object-cover" muted playsInline />
                    )}
                    <button
                      type="button"
                      className="absolute right-1 top-1 rounded bg-background/80 p-1 hover:bg-background"
                      onClick={() => setAttachments((cur) => cur.filter((_, idx) => idx !== i))}
                      aria-label="Remove attachment"
                      data-testid={`button-remove-attachment-${i}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {err && <div className="text-sm text-red-400">{err}</div>}

          <Button
            disabled={!session || !canSubmit}
            data-testid="button-publish-listing"
            onClick={async () => {
              if (!session) return;
              setSaving(true);
              setErr(null);
              try {
                const dollars = Number(price || "0");
                const priceCents = Number.isFinite(dollars) ? Math.max(0, Math.round(dollars * 100)) : 0;

                await createListing({
                  title,
                  description,
                  category,
                  condition,
                  priceCents,
                  currency: "USD",
                  location: location || undefined,
                  media: attachments.map((a) => ({ url: a.url, type: a.type })),
                });

                setOpen(false);
                setTitle("");
                setDescription("");
                setPrice("0");
                setLocation("");
                setAttachments([]);
                onCreated?.();
              } catch (ex: any) {
                setErr(ex?.message || "Failed to create listing");
              } finally {
                setSaving(false);
              }
            }}
          >
            {saving ? "Creating..." : "Publish listing"}
          </Button>

          <div className="text-xs text-muted-foreground">
            Safety tip: meet in public places, verify items, and avoid sending money off-platform.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
