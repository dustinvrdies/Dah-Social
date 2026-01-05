import { useState } from "react";
import { Input } from "@/components/ui/input";

export function Comments() {
  const [comments, setComments] = useState<string[]>([]);
  const [input, setInput] = useState("");

  return (
    <div className="mt-2 text-sm space-y-2">
      {comments.map((c, i) => (
        <div key={i} className="bg-muted p-2 rounded-md" data-testid={`text-comment-${i}`}>
          {c}
        </div>
      ))}
      <Input
        placeholder="Add a comment"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && input.trim()) {
            setComments([...comments, input]);
            setInput("");
          }
        }}
        data-testid="input-comment"
      />
    </div>
  );
}
