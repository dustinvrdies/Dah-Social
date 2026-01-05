import { useState } from "react";
import { useAuth } from "./AuthProvider";
import { addPost } from "@/lib/posts";
import { initialFeed } from "@/lib/feedData";
import { addCoins } from "@/lib/dahCoins";
import { pushNotification } from "@/lib/notifications";
import { Post, ListingCategory } from "@/lib/postTypes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus } from "lucide-react";

interface CreatePostModalProps {
  onPostCreated: (posts: Post[]) => void;
}

export function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<"text" | "listing">("text");
  const [content, setContent] = useState("");
  const [listingTitle, setListingTitle] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingLocation, setListingLocation] = useState("");
  const [listingCategory, setListingCategory] = useState<ListingCategory>("flea-market");

  if (!session) return null;

  const resetForm = () => {
    setContent("");
    setListingTitle("");
    setListingPrice("");
    setListingLocation("");
    setListingCategory("flea-market");
    setPostType("text");
  };

  const handleCreateTextPost = () => {
    if (!content.trim()) return;

    const newPost: Post = {
      id: `p-${Date.now()}`,
      type: "text",
      user: session.username,
      content: content.trim(),
    };

    const updated = addPost(newPost, initialFeed);
    onPostCreated(updated);
    resetForm();
    setOpen(false);

    addCoins(session.username, session.age, "Created a post", 5);
    pushNotification(session.username, {
      username: session.username,
      type: "coin",
      message: "You earned 5 DAH Coins for creating a post.",
    });
  };

  const handleCreateListing = () => {
    if (!listingTitle.trim()) return;

    const newPost: Post = {
      id: `m-${Date.now()}`,
      type: "listing",
      user: session.username,
      title: listingTitle.trim(),
      price: parseFloat(listingPrice) || 0,
      location: listingLocation.trim() || "Not specified",
      category: listingCategory,
    };

    const updated = addPost(newPost, initialFeed);
    onPostCreated(updated);
    resetForm();
    setOpen(false);

    addCoins(session.username, session.age, "Created a listing", 10);
    pushNotification(session.username, {
      username: session.username,
      type: "coin",
      message: "You earned 10 DAH Coins for creating a listing.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm(); }}>
      <DialogTrigger asChild>
        <Button data-testid="button-create-post">
          <Plus className="w-4 h-4 mr-1" />
          Create
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
        </DialogHeader>
        <Tabs value={postType} onValueChange={(v) => setPostType(v as "text" | "listing")}>
          <TabsList className="w-full">
            <TabsTrigger value="text" className="flex-1" data-testid="tab-text-post">Post</TabsTrigger>
            <TabsTrigger value="listing" className="flex-1" data-testid="tab-listing">Listing</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4 mt-4">
            <Textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              data-testid="input-post-content"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} data-testid="button-cancel-post">
                Cancel
              </Button>
              <Button onClick={handleCreateTextPost} disabled={!content.trim()} data-testid="button-submit-post">
                Post
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="listing" className="space-y-4 mt-4">
            <Input
              placeholder="What are you selling/trading?"
              value={listingTitle}
              onChange={(e) => setListingTitle(e.target.value)}
              data-testid="input-listing-title"
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Price (0 for trade)"
                value={listingPrice}
                onChange={(e) => setListingPrice(e.target.value)}
                data-testid="input-listing-price"
              />
              <Select value={listingCategory} onValueChange={(v) => setListingCategory(v as ListingCategory)}>
                <SelectTrigger data-testid="select-listing-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flea-market">Flea Market</SelectItem>
                  <SelectItem value="thrift-shop">Thrift Shop</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="exchange">Exchange</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Input
              placeholder="Location (e.g. Local pickup, Ships nationwide)"
              value={listingLocation}
              onChange={(e) => setListingLocation(e.target.value)}
              data-testid="input-listing-location"
            />
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} data-testid="button-cancel-listing">
                Cancel
              </Button>
              <Button onClick={handleCreateListing} disabled={!listingTitle.trim()} data-testid="button-submit-listing">
                Create Listing
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
