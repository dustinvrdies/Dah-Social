import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/AuthProvider";
import { 
  Edit2, Save, X, Plus, Trash2, GripVertical,
  Link as LinkIcon, Music, Heart, Image, Quote, 
  Sparkles, Move, Eye, EyeOff
} from "lucide-react";

type BlockType = "bio" | "links" | "interests" | "song" | "quote" | "gallery" | "custom";

interface ProfileBlock {
  id: string;
  type: BlockType;
  title: string;
  content: any;
  visible: boolean;
  order: number;
  style?: {
    background?: string;
    border?: string;
    textColor?: string;
  };
}

interface ProfileLayout {
  blocks: ProfileBlock[];
  theme: {
    accentColor: string;
    fontStyle: "modern" | "classic" | "playful";
    spacing: "compact" | "normal" | "spacious";
  };
}

const STORAGE_KEY_PREFIX = "dah.profile.layout.";
const DEFAULT_BLOCKS: ProfileBlock[] = [
  { id: "bio", type: "bio", title: "About Me", content: "", visible: true, order: 0 },
  { id: "links", type: "links", title: "My Links", content: [], visible: true, order: 1 },
  { id: "interests", type: "interests", title: "Interests", content: [], visible: true, order: 2 },
  { id: "song", type: "song", title: "Now Playing", content: "", visible: true, order: 3 },
  { id: "quote", type: "quote", title: "Favorite Quote", content: "", visible: false, order: 4 },
];

