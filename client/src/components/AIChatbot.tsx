import { useState, useRef, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Bot, X, Send, Loader2, Sparkles, Trash2, MessageCircle } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [pulse, setPulse] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    const timer = setTimeout(() => setPulse(false), 6000);
    return () => clearTimeout(timer);
  }, []);

  const createConversation = async () => {
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "DAH Chat" }),
      });
      const data = await res.json();
      return data.id;
    } catch {
      return null;
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      let convId = conversationId;
      if (!convId) {
        convId = await createConversation();
        if (!convId) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Sorry, I couldn't start a conversation. Please try again." },
          ]);
          setIsLoading(false);
          return;
        }
        setConversationId(convId);
      }

      const res = await fetch(`/api/conversations/${convId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: userMessage }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const text = decoder.decode(value, { stream: true });
          const lines = text.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) break;
              if (data.content) {
                assistantContent += data.content;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                  return updated;
                });
              }
            } catch {}
          }
        }
      }
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => m.content !== ""),
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setConversationId(null);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[70] sm:inset-auto sm:bottom-[7.5rem] sm:right-4 sm:w-[380px]" data-testid="container-ai-chatbot">
          <Card className="flex flex-col h-full sm:h-[520px] sm:rounded-lg rounded-none shadow-2xl border-primary/20">
            <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/50 bg-gradient-to-r from-primary/10 to-transparent">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">DAH AI</p>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <p className="text-[10px] text-muted-foreground">Online</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {messages.length > 0 && (
                  <Button variant="ghost" size="icon" onClick={clearChat} data-testid="button-clear-chat">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} data-testid="button-close-chatbot">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-base font-semibold mb-1">Hey! I'm DAH AI</p>
                  <p className="text-xs text-muted-foreground mb-5 max-w-[260px]">
                    Your personal assistant for all things DAH Social. Ask me anything!
                  </p>
                  <div className="space-y-2 w-full max-w-[280px]">
                    {["What is DAH Social?", "How do I earn DAH Coins?", "Tell me about DAH Games"].map((q) => (
                      <button
                        key={q}
                        onClick={() => {
                          setInput(q);
                          setTimeout(() => {
                            textareaRef.current?.focus();
                            handleSend();
                          }, 100);
                        }}
                        className="w-full text-left px-3 py-2.5 rounded-lg bg-muted/50 text-xs text-muted-foreground hover-elevate transition-colors flex items-center gap-2"
                        data-testid={`button-suggestion-${q.split(" ").slice(0, 3).join("-").toLowerCase()}`}
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "assistant" && (
                    <Avatar className="w-7 h-7 flex-shrink-0">
                      <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
                        <Bot className="w-3.5 h-3.5" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted rounded-bl-sm"
                    }`}
                    data-testid={`text-chat-message-${i}`}
                  >
                    <p className="whitespace-pre-wrap break-words text-xs leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}

              {isLoading && messages[messages.length - 1]?.content === "" && (
                <div className="flex gap-2">
                  <Avatar className="w-7 h-7 flex-shrink-0">
                    <AvatarFallback className="bg-primary/15 text-primary text-[10px]">
                      <Bot className="w-3.5 h-3.5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-3 py-2">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-3 border-t border-border/50">
              <div className="flex gap-2">
                <Textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask DAH AI anything..."
                  className="resize-none text-sm min-h-[36px] max-h-[80px]"
                  rows={1}
                  data-testid="input-chat-message"
                />
                <Button
                  size="icon"
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  data-testid="button-send-chat"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      <button
        onClick={() => { setIsOpen(!isOpen); setPulse(false); }}
        className="fixed bottom-[5.5rem] right-4 z-[70] w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center transition-transform active:scale-95"
        data-testid="button-open-chatbot"
        style={{
          boxShadow: "0 4px 20px rgba(var(--primary), 0.3), 0 2px 8px rgba(0,0,0,0.2)",
        }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Bot className="w-6 h-6" />
        )}
        {pulse && !isOpen && (
          <span className="absolute inset-0 rounded-full bg-primary/40 animate-ping" />
        )}
      </button>
    </>
  );
}
