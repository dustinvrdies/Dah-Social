import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import {
  getConversations,
  getChatMessages,
  sendMessage,
  markMessagesRead,
  reactToMessage,
  deleteMessage,
  seedConversation,
  getTypingIndicator,
  setTypingIndicator,
  type Conversation,
  type Message,
} from "@/lib/inbox";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Search,
  Check,
  CheckCheck,
  Smile,
  Trash2,
  Reply,
  PenSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const REACTIONS = [
  { icon: "heart", label: "Heart" },
  { icon: "thumbsup", label: "Thumbs Up" },
  { icon: "fire", label: "Fire" },
  { icon: "laugh", label: "Laugh" },
  { icon: "sad", label: "Sad" },
  { icon: "clap", label: "Clap" },
];

const reactionDisplay: Record<string, string> = {
  heart: "heart",
  thumbsup: "thumbsup",
  fire: "fire",
  laugh: "laugh",
  sad: "sad",
  clap: "clap",
};

function ReactionIcon({ type, className }: { type: string; className?: string }) {
  const icons: Record<string, string> = {
    heart: "text-red-500",
    thumbsup: "text-blue-500",
    fire: "text-orange-500",
    laugh: "text-yellow-500",
    sad: "text-blue-400",
    clap: "text-green-500",
  };
  return (
    <span className={`text-xs font-bold ${icons[type] || "text-primary"} ${className || ""}`}>
      {type === "heart" ? "\u2764" : type === "thumbsup" ? "\uD83D\uDC4D" : type === "fire" ? "\uD83D\uDD25" : type === "laugh" ? "\uD83D\uDE02" : type === "sad" ? "\uD83D\uDE22" : "\uD83D\uDC4F"}
    </span>
  );
}

