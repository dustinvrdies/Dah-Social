import { useState, useRef } from "react";
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
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Image, Video, X, RotateCw } from "lucide-react";

interface CreatePostModalProps {
  onPostCreated: (posts: Post[]) => void;
}

export function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const { session } = useAuth();
  const [open, setOpen] = useState(false);
  const [postType, setPostType] = useState<"text" | "listing">("text");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | null>(null);
  const [rotation, setRotation] = useState(0);
  const [listingTitle, setListingTitle] = useState("");
  const [listingPrice, setListingPrice] = useState("");
  const [listingLocation, setListingLocation] = useState("");
  const [listingMedia, setListingMedia] = useState<string | null>(null);
  const [listingCategory, setListingCategory] = useState<ListingCategory>("flea-market");
  
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const listingImageRef = useRef<HTMLInputElement>(null);

  if (!session) return null;

  const resetForm = () => {
    setContent("");
    setMedia(null);
    setMediaType(null);
    setRotation(0);
    setListingTitle("");
    setListingPrice("");
    setListingLocation("");
    setListingMedia(null);
    setListingCategory("flea-market");
    setPostType("text");
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video", forListing = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (forListing) {
        setListingMedia(result);
      } else {
        setMedia(result);
        setMediaType(type);
        setRotation(0);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveMedia = () => {
    setMedia(null);
    setMediaType(null);
    setRotation(0);
  };

  const handleRotate = () => {
    setRotation((r) => (r + 90) % 360);
  };

  const handleCreateTextPost = () => {
    if (!content.trim() && !media) return;

    const newPost: Post = {
      id: `p-${Date.now()}`,
      type: "text",
      user: session.username,
      content: content.trim(),
    };

    const updated = addPost(newPost, initialFeed, media || undefined);
    onPostCreated(updated);
    resetForm();
    setOpen(false);

    addCoins(session.username, session.age, "Created a post", 5);
    pushNotification(session.username, {
      username: session.username,
      type: "coin",
      message: "+5 DAH Coins added to your balance.",
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

    const updated = addPost(newPost, initialFeed, listingMedia || undefined);
    onPostCreated(updated);
    resetForm();
    setOpen(false);

    addCoins(session.username, session.age, "Created a listing", 10);
    pushNotification(session.username, {
      username: session.username,
      type: "coin",
      message: "+10 DAH Coins added to your balance.",
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New</DialogTitle>
          <DialogDescription>Share a post or list something for sale</DialogDescription>
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
              rows={3}
              className="resize-none"
              data-testid="input-post-content"
            />
            
            {media && (
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <div className="absolute top-2 right-2 z-10 flex gap-1">
                  {mediaType === "image" && (
                    <Button 
                      size="icon" 
                      variant="secondary" 
                      onClick={handleRotate}
                      data-testid="button-rotate-media"
                    >
                      <RotateCw className="w-4 h-4" />
                    </Button>
                  )}
                  <Button 
                    size="icon" 
                    variant="destructive" 
                    onClick={handleRemoveMedia}
                    data-testid="button-remove-media"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                {mediaType === "image" ? (
                  <img 
                    src={media} 
                    alt="Preview" 
                    className="w-full max-h-64 object-contain"
                    style={{ transform: `rotate(${rotation}deg)` }}
                  />
                ) : (
                  <video 
                    src={media} 
                    controls 
                    className="w-full max-h-64"
                  />
                )}
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <input
                ref={imageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "image")}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e, "video")}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => imageInputRef.current?.click()}
                data-testid="button-add-image"
              >
                <Image className="w-4 h-4 mr-1" />
                Photo
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => videoInputRef.current?.click()}
                data-testid="button-add-video"
              >
                <Video className="w-4 h-4 mr-1" />
                Video
              </Button>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} data-testid="button-cancel-post">
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTextPost} 
                disabled={!content.trim() && !media}
                className="bg-dah-gradient-strong"
                data-testid="button-submit-post"
              >
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
            
            {listingMedia ? (
              <div className="relative rounded-lg overflow-hidden bg-muted">
                <Button 
                  size="icon" 
                  variant="destructive" 
                  className="absolute top-2 right-2 z-10"
                  onClick={() => setListingMedia(null)}
                  data-testid="button-remove-listing-media"
                >
                  <X className="w-4 h-4" />
                </Button>
                <img 
                  src={listingMedia} 
                  alt="Listing preview" 
                  className="w-full max-h-48 object-contain"
                />
              </div>
            ) : (
              <div 
                onClick={() => listingImageRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <input
                  ref={listingImageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileSelect(e, "image", true)}
                />
                <Image className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to add product photo</p>
              </div>
            )}
            
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
              <Button 
                onClick={handleCreateListing} 
                disabled={!listingTitle.trim()}
                className="bg-dah-gradient-strong"
                data-testid="button-submit-listing"
              >
                Create Listing
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
