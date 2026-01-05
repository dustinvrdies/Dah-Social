import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MainNav } from "@/components/MainNav";
import { useAuth } from "@/components/AuthProvider";
import { getInbox, getSentLetters, sendLetter, markAsRead, deleteLetter, Letter } from "@/lib/inbox";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Inbox, Send, PenSquare, Mail, MailOpen, Trash2, Reply, ArrowLeft, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function InboxPage() {
  const { session } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState("inbox");
  const [letters, setLetters] = useState<Letter[]>([]);
  const [sentLetters, setSentLetters] = useState<Letter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null);
  const [composeOpen, setComposeOpen] = useState(false);
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    refreshLetters();
  }, [session, navigate]);

  const refreshLetters = () => {
    if (!session) return;
    setLetters(getInbox(session.username));
    setSentLetters(getSentLetters(session.username));
  };

  const handleSend = () => {
    if (!session || !to.trim() || !subject.trim() || !body.trim()) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    sendLetter(session.username, to.trim().toLowerCase(), subject.trim(), body.trim());
    toast({ title: "Letter sent!", description: `Your letter to @${to} has been delivered.` });
    setTo("");
    setSubject("");
    setBody("");
    setComposeOpen(false);
    refreshLetters();
  };

  const handleLetterClick = (letter: Letter) => {
    if (!session) return;
    setSelectedLetter(letter);
    if (!letter.read && letter.to === session.username) {
      markAsRead(session.username, letter.id);
      refreshLetters();
    }
  };

  const handleDelete = (letter: Letter) => {
    if (!session) return;
    const isSent = letter.from === session.username;
    deleteLetter(session.username, letter.id, isSent);
    setSelectedLetter(null);
    refreshLetters();
    toast({ title: "Letter deleted" });
  };

  const handleReply = (letter: Letter) => {
    setTo(letter.from);
    setSubject(`Re: ${letter.subject}`);
    setBody("");
    setComposeOpen(true);
    setSelectedLetter(null);
  };

  if (!session) return null;

  const unreadCount = letters.filter(l => !l.read).length;

  return (
    <main className="min-h-screen bg-background text-foreground">
      <MainNav />
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-dah-gradient-strong flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">DAH Inbox</h1>
              <p className="text-sm text-muted-foreground">
                {unreadCount > 0 ? `${unreadCount} unread letter${unreadCount > 1 ? "s" : ""}` : "All caught up"}
              </p>
            </div>
          </div>

          <Dialog open={composeOpen} onOpenChange={setComposeOpen}>
            <DialogTrigger asChild>
              <Button className="bg-dah-gradient-strong" data-testid="button-compose">
                <PenSquare className="w-4 h-4 mr-2" />
                Compose
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Write a Letter</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    placeholder="Username"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    className="bg-muted/50 border-0"
                    data-testid="input-letter-to"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's this about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="bg-muted/50 border-0"
                    data-testid="input-letter-subject"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="body">Message</Label>
                  <Textarea
                    id="body"
                    placeholder="Write your message..."
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="min-h-[150px] bg-muted/50 border-0 resize-none"
                    data-testid="input-letter-body"
                  />
                </div>
                <Button onClick={handleSend} className="w-full bg-dah-gradient-strong" data-testid="button-send-letter">
                  <Send className="w-4 h-4 mr-2" />
                  Send Letter
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {selectedLetter ? (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={() => setSelectedLetter(null)} data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => handleReply(selectedLetter)} data-testid="button-reply">
                <Reply className="w-4 h-4 mr-2" />
                Reply
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDelete(selectedLetter)} data-testid="button-delete">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex items-start gap-4">
              <Avatar className="w-12 h-12 ring-2 ring-gradient-dah ring-offset-2 ring-offset-background">
                <AvatarFallback className="bg-dah-gradient text-white">
                  {selectedLetter.from.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold">@{selectedLetter.from}</span>
                  <span className="text-muted-foreground text-sm">to @{selectedLetter.to}</span>
                </div>
                <h2 className="text-xl font-bold mt-1">{selectedLetter.subject}</h2>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="w-3 h-3" />
                  {formatDistanceToNow(selectedLetter.ts, { addSuffix: true })}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{selectedLetter.body}</p>
            </div>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full bg-muted/50 p-1">
              <TabsTrigger value="inbox" className="flex-1 gap-2" data-testid="tab-inbox">
                <Inbox className="w-4 h-4" />
                Inbox
                {unreadCount > 0 && (
                  <Badge variant="secondary" className="bg-primary text-primary-foreground">
                    {unreadCount}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="sent" className="flex-1 gap-2" data-testid="tab-sent">
                <Send className="w-4 h-4" />
                Sent
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="mt-4 space-y-2">
              {letters.length === 0 ? (
                <Card className="p-8 text-center">
                  <Mail className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">Your inbox is empty</p>
                  <p className="text-sm text-muted-foreground">Letters from other users will appear here</p>
                </Card>
              ) : (
                letters.map((letter) => (
                  <Card
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    className={`p-4 cursor-pointer hover-elevate ${!letter.read ? "border-primary/50" : ""}`}
                    data-testid={`card-letter-${letter.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        {letter.read ? (
                          <MailOpen className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <Mail className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted">
                          {letter.from.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={`font-semibold text-sm ${!letter.read ? "text-foreground" : "text-muted-foreground"}`}>
                            @{letter.from}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(letter.ts, { addSuffix: true })}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${!letter.read ? "font-medium" : ""}`}>
                          {letter.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {letter.body.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="sent" className="mt-4 space-y-2">
              {sentLetters.length === 0 ? (
                <Card className="p-8 text-center">
                  <Send className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No sent letters yet</p>
                  <p className="text-sm text-muted-foreground">Letters you send will appear here</p>
                </Card>
              ) : (
                sentLetters.map((letter) => (
                  <Card
                    key={letter.id}
                    onClick={() => handleLetterClick(letter)}
                    className="p-4 cursor-pointer hover-elevate"
                    data-testid={`card-sent-${letter.id}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="pt-1">
                        <Send className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-muted">
                          {letter.to.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">To:</span>
                          <span className="font-semibold text-sm">@{letter.to}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(letter.ts, { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm truncate">{letter.subject}</p>
                        <p className="text-xs text-muted-foreground truncate">
                          {letter.body.slice(0, 60)}...
                        </p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