function ConversationList({
  conversations,
  onSelect,
  selectedId,
  onNewChat,
}: {
  conversations: Conversation[];
  onSelect: (convo: Conversation) => void;
  selectedId: string | null;
  onNewChat: () => void;
}) {
  const [search, setSearch] = useState("");

  const filtered = search
    ? conversations.filter(c =>
        c.participants.some(p => p.toLowerCase().includes(search.toLowerCase()))
      )
    : conversations;

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-border/50">
        <div className="flex items-center justify-between gap-2 mb-3">
          <h2 className="font-bold text-lg" data-testid="text-messages-title">Messages</h2>
          <Button size="icon" variant="ghost" onClick={onNewChat} data-testid="button-new-chat">
            <PenSquare className="w-4 h-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-9 bg-muted/50 border-0"
            value={search}
            onChange={e => setSearch(e.target.value)}
            data-testid="input-search-convos"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 && (
          <div className="text-center py-8">
            <MessageCircle className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No conversations yet</p>
          </div>
        )}
        {filtered.map(convo => {
          const other = convo.participants.find(p => p !== convo.participants[0]) || convo.participants[1];
          const isSelected = convo.id === selectedId;
          return (
            <div
              key={convo.id}
              onClick={() => onSelect(convo)}
              className={`flex items-center gap-3 p-3 cursor-pointer transition-colors ${
                isSelected ? "bg-primary/10" : "hover-elevate"
              } ${convo.unreadCount > 0 ? "font-medium" : ""}`}
              data-testid={`convo-${convo.id}`}
            >
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-muted text-xs">
                  {other.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold truncate">@{other}</span>
                  {convo.lastMessage && (
                    <span className="text-[10px] text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(convo.lastMessage.ts, { addSuffix: false })}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground truncate">
                    {convo.lastMessage?.body || "No messages"}
                  </p>
                  {convo.unreadCount > 0 && (
                    <Badge className="text-[10px] h-5 min-w-5 flex items-center justify-center flex-shrink-0">
                      {convo.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChatView({
  username,
  otherUser,
  onBack,
  onRefresh,
}: {
  username: string;
  otherUser: string;
  onBack: () => void;
  onRefresh: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [showReactions, setShowReactions] = useState<string | null>(null);
  const [typing, setTyping] = useState<{ user: string; ts: number } | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadMessages = useCallback(() => {
    const msgs = getChatMessages(username, otherUser);
    setMessages(msgs);
    markMessagesRead(username, otherUser);
  }, [username, otherUser]);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      loadMessages();
      setTyping(getTypingIndicator(username));
    }, 2000);
    return () => clearInterval(interval);
  }, [loadMessages, username]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(username, otherUser, input.trim(), replyTo?.id);
    setInput("");
    setReplyTo(null);
    setTypingIndicator(username, otherUser, false);
    loadMessages();
    onRefresh();
    setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleInputChange = (val: string) => {
    setInput(val);
    setTypingIndicator(username, otherUser, val.length > 0);
  };

  const handleReact = (msgId: string, reaction: string) => {
    reactToMessage(username, msgId, reaction);
    setShowReactions(null);
    loadMessages();
  };

  const handleDelete = (msgId: string) => {
    deleteMessage(username, msgId);
    loadMessages();
    onRefresh();
  };

  const replyToMessage = messages.find(m => m.id === replyTo?.id);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 p-3 border-b border-border/50">
        <Button size="icon" variant="ghost" onClick={onBack} data-testid="button-chat-back">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs bg-muted">
            {otherUser.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm" data-testid="text-chat-partner">@{otherUser}</p>
          {typing && (
            <p className="text-[10px] text-primary animate-pulse" data-testid="text-typing-indicator">typing...</p>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Start a conversation with @{otherUser}</p>
          </div>
        )}
        {messages.map((msg, i) => {
          const isMine = msg.from === username;
          const showAvatar = !isMine && (i === 0 || messages[i - 1]?.from !== msg.from);
          const replied = msg.replyTo ? messages.find(m => m.id === msg.replyTo) : null;

          return (
            <div
              key={msg.id}
              className={`flex gap-2 ${isMine ? "justify-end" : "justify-start"}`}
              data-testid={`msg-${msg.id}`}
            >
              {!isMine && (
                <div className="w-7 flex-shrink-0">
                  {showAvatar && (
                    <Avatar className="w-7 h-7">
                      <AvatarFallback className="text-[8px] bg-muted">
                        {msg.from.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              )}

              <div className={`max-w-[75%] group relative ${isMine ? "items-end" : "items-start"}`}>
                {replied && (
                  <div className="text-[10px] text-muted-foreground bg-muted/30 rounded px-2 py-0.5 mb-0.5 truncate">
                    <Reply className="w-2.5 h-2.5 inline mr-1" />
                    {replied.body.slice(0, 40)}{replied.body.length > 40 ? "..." : ""}
                  </div>
                )}
                <div
                  className={`px-3 py-2 rounded-2xl text-sm ${
                    isMine
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted/60 rounded-bl-sm"
                  }`}
                >
                  {msg.body}
                </div>

                {msg.reaction && (
                  <div className={`flex ${isMine ? "justify-end" : "justify-start"} -mt-1.5`}>
                    <span className="bg-muted/80 rounded-full px-1 py-0.5 text-xs border border-border/50">
                      <ReactionIcon type={msg.reaction} />
                    </span>
                  </div>
                )}

                <div className={`flex items-center gap-1 mt-0.5 ${isMine ? "justify-end" : "justify-start"}`}>
                  <span className="text-[9px] text-muted-foreground">
                    {formatDistanceToNow(msg.ts, { addSuffix: false })}
                  </span>
                  {isMine && (
                    <span className="text-[9px]">
                      {msg.read ? (
                        <CheckCheck className="w-3 h-3 text-primary inline" />
                      ) : (
                        <Check className="w-3 h-3 text-muted-foreground inline" />
                      )}
                    </span>
                  )}
                </div>

                <div className={`absolute top-0 ${isMine ? "-left-16" : "-right-16"} flex items-center gap-0.5 invisible group-hover:visible`}>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={() => setShowReactions(showReactions === msg.id ? null : msg.id)}
                    data-testid={`button-react-${msg.id}`}
                  >
                    <Smile className="w-3 h-3" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="w-6 h-6"
                    onClick={() => setReplyTo(msg)}
                    data-testid={`button-reply-${msg.id}`}
                  >
                    <Reply className="w-3 h-3" />
                  </Button>
                  {isMine && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="w-6 h-6"
                      onClick={() => handleDelete(msg.id)}
                      data-testid={`button-delete-${msg.id}`}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                {showReactions === msg.id && (
                  <div className={`absolute ${isMine ? "right-0" : "left-0"} -top-8 flex items-center gap-0.5 bg-card border border-border rounded-full px-1.5 py-0.5 shadow-lg z-10`}>
                    {REACTIONS.map(r => (
                      <button
                        key={r.icon}
                        onClick={() => handleReact(msg.id, r.icon)}
                        className="hover:scale-125 transition-transform p-0.5"
                        data-testid={`reaction-${r.icon}-${msg.id}`}
                      >
                        <ReactionIcon type={r.icon} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      {replyTo && (
        <div className="px-3 py-1.5 bg-muted/30 border-t border-border/50 flex items-center gap-2">
          <Reply className="w-3.5 h-3.5 text-primary flex-shrink-0" />
          <p className="text-xs text-muted-foreground flex-1 truncate">
            Replying to: {replyTo.body.slice(0, 50)}{replyTo.body.length > 50 ? "..." : ""}
          </p>
          <Button size="icon" variant="ghost" className="w-5 h-5" onClick={() => setReplyTo(null)}>
            <span className="text-xs">x</span>
          </Button>
        </div>
      )}

      <div className="p-3 border-t border-border/50">
        <div className="flex items-center gap-2">
          <Input
            ref={inputRef}
            placeholder="Type a message..."
            value={input}
            onChange={e => handleInputChange(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            className="flex-1 bg-muted/50 border-0"
            data-testid="input-chat-message"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!input.trim()}
            data-testid="button-send-message"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function NewChatDialog({
  username,
  onSelect,
  onClose,
}: {
  username: string;
  onSelect: (otherUser: string) => void;
  onClose: () => void;
}) {
  const [to, setTo] = useState("");

  const handleStart = () => {
    if (!to.trim()) return;
    onSelect(to.trim().toLowerCase());
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <Button size="icon" variant="ghost" onClick={onClose} data-testid="button-close-new-chat">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h3 className="font-bold">New Message</h3>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">To:</span>
        <Input
          placeholder="Username"
          value={to}
          onChange={e => setTo(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleStart()}
          className="flex-1 bg-muted/50 border-0"
          autoFocus
          data-testid="input-new-chat-to"
        />
        <Button size="sm" onClick={handleStart} disabled={!to.trim()} data-testid="button-start-chat">
          Chat
        </Button>
      </div>
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">Suggested</p>
        {["jessica_m", "marcus_t", "sarah_b", "dave_cooks", "alex_photos"].map(u => (
          <div
            key={u}
            onClick={() => onSelect(u)}
            className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover-elevate"
            data-testid={`suggested-${u}`}
          >
            <Avatar className="w-8 h-8">
              <AvatarFallback className="text-[10px] bg-muted">{u.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm">@{u}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function InboxPage() {
  const { session } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConvo, setSelectedConvo] = useState<Conversation | null>(null);
  const [chatPartner, setChatPartner] = useState<string | null>(null);
  const [showNewChat, setShowNewChat] = useState(false);

  useEffect(() => {
    if (!session) {
      navigate("/login");
      return;
    }
    seedConversation(session.username);
    refreshConvos();
  }, [session, navigate]);

  const refreshConvos = () => {
    if (!session) return;
    setConversations(getConversations(session.username));
  };

  const handleSelectConvo = (convo: Conversation) => {
    setSelectedConvo(convo);
    const other = convo.participants.find(p => p !== session!.username) || convo.participants[1];
    setChatPartner(other);
    setShowNewChat(false);
  };

  const handleNewChat = (otherUser: string) => {
    setChatPartner(otherUser);
    setSelectedConvo(null);
    setShowNewChat(false);
  };

  const handleBack = () => {
    setChatPartner(null);
    setSelectedConvo(null);
    refreshConvos();
  };

  if (!session) return null;

  const totalUnread = conversations.reduce((sum, c) => sum + c.unreadCount, 0);

  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto h-[calc(100vh-4rem)]">
        <Card className="h-full flex overflow-hidden">
          <div className={`${chatPartner ? "hidden md:flex" : "flex"} flex-col w-full md:w-80 border-r border-border/50 flex-shrink-0`}>
            {showNewChat ? (
              <NewChatDialog
                username={session.username}
                onSelect={handleNewChat}
                onClose={() => setShowNewChat(false)}
              />
            ) : (
              <ConversationList
                conversations={conversations}
                onSelect={handleSelectConvo}
                selectedId={selectedConvo?.id || null}
                onNewChat={() => setShowNewChat(true)}
              />
            )}
          </div>

          <div className={`${chatPartner ? "flex" : "hidden md:flex"} flex-col flex-1`}>
            {chatPartner ? (
              <ChatView
                username={session.username}
                otherUser={chatPartner}
                onBack={handleBack}
                onRefresh={refreshConvos}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <MessageCircle className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Select a conversation or start a new one</p>
                  <Button
                    variant="outline"
                    className="mt-3"
                    onClick={() => setShowNewChat(true)}
                    data-testid="button-start-conversation"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    New Message
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}
