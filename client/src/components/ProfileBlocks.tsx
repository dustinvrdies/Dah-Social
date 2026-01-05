import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Edit2, Save, X, Plus, Trash2, Link as LinkIcon, Music, Heart } from "lucide-react";

interface ProfileData {
  bio: string;
  links: { label: string; url: string }[];
  interests: string[];
  favoriteSong: string;
}

const STORAGE_KEY_PREFIX = "dah.profile.data.";

function getStorageKey(username: string) {
  return `${STORAGE_KEY_PREFIX}${username}`;
}

function loadProfileData(username: string): ProfileData {
  try {
    const raw = localStorage.getItem(getStorageKey(username));
    if (raw) return JSON.parse(raw);
  } catch {}
  return { bio: "", links: [], interests: [], favoriteSong: "" };
}

function saveProfileData(username: string, data: ProfileData) {
  localStorage.setItem(getStorageKey(username), JSON.stringify(data));
}

interface ProfileBlocksProps {
  profileUsername?: string;
}

export function ProfileBlocks({ profileUsername }: ProfileBlocksProps) {
  const { session } = useAuth();
  const viewingUsername = profileUsername || session?.username || "";
  const isOwner = session?.username === viewingUsername;

  const [data, setData] = useState<ProfileData>(() => loadProfileData(viewingUsername));
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData>(data);

  useEffect(() => {
    const loaded = loadProfileData(viewingUsername);
    setData(loaded);
    setEditData(loaded);
  }, [viewingUsername]);

  const handleSave = () => {
    saveProfileData(viewingUsername, editData);
    setData(editData);
    setEditing(false);
  };

  const handleCancel = () => {
    setEditData(data);
    setEditing(false);
  };

  const addLink = () => {
    setEditData(prev => ({
      ...prev,
      links: [...prev.links, { label: "", url: "" }]
    }));
  };

  const removeLink = (index: number) => {
    setEditData(prev => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index)
    }));
  };

  const updateLink = (index: number, field: "label" | "url", value: string) => {
    setEditData(prev => ({
      ...prev,
      links: prev.links.map((link, i) => 
        i === index ? { ...link, [field]: value } : link
      )
    }));
  };

  const [newInterest, setNewInterest] = useState("");

  const addInterest = () => {
    if (newInterest.trim()) {
      setEditData(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()]
      }));
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setEditData(prev => ({
      ...prev,
      interests: prev.interests.filter((_, i) => i !== index)
    }));
  };

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={handleCancel} data-testid="button-cancel-edit">
              <X className="w-4 h-4 mr-1" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} data-testid="button-save-profile">
              <Save className="w-4 h-4 mr-1" /> Save
            </Button>
          </div>
        </div>

        <section className="space-y-2">
          <label className="font-semibold text-sm">About Me</label>
          <Textarea
            value={editData.bio}
            onChange={(e) => setEditData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell people about yourself..."
            className="min-h-[100px]"
            data-testid="input-bio"
          />
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="font-semibold text-sm">Links</label>
            <Button size="sm" variant="ghost" onClick={addLink} data-testid="button-add-link">
              <Plus className="w-4 h-4 mr-1" /> Add Link
            </Button>
          </div>
          {editData.links.map((link, i) => (
            <div key={i} className="flex gap-2 items-center">
              <Input
                value={link.label}
                onChange={(e) => updateLink(i, "label", e.target.value)}
                placeholder="Label (e.g. Twitter)"
                className="flex-1"
                data-testid={`input-link-label-${i}`}
              />
              <Input
                value={link.url}
                onChange={(e) => updateLink(i, "url", e.target.value)}
                placeholder="URL"
                className="flex-1"
                data-testid={`input-link-url-${i}`}
              />
              <Button size="icon" variant="ghost" onClick={() => removeLink(i)} data-testid={`button-remove-link-${i}`}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </section>

        <section className="space-y-2">
          <label className="font-semibold text-sm">Interests</label>
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest..."
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addInterest())}
              data-testid="input-new-interest"
            />
            <Button size="sm" onClick={addInterest} disabled={!newInterest.trim()} data-testid="button-add-interest">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {editData.interests.map((interest, i) => (
              <Card key={i} className="px-3 py-1 flex items-center gap-2 text-sm">
                {interest}
                <button onClick={() => removeInterest(i)} className="text-muted-foreground" data-testid={`button-remove-interest-${i}`}>
                  <X className="w-3 h-3" />
                </button>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-2">
          <label className="font-semibold text-sm">Favorite Song</label>
          <Input
            value={editData.favoriteSong}
            onChange={(e) => setEditData(prev => ({ ...prev, favoriteSong: e.target.value }))}
            placeholder="What song represents you?"
            data-testid="input-favorite-song"
          />
        </section>
      </div>
    );
  }

  const hasContent = data.bio || data.links.length > 0 || data.interests.length > 0 || data.favoriteSong;

  return (
    <div className="space-y-4">
      {isOwner && (
        <div className="flex justify-end">
          <Button size="sm" variant="ghost" onClick={() => setEditing(true)} data-testid="button-edit-profile">
            <Edit2 className="w-4 h-4 mr-1" /> Customize
          </Button>
        </div>
      )}

      {!hasContent && isOwner && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="mb-2">Your profile is empty!</p>
          <p className="text-sm">Click Customize to add your bio, links, interests, and more.</p>
        </div>
      )}

      {!hasContent && !isOwner && (
        <div className="text-center py-8 text-muted-foreground">
          <p>This user hasn't customized their profile yet.</p>
        </div>
      )}

      {data.bio && (
        <section>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Heart className="w-4 h-4" /> About Me
          </h3>
          <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-bio">{data.bio}</p>
        </section>
      )}

      {data.links.length > 0 && (
        <section>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <LinkIcon className="w-4 h-4" /> Links
          </h3>
          <div className="flex flex-wrap gap-2">
            {data.links.map((link, i) => (
              <a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline text-sm"
                data-testid={`link-profile-${i}`}
              >
                {link.label || link.url}
              </a>
            ))}
          </div>
        </section>
      )}

      {data.interests.length > 0 && (
        <section>
          <h3 className="font-bold mb-2">Interests</h3>
          <div className="flex flex-wrap gap-2">
            {data.interests.map((interest, i) => (
              <Card key={i} className="px-3 py-1 text-sm" data-testid={`text-interest-${i}`}>
                {interest}
              </Card>
            ))}
          </div>
        </section>
      )}

      {data.favoriteSong && (
        <section>
          <h3 className="font-bold mb-2 flex items-center gap-2">
            <Music className="w-4 h-4" /> Favorite Song
          </h3>
          <p className="text-muted-foreground" data-testid="text-favorite-song">{data.favoriteSong}</p>
        </section>
      )}
    </div>
  );
}