function loadLayout(username: string): ProfileLayout {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY_PREFIX}${username}`);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { 
    blocks: DEFAULT_BLOCKS,
    theme: { accentColor: "pink", fontStyle: "modern", spacing: "normal" }
  };
}

function saveLayout(username: string, layout: ProfileLayout) {
  localStorage.setItem(`${STORAGE_KEY_PREFIX}${username}`, JSON.stringify(layout));
}

interface DraggableProfileBlocksProps {
  profileUsername?: string;
}

export function DraggableProfileBlocks({ profileUsername }: DraggableProfileBlocksProps) {
  const { session } = useAuth();
  const viewingUsername = profileUsername || session?.username || "";
  const isOwner = session?.username === viewingUsername;

  const [layout, setLayout] = useState<ProfileLayout>(() => loadLayout(viewingUsername));
  const [editing, setEditing] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    setLayout(loadLayout(viewingUsername));
  }, [viewingUsername]);

  const handleSave = () => {
    saveLayout(viewingUsername, layout);
    setEditing(false);
  };

  const updateBlock = (id: string, updates: Partial<ProfileBlock>) => {
    setLayout(prev => ({
      ...prev,
      blocks: prev.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
    }));
  };

  const toggleVisibility = (id: string) => {
    updateBlock(id, { visible: !layout.blocks.find(b => b.id === id)?.visible });
  };

  const moveBlock = (fromIndex: number, toIndex: number) => {
    setLayout(prev => {
      const blocks = [...prev.blocks];
      const [moved] = blocks.splice(fromIndex, 1);
      blocks.splice(toIndex, 0, moved);
      return { ...prev, blocks: blocks.map((b, i) => ({ ...b, order: i })) };
    });
  };

  const addCustomBlock = () => {
    const id = `custom-${Date.now()}`;
    setLayout(prev => ({
      ...prev,
      blocks: [...prev.blocks, {
        id,
        type: "custom",
        title: "New Section",
        content: "",
        visible: true,
        order: prev.blocks.length,
      }]
    }));
  };

  const removeBlock = (id: string) => {
    setLayout(prev => ({
      ...prev,
      blocks: prev.blocks.filter(b => b.id !== id)
    }));
  };

  const visibleBlocks = layout.blocks.filter(b => b.visible).sort((a, b) => a.order - b.order);
  const hasContent = visibleBlocks.some(b => {
    if (b.type === "bio" || b.type === "song" || b.type === "quote" || b.type === "custom") {
      return b.content && b.content.trim();
    }
    if (b.type === "links" || b.type === "interests") {
      return Array.isArray(b.content) && b.content.length > 0;
    }
    return false;
  });

  const getBlockIcon = (type: BlockType) => {
    switch(type) {
      case "bio": return <Heart className="w-4 h-4" />;
      case "links": return <LinkIcon className="w-4 h-4" />;
      case "interests": return <Sparkles className="w-4 h-4" />;
      case "song": return <Music className="w-4 h-4" />;
      case "quote": return <Quote className="w-4 h-4" />;
      case "gallery": return <Image className="w-4 h-4" />;
      default: return <Edit2 className="w-4 h-4" />;
    }
  };

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap sticky top-0 bg-background/95 backdrop-blur-sm py-2 z-10">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <Move className="w-5 h-5" />
            Customize Profile
          </h3>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} className="bg-dah-gradient-strong">
              <Save className="w-4 h-4 mr-1" /> Save Layout
            </Button>
          </div>
        </div>

        <div className="grid gap-3">
          {layout.blocks.sort((a, b) => a.order - b.order).map((block, index) => (
            <Card 
              key={block.id}
              className={`p-4 transition-all ${!block.visible ? 'opacity-50' : ''} ${draggedId === block.id ? 'ring-2 ring-primary' : ''}`}
              draggable
              onDragStart={() => setDraggedId(block.id)}
              onDragEnd={() => setDraggedId(null)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggedId && draggedId !== block.id) {
                  const fromIndex = layout.blocks.findIndex(b => b.id === draggedId);
                  moveBlock(fromIndex, index);
                }
              }}
            >
              <div className="flex items-start gap-3">
                <div className="cursor-grab pt-1">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {getBlockIcon(block.type)}
                      <Input
                        value={block.title}
                        onChange={(e) => updateBlock(block.id, { title: e.target.value })}
                        className="h-8 w-40 text-sm font-medium"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8"
                        onClick={() => toggleVisibility(block.id)}
                      >
                        {block.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </Button>
                      {block.type === "custom" && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          onClick={() => removeBlock(block.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {(block.type === "bio" || block.type === "quote" || block.type === "custom") && (
                    <Textarea
                      value={block.content || ""}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder={`Enter your ${block.title.toLowerCase()}...`}
                      className="min-h-[80px]"
                    />
                  )}

                  {block.type === "song" && (
                    <Input
                      value={block.content || ""}
                      onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Artist - Song Title"
                    />
                  )}

                  {block.type === "links" && (
                    <LinksEditor
                      links={block.content || []}
                      onChange={(links) => updateBlock(block.id, { content: links })}
                    />
                  )}

                  {block.type === "interests" && (
                    <InterestsEditor
                      interests={block.content || []}
                      onChange={(interests) => updateBlock(block.id, { content: interests })}
                    />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="outline" className="w-full" onClick={addCustomBlock}>
          <Plus className="w-4 h-4 mr-2" />
          Add Custom Section
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
            <Move className="w-4 h-4 mr-1" /> Customize Layout
          </Button>
        </div>
      )}

      {!hasContent && isOwner && (
        <div className="text-center py-8 text-muted-foreground space-y-2">
          <Sparkles className="w-8 h-8 mx-auto text-primary/50" />
          <p className="font-medium">Make this space yours!</p>
          <p className="text-sm">Click Customize Layout to add your bio, links, interests, and more.</p>
          <p className="text-xs">Drag and drop blocks to arrange them however you want.</p>
        </div>
      )}

      {!hasContent && !isOwner && (
        <div className="text-center py-8 text-muted-foreground">
          <p>This user hasn't customized their profile yet.</p>
        </div>
      )}

      <div className="grid gap-4">
        {visibleBlocks.map(block => {
          const isEmpty = !block.content || 
            (Array.isArray(block.content) && block.content.length === 0) ||
            (typeof block.content === "string" && !block.content.trim());
          
          if (isEmpty && !isOwner) return null;

          return (
            <Card key={block.id} className="p-4 bg-card/50 backdrop-blur-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2">
                {getBlockIcon(block.type)}
                {block.title}
              </h3>

              {(block.type === "bio" || block.type === "quote" || block.type === "custom") && block.content && (
                <p className="text-muted-foreground whitespace-pre-wrap">{block.content}</p>
              )}

              {block.type === "song" && block.content && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Music className="w-4 h-4 text-primary animate-pulse" />
                  <span>{block.content}</span>
                </div>
              )}

              {block.type === "links" && Array.isArray(block.content) && block.content.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {block.content.map((link: {label: string, url: string}, i: number) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      <LinkIcon className="w-3 h-3" />
                      {link.label || link.url}
                    </a>
                  ))}
                </div>
              )}

              {block.type === "interests" && Array.isArray(block.content) && block.content.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {block.content.map((interest: string, i: number) => (
                    <Badge key={i} variant="secondary">{interest}</Badge>
                  ))}
                </div>
              )}

              {isEmpty && isOwner && (
                <p className="text-muted-foreground text-sm italic">
                  Click Customize Layout to add content here.
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function LinksEditor({ links, onChange }: { links: {label: string, url: string}[], onChange: (links: {label: string, url: string}[]) => void }) {
  const addLink = () => onChange([...links, { label: "", url: "" }]);
  const removeLink = (i: number) => onChange(links.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: "label" | "url", value: string) => {
    onChange(links.map((l, idx) => idx === i ? { ...l, [field]: value } : l));
  };

  return (
    <div className="space-y-2">
      {links.map((link, i) => (
        <div key={i} className="flex gap-2">
          <Input
            value={link.label}
            onChange={(e) => updateLink(i, "label", e.target.value)}
            placeholder="Label"
            className="flex-1"
          />
          <Input
            value={link.url}
            onChange={(e) => updateLink(i, "url", e.target.value)}
            placeholder="URL"
            className="flex-1"
          />
          <Button size="icon" variant="ghost" onClick={() => removeLink(i)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ))}
      <Button size="sm" variant="ghost" onClick={addLink}>
        <Plus className="w-4 h-4 mr-1" /> Add Link
      </Button>
    </div>
  );
}

function InterestsEditor({ interests, onChange }: { interests: string[], onChange: (interests: string[]) => void }) {
  const [newInterest, setNewInterest] = useState("");
  
  const addInterest = () => {
    if (newInterest.trim()) {
      onChange([...interests, newInterest.trim()]);
      setNewInterest("");
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          placeholder="Add an interest..."
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
        />
        <Button size="sm" onClick={addInterest} disabled={!newInterest.trim()}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        {interests.map((interest, i) => (
          <Badge key={i} variant="secondary" className="pr-1">
            {interest}
            <button onClick={() => onChange(interests.filter((_, idx) => idx !== i))} className="ml-1">
              <X className="w-3 h-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
