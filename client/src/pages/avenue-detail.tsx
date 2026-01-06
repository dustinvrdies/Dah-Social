import { useState } from "react";
import { useRoute, Link } from "wouter";
import { MainNav } from "@/components/MainNav";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/components/AuthProvider";
import {
  getAvenueByName,
  getAvenuePosts,
  getAvenueRules,
  isSubscribed,
  subscribeToAvenue,
  unsubscribeFromAvenue,
  sortPosts,
  createPost,
  voteOnPost,
  getPostVote,
  formatCount,
  type SortOption,
  type TimeFilter,
  type PostType,
  type Flair,
  type AvenuePost,
} from "@/lib/avenues";
import { 
  ArrowBigUp, 
  ArrowBigDown, 
  MessageSquare, 
  Award, 
  Share2, 
  Bookmark, 
  MoreHorizontal,
  Plus,
  Users,
  Calendar,
  Shield,
  Flame,
  Clock,
  TrendingUp,
  Zap,
  Pin,
  Lock,
  Image as ImageIcon,
  Video,
  LinkIcon,
  BarChart3,
  FileText,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function AvenueDetailPage() {
  const [, params] = useRoute("/av/:name");
  const { session } = useAuth();
  const [sort, setSort] = useState<SortOption>("hot");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [createPostOpen, setCreatePostOpen] = useState(false);
  const [, setRefresh] = useState(0);

  const avenue = params?.name ? getAvenueByName(params.name) : null;
  
  if (!avenue) {
    return (
      <div className="min-h-screen bg-background">
        <MainNav />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Avenue not found</h1>
          <p className="text-muted-foreground mb-4">The avenue you're looking for doesn't exist.</p>
          <Link href="/avenues">
            <Button>Browse Avenues</Button>
          </Link>
        </div>
      </div>
    );
  }

  const posts = sortPosts(getAvenuePosts(avenue.id), sort, timeFilter);
  const rules = getAvenueRules(avenue.id);
  const subscribed = isSubscribed(avenue.id);

  const handleSubscribe = () => {
    if (subscribed) {
      unsubscribeFromAvenue(avenue.id);
    } else {
      subscribeToAvenue(avenue.id);
    }
    setRefresh(r => r + 1);
  };

  const handleVote = (postId: string, value: 1 | -1) => {
    voteOnPost(avenue.id, postId, value);
    setRefresh(r => r + 1);
  };

  const handleCreatePost = (data: {
    title: string;
    content: string;
    type: PostType;
    mediaUrl?: string;
    linkUrl?: string;
    pollOptions?: string[];
    flair?: Flair;
  }) => {
    createPost(avenue.id, data);
    setCreatePostOpen(false);
    setRefresh(r => r + 1);
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      
      <main className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar className="w-16 h-16 border-4 border-background">
                    <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/40 text-primary text-xl font-bold">
                      {avenue.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">a/{avenue.name}</h1>
                    <p className="text-muted-foreground">{avenue.displayName}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {formatCount(avenue.memberCount)} members
                      </span>
                      <Badge variant="secondary">{avenue.category}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {session && (
                      <Dialog open={createPostOpen} onOpenChange={setCreatePostOpen}>
                        <DialogTrigger asChild>
                          <Button data-testid="button-create-post">
                            <Plus className="w-4 h-4 mr-2" />
                            Post
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Create a Post in a/{avenue.name}</DialogTitle>
                          </DialogHeader>
                          <CreatePostForm 
                            flairs={avenue.flairs} 
                            onSubmit={handleCreatePost}
                            onCancel={() => setCreatePostOpen(false)}
                          />
                        </DialogContent>
                      </Dialog>
                    )}
                    <Button
                      variant={subscribed ? "outline" : "default"}
                      onClick={handleSubscribe}
                      data-testid="button-subscribe"
                    >
                      {subscribed ? "Joined" : "Join"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <SortButton icon={Flame} label="Hot" active={sort === "hot"} onClick={() => setSort("hot")} />
              <SortButton icon={Clock} label="New" active={sort === "new"} onClick={() => setSort("new")} />
              <SortButton icon={TrendingUp} label="Top" active={sort === "top"} onClick={() => setSort("top")} />
              <SortButton icon={Zap} label="Rising" active={sort === "rising"} onClick={() => setSort("rising")} />
              
              {sort === "top" && (
                <Select value={timeFilter} onValueChange={(v) => setTimeFilter(v as TimeFilter)}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hour">Hour</SelectItem>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">Week</SelectItem>
                    <SelectItem value="month">Month</SelectItem>
                    <SelectItem value="year">Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-3">
              {posts.filter(p => !p.isRemoved).map(post => (
                <PostCard 
                  key={post.id} 
                  post={post} 
                  avenueId={avenue.id}
                  avenueName={avenue.name}
                  onVote={handleVote}
                />
              ))}

              {posts.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">No posts yet</h3>
                    <p className="text-muted-foreground mb-4">Be the first to post in this Avenue!</p>
                    {session && (
                      <Button onClick={() => setCreatePostOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <aside className="w-full md:w-80 space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm">{avenue.description}</p>
                <Separator />
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDistanceToNow(avenue.createdAt)} ago</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Rules
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {rules.map((rule, idx) => (
                  <div key={rule.id} className="text-sm">
                    <p className="font-medium">{idx + 1}. {rule.title}</p>
                    <p className="text-muted-foreground text-xs">{rule.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {avenue.flairs.length > 0 && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Flairs</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {avenue.flairs.map(flair => (
                      <Badge 
                        key={flair.id}
                        style={{ backgroundColor: flair.bgColor, color: flair.color }}
                      >
                        {flair.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

function SortButton({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: typeof Flame;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <Button
      variant={active ? "default" : "ghost"}
      size="sm"
      onClick={onClick}
      data-testid={`button-sort-${label.toLowerCase()}`}
    >
      <Icon className="w-4 h-4 mr-1" />
      {label}
    </Button>
  );
}

function PostCard({
  post,
  avenueId,
  avenueName,
  onVote,
}: {
  post: AvenuePost;
  avenueId: string;
  avenueName: string;
  onVote: (postId: string, value: 1 | -1) => void;
}) {
  const vote = getPostVote(post.id);
  const score = post.upvotes - post.downvotes;

  return (
    <Card className="hover-elevate">
      <CardContent className="p-0">
        <div className="flex">
          <div className="flex flex-col items-center p-2 bg-muted/30 gap-1">
            <Button
              variant="ghost"
              size="icon"
              className={vote === 1 ? "text-primary" : "text-muted-foreground"}
              onClick={() => onVote(post.id, 1)}
              data-testid={`button-upvote-${post.id}`}
            >
              <ArrowBigUp className="w-6 h-6" />
            </Button>
            <span className={`text-sm font-medium ${score > 0 ? "text-primary" : score < 0 ? "text-destructive" : ""}`}>
              {formatCount(score)}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className={vote === -1 ? "text-destructive" : "text-muted-foreground"}
              onClick={() => onVote(post.id, -1)}
              data-testid={`button-downvote-${post.id}`}
            >
              <ArrowBigDown className="w-6 h-6" />
            </Button>
          </div>

          <div className="flex-1 p-3">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 flex-wrap">
              {post.isPinned && (
                <Badge variant="secondary" className="gap-1">
                  <Pin className="w-3 h-3" />
                  Pinned
                </Badge>
              )}
              {post.isLocked && (
                <Badge variant="secondary" className="gap-1">
                  <Lock className="w-3 h-3" />
                  Locked
                </Badge>
              )}
              <span>Posted by u/{post.author}</span>
              <span>{formatDistanceToNow(post.createdAt)} ago</span>
              {post.flair && (
                <Badge style={{ backgroundColor: post.flair.bgColor, color: post.flair.color }}>
                  {post.flair.name}
                </Badge>
              )}
              {post.awardCount > 0 && (
                <span className="flex items-center gap-1 text-amber-500">
                  <Award className="w-3 h-3" />
                  {post.awardCount}
                </span>
              )}
            </div>

            <Link href={`/av/${avenueName}/post/${post.id}`}>
              <h3 className="font-medium text-lg hover:text-primary transition-colors cursor-pointer" data-testid={`link-post-${post.id}`}>
                {post.title}
              </h3>
            </Link>

            {post.type === "text" && post.content && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{post.content}</p>
            )}

            {post.type === "image" && post.mediaUrl && (
              <div className="mt-2 rounded-md overflow-hidden max-h-96">
                <img src={post.mediaUrl} alt="" className="w-full object-cover" />
              </div>
            )}

            {post.type === "link" && post.linkUrl && (
              <a 
                href={post.linkUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
                {new URL(post.linkUrl).hostname}
              </a>
            )}

            {post.type === "poll" && post.pollOptions && (
              <div className="mt-2 space-y-2">
                {post.pollOptions.map(opt => {
                  const totalVotes = post.pollOptions!.reduce((sum, o) => sum + o.votes, 0);
                  const percent = totalVotes > 0 ? (opt.votes / totalVotes) * 100 : 0;
                  return (
                    <div key={opt.id} className="relative">
                      <div 
                        className="absolute inset-0 bg-primary/20 rounded"
                        style={{ width: `${percent}%` }}
                      />
                      <div className="relative flex items-center justify-between p-2 text-sm">
                        <span>{opt.text}</span>
                        <span className="text-muted-foreground">{opt.votes} votes</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-4 mt-3 text-muted-foreground">
              <Link href={`/av/${avenueName}/post/${post.id}`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  <MessageSquare className="w-4 h-4" />
                  {post.commentCount} Comments
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="gap-1">
                <Award className="w-4 h-4" />
                Award
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Share2 className="w-4 h-4" />
                Share
              </Button>
              <Button variant="ghost" size="sm" className="gap-1">
                <Bookmark className="w-4 h-4" />
                Save
              </Button>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function CreatePostForm({
  flairs,
  onSubmit,
  onCancel,
}: {
  flairs: Flair[];
  onSubmit: (data: {
    title: string;
    content: string;
    type: PostType;
    mediaUrl?: string;
    linkUrl?: string;
    pollOptions?: string[];
    flair?: Flair;
  }) => void;
  onCancel: () => void;
}) {
  const [type, setType] = useState<PostType>("text");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [pollOptions, setPollOptions] = useState<string[]>(["", ""]);
  const [selectedFlair, setSelectedFlair] = useState<Flair | undefined>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      content,
      type,
      mediaUrl: type === "image" || type === "video" ? mediaUrl : undefined,
      linkUrl: type === "link" ? linkUrl : undefined,
      pollOptions: type === "poll" ? pollOptions.filter(o => o.trim()) : undefined,
      flair: selectedFlair,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={type} onValueChange={(v) => setType(v as PostType)}>
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="text" className="gap-1">
            <FileText className="w-4 h-4" />
            <span className="hidden sm:inline">Text</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-1">
            <ImageIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Image</span>
          </TabsTrigger>
          <TabsTrigger value="video" className="gap-1">
            <Video className="w-4 h-4" />
            <span className="hidden sm:inline">Video</span>
          </TabsTrigger>
          <TabsTrigger value="link" className="gap-1">
            <LinkIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Link</span>
          </TabsTrigger>
          <TabsTrigger value="poll" className="gap-1">
            <BarChart3 className="w-4 h-4" />
            <span className="hidden sm:inline">Poll</span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="An interesting title"
          required
          data-testid="input-post-title"
        />
      </div>

      {type === "text" && (
        <div className="space-y-2">
          <Label htmlFor="content">Body (optional)</Label>
          <Textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Text (optional)"
            rows={6}
            data-testid="input-post-content"
          />
        </div>
      )}

      {(type === "image" || type === "video") && (
        <div className="space-y-2">
          <Label htmlFor="mediaUrl">{type === "image" ? "Image" : "Video"} URL</Label>
          <Input
            id="mediaUrl"
            value={mediaUrl}
            onChange={(e) => setMediaUrl(e.target.value)}
            placeholder={`https://example.com/${type}.${type === "image" ? "jpg" : "mp4"}`}
            data-testid="input-post-media"
          />
        </div>
      )}

      {type === "link" && (
        <div className="space-y-2">
          <Label htmlFor="linkUrl">Link URL</Label>
          <Input
            id="linkUrl"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com/article"
            data-testid="input-post-link"
          />
        </div>
      )}

      {type === "poll" && (
        <div className="space-y-2">
          <Label>Poll Options</Label>
          {pollOptions.map((opt, idx) => (
            <Input
              key={idx}
              value={opt}
              onChange={(e) => {
                const newOpts = [...pollOptions];
                newOpts[idx] = e.target.value;
                setPollOptions(newOpts);
              }}
              placeholder={`Option ${idx + 1}`}
              data-testid={`input-poll-option-${idx}`}
            />
          ))}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPollOptions([...pollOptions, ""])}
          >
            Add Option
          </Button>
        </div>
      )}

      {flairs.length > 0 && (
        <div className="space-y-2">
          <Label>Flair</Label>
          <div className="flex flex-wrap gap-2">
            {flairs.map(flair => (
              <Badge
                key={flair.id}
                variant={selectedFlair?.id === flair.id ? "default" : "outline"}
                className="cursor-pointer"
                style={selectedFlair?.id === flair.id ? { backgroundColor: flair.bgColor, color: flair.color } : {}}
                onClick={() => setSelectedFlair(selectedFlair?.id === flair.id ? undefined : flair)}
              >
                {flair.name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" data-testid="button-submit-post">
          Post
        </Button>
      </div>
    </form>
  );
}
