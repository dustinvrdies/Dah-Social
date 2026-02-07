import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { PageLayout } from "@/components/PageLayout";
import { useAuth } from "@/components/AuthProvider";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { addCoins, getWallet, spendCoins } from "@/lib/dahCoins";
import { lsGet, lsSet } from "@/lib/storage";
import {
  Gamepad2,
  Coins,
  Trophy,
  Zap,
  Brain,
  Palette,
  Grid3X3,
  Sparkles,
  Loader2,
  Play,
  RotateCcw,
  Crown,
  Star,
  Clock,
  Target,
  Wand2,
} from "lucide-react";

type GameId = "coin-rush" | "memory-match" | "trivia" | "color-match";

interface GameScore {
  gameId: string;
  score: number;
  coinsEarned: number;
  timestamp: number;
}

const SCORES_KEY = (u: string) => `dah.games.scores.${u}`;
const COOLDOWN_KEY = (u: string, g: string) => `dah.games.cooldown.${u}.${g}`;
const GAME_COOLDOWN_MS = 60 * 1000;

function getScores(username: string): GameScore[] {
  return lsGet<GameScore[]>(SCORES_KEY(username), []);
}

function addScore(username: string, score: GameScore) {
  const scores = getScores(username);
  scores.unshift(score);
  if (scores.length > 100) scores.length = 100;
  lsSet(SCORES_KEY(username), scores);
}

function canPlay(username: string, gameId: string): boolean {
  const last = lsGet<number>(COOLDOWN_KEY(username, gameId), 0);
  return Date.now() - last >= GAME_COOLDOWN_MS;
}

function markPlayed(username: string, gameId: string) {
  lsSet(COOLDOWN_KEY(username, gameId), Date.now());
}

function getCooldownRemaining(username: string, gameId: string): number {
  const last = lsGet<number>(COOLDOWN_KEY(username, gameId), 0);
  return Math.max(0, GAME_COOLDOWN_MS - (Date.now() - last));
}

const GAMES = [
  {
    id: "coin-rush" as GameId,
    title: "Coin Rush",
    description: "Tap falling coins before they disappear! Speed and reflexes win.",
    icon: Coins,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/10",
    reward: "Up to 15 DAH",
    difficulty: "Easy",
  },
  {
    id: "memory-match" as GameId,
    title: "Memory Match",
    description: "Find matching pairs of cards. Fewer moves = more coins!",
    icon: Grid3X3,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    reward: "Up to 20 DAH",
    difficulty: "Medium",
  },
  {
    id: "trivia" as GameId,
    title: "DAH Trivia",
    description: "Answer questions about social media, tech, and pop culture.",
    icon: Brain,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    reward: "Up to 25 DAH",
    difficulty: "Medium",
  },
  {
    id: "color-match" as GameId,
    title: "Color Match",
    description: "Match the color name to the actual color shown. Don't get tricked!",
    icon: Palette,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    reward: "Up to 20 DAH",
    difficulty: "Hard",
  },
];

function CoinRushGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [coins, setCoins] = useState<{ id: number; x: number; y: number; size: number }[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const nextId = useRef(0);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          clearInterval(timer);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) return;
    const spawner = setInterval(() => {
      const id = nextId.current++;
      setCoins((prev) => [
        ...prev,
        { id, x: 5 + Math.random() * 85, y: 5 + Math.random() * 75, size: 28 + Math.random() * 20 },
      ]);
      setTimeout(() => {
        setCoins((prev) => prev.filter((c) => c.id !== id));
      }, 1200);
    }, 400);
    return () => clearInterval(spawner);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) onComplete(score);
  }, [gameOver]);

  const tapCoin = (id: number) => {
    setCoins((prev) => prev.filter((c) => c.id !== id));
    setScore((s) => s + 1);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-yellow-500" />
          <span className="font-semibold tabular-nums" data-testid="text-coin-rush-score">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className={`font-semibold tabular-nums ${timeLeft <= 5 ? "text-red-500" : ""}`}>{timeLeft}s</span>
        </div>
      </div>

      <div
        className="relative w-full h-64 sm:h-80 rounded-lg bg-muted/30 border border-border/50 overflow-hidden select-none"
        data-testid="game-coin-rush-area"
      >
        {coins.map((coin) => (
          <button
            key={coin.id}
            onClick={() => tapCoin(coin.id)}
            className="absolute rounded-full bg-yellow-500 flex items-center justify-center cursor-pointer transition-transform active:scale-90 border-2 border-yellow-400"
            style={{
              left: `${coin.x}%`,
              top: `${coin.y}%`,
              width: coin.size,
              height: coin.size,
              animation: "pulse 0.6s ease-in-out infinite",
            }}
            data-testid={`button-coin-${coin.id}`}
          >
            <Coins className="w-3.5 h-3.5 text-yellow-900" />
          </button>
        ))}
        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-2">
              <Trophy className="w-10 h-10 text-yellow-500 mx-auto" />
              <p className="text-2xl font-bold">{score} coins caught!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const CARD_ICONS = ["star", "heart", "zap", "sun", "moon", "flame", "diamond", "crown"];

function MemoryMatchGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [cards, setCards] = useState<{ id: number; icon: string; flipped: boolean; matched: boolean }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchCount, setMatchCount] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const lockRef = useRef(false);

  useEffect(() => {
    const icons = CARD_ICONS.slice(0, 6);
    const pairs = [...icons, ...icons];
    const shuffled = pairs.sort(() => Math.random() - 0.5);
    setCards(shuffled.map((icon, i) => ({ id: i, icon, flipped: false, matched: false })));
  }, []);

  useEffect(() => {
    if (matchCount === 6 && !gameOver) {
      setGameOver(true);
      const score = Math.max(0, 20 - Math.floor(moves / 3));
      onComplete(score);
    }
  }, [matchCount]);

  const flipCard = (id: number) => {
    if (lockRef.current) return;
    const card = cards.find((c) => c.id === id);
    if (!card || card.flipped || card.matched) return;
    if (selected.length >= 2) return;

    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, flipped: true } : c)));
    const newSelected = [...selected, id];
    setSelected(newSelected);

    if (newSelected.length === 2) {
      setMoves((m) => m + 1);
      lockRef.current = true;
      const [first, second] = newSelected;
      const c1 = cards.find((c) => c.id === first)!;
      const c2 = cards.find((c) => c.id === second)!;

      if (c1.icon === c2.icon) {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, matched: true } : c))
          );
          setMatchCount((m) => m + 1);
          setSelected([]);
          lockRef.current = false;
        }, 400);
      } else {
        setTimeout(() => {
          setCards((prev) =>
            prev.map((c) => (c.id === first || c.id === second ? { ...c, flipped: false } : c))
          );
          setSelected([]);
          lockRef.current = false;
        }, 800);
      }
    }
  };

  const iconMap: Record<string, typeof Star> = {
    star: Star,
    heart: Zap,
    zap: Sparkles,
    sun: Target,
    moon: Brain,
    flame: Palette,
    diamond: Crown,
    crown: Trophy,
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Moves: <span className="font-semibold text-foreground tabular-nums">{moves}</span></span>
        <span className="text-sm text-muted-foreground">Matched: <span className="font-semibold text-foreground tabular-nums">{matchCount}/6</span></span>
      </div>
      <div className="grid grid-cols-4 gap-2" data-testid="game-memory-grid">
        {cards.map((card) => {
          const Icon = iconMap[card.icon] || Star;
          return (
            <button
              key={card.id}
              onClick={() => flipCard(card.id)}
              className={`aspect-square rounded-lg flex items-center justify-center transition-all duration-200 border ${
                card.matched
                  ? "bg-green-500/20 border-green-500/30"
                  : card.flipped
                  ? "bg-primary/10 border-primary/30"
                  : "bg-muted/50 border-border/50 hover-elevate cursor-pointer"
              }`}
              data-testid={`button-card-${card.id}`}
              disabled={card.matched}
            >
              {(card.flipped || card.matched) ? (
                <Icon className={`w-6 h-6 ${card.matched ? "text-green-500" : "text-primary"}`} />
              ) : (
                <Gamepad2 className="w-5 h-5 text-muted-foreground/40" />
              )}
            </button>
          );
        })}
      </div>
      {gameOver && (
        <div className="text-center py-3 space-y-1">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
          <p className="font-semibold">Completed in {moves} moves!</p>
        </div>
      )}
    </div>
  );
}

const TRIVIA_QUESTIONS = [
  { q: "Which platform was originally called 'Burbn'?", options: ["Snapchat", "Instagram", "TikTok", "Twitter"], answer: 1 },
  { q: "What year was YouTube founded?", options: ["2003", "2005", "2007", "2004"], answer: 1 },
  { q: "Which company owns WhatsApp?", options: ["Google", "Microsoft", "Meta", "Apple"], answer: 2 },
  { q: "What does 'NFT' stand for?", options: ["New File Type", "Non-Fungible Token", "Network File Transfer", "Next-Gen Financial Tool"], answer: 1 },
  { q: "Which social media platform uses a ghost as its logo?", options: ["Discord", "Snapchat", "Tumblr", "Reddit"], answer: 1 },
  { q: "What was the first message ever tweeted?", options: ["Hello world", "just setting up my twttr", "First tweet!", "Testing 1 2 3"], answer: 1 },
  { q: "Which platform is known for 'Subreddits'?", options: ["Quora", "Reddit", "Discord", "Tumblr"], answer: 1 },
  { q: "What does 'API' stand for in tech?", options: ["App Programming Interface", "Application Programming Interface", "Automated Program Input", "App Protocol Interface"], answer: 1 },
  { q: "Which company created the 'Like' button?", options: ["Twitter", "YouTube", "Facebook", "Instagram"], answer: 2 },
  { q: "What is the maximum character limit for a tweet (X post)?", options: ["140", "280", "500", "1000"], answer: 1 },
];

function TriviaGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [questions] = useState(() => {
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 5);
  });

  const selectAnswer = (index: number) => {
    if (selected !== null) return;
    setSelected(index);
    const correct = index === questions[currentQ].answer;
    if (correct) setScore((s) => s + 5);

    setTimeout(() => {
      if (currentQ + 1 >= questions.length) {
        setGameOver(true);
        const finalScore = score + (correct ? 5 : 0);
        onComplete(finalScore);
      } else {
        setCurrentQ((q) => q + 1);
        setSelected(null);
      }
    }, 1000);
  };

  if (gameOver) {
    return (
      <div className="text-center py-6 space-y-2">
        <Trophy className="w-10 h-10 text-yellow-500 mx-auto" />
        <p className="text-2xl font-bold">{score} / {questions.length * 5}</p>
        <p className="text-muted-foreground">
          {score >= 20 ? "Perfect!" : score >= 10 ? "Great job!" : "Keep trying!"}
        </p>
      </div>
    );
  }

  const q = questions[currentQ];
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Question {currentQ + 1}/{questions.length}</span>
        <Badge variant="secondary">{score} pts</Badge>
      </div>
      <p className="font-medium text-base" data-testid="text-trivia-question">{q.q}</p>
      <div className="space-y-2">
        {q.options.map((opt, i) => {
          let cls = "w-full justify-start text-left";
          if (selected !== null) {
            if (i === q.answer) cls += " bg-green-500/20 border-green-500/50 text-green-400";
            else if (i === selected) cls += " bg-red-500/20 border-red-500/50 text-red-400";
          }
          return (
            <Button
              key={i}
              variant="outline"
              className={cls}
              onClick={() => selectAnswer(i)}
              disabled={selected !== null}
              data-testid={`button-answer-${i}`}
            >
              {opt}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

const COLORS = [
  { name: "Red", hex: "#ef4444" },
  { name: "Blue", hex: "#3b82f6" },
  { name: "Green", hex: "#22c55e" },
  { name: "Yellow", hex: "#eab308" },
  { name: "Purple", hex: "#a855f7" },
  { name: "Pink", hex: "#ec4899" },
  { name: "Orange", hex: "#f97316" },
  { name: "Teal", hex: "#14b8a6" },
];

function ColorMatchGame({ onComplete }: { onComplete: (score: number) => void }) {
  const [score, setScore] = useState(0);
  const [round, setRound] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [gameOver, setGameOver] = useState(false);
  const [current, setCurrent] = useState({ textColor: COLORS[0], displayedName: COLORS[1], isMatch: false });

  const generateRound = useCallback(() => {
    const isMatch = Math.random() > 0.5;
    const textColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const displayedName = isMatch ? textColor : COLORS.filter((c) => c.name !== textColor.name)[Math.floor(Math.random() * (COLORS.length - 1))];
    setCurrent({ textColor, displayedName, isMatch });
  }, []);

  useEffect(() => {
    generateRound();
  }, []);

  useEffect(() => {
    if (gameOver) return;
    const timer = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setGameOver(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [gameOver]);

  useEffect(() => {
    if (gameOver) onComplete(score);
  }, [gameOver]);

  const answer = (userSaysMatch: boolean) => {
    if (gameOver) return;
    if (userSaysMatch === current.isMatch) {
      setScore((s) => s + 2);
    }
    setRound((r) => r + 1);
    generateRound();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm text-muted-foreground">Score: <span className="font-semibold text-foreground tabular-nums">{score}</span></span>
        <span className={`text-sm font-semibold tabular-nums ${timeLeft <= 5 ? "text-red-500" : "text-muted-foreground"}`}>{timeLeft}s</span>
      </div>

      <div className="text-center py-6">
        <p className="text-sm text-muted-foreground mb-3">Does the color name match the text color?</p>
        <p
          className="text-4xl font-bold"
          style={{ color: current.textColor.hex }}
          data-testid="text-color-display"
        >
          {current.displayedName.name}
        </p>
      </div>

      <div className="flex gap-3">
        <Button className="flex-1" variant="outline" onClick={() => answer(true)} disabled={gameOver} data-testid="button-match-yes">
          Match
        </Button>
        <Button className="flex-1" variant="outline" onClick={() => answer(false)} disabled={gameOver} data-testid="button-match-no">
          No Match
        </Button>
      </div>

      {gameOver && (
        <div className="text-center py-3 space-y-1">
          <Trophy className="w-8 h-8 text-yellow-500 mx-auto" />
          <p className="font-semibold">{score} points in {round} rounds!</p>
        </div>
      )}
    </div>
  );
}

type AIGameState = "idle" | "generating" | "playing" | "error";

function AIGameCreator({ session }: { session: { username: string; age: number } }) {
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<AIGameState>("idle");
  const [gameHtml, setGameHtml] = useState("");
  const [error, setError] = useState("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const generateGame = async () => {
    if (!prompt.trim() || prompt.trim().length < 5) return;
    setState("generating");
    setError("");

    try {
      const res = await fetch("/api/games/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: prompt.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({ message: "Failed to generate game" }));
        throw new Error(data.message || "Failed to generate game");
      }

      const data = await res.json();
      setGameHtml(data.html);
      setState("playing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setState("error");
    }
  };

  const reset = () => {
    setState("idle");
    setGameHtml("");
    setError("");
    setPrompt("");
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
          <Wand2 className="w-5 h-5 text-primary" />
        </div>
        <div>
          <h3 className="font-semibold">AI Game Creator</h3>
          <p className="text-xs text-muted-foreground">Describe a game and AI will build it for you</p>
        </div>
      </div>

      {state === "idle" && (
        <div className="space-y-3">
          <Textarea
            placeholder="Describe your game idea... e.g. 'A snake game where you collect stars' or 'A breakout-style brick breaker game'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="resize-none min-h-[80px]"
            maxLength={500}
            data-testid="input-game-description"
          />
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-xs text-muted-foreground">{prompt.length}/500 characters</p>
            <Button
              onClick={generateGame}
              disabled={prompt.trim().length < 5}
              className="gap-1.5"
              data-testid="button-generate-game"
            >
              <Wand2 className="w-4 h-4" />
              Generate Game
            </Button>
          </div>
        </div>
      )}

      {state === "generating" && (
        <div className="text-center py-8 space-y-3">
          <Loader2 className="w-8 h-8 text-primary mx-auto animate-spin" />
          <p className="text-muted-foreground">Creating your game with AI...</p>
          <p className="text-xs text-muted-foreground">This may take 10-20 seconds</p>
        </div>
      )}

      {state === "playing" && (
        <div className="space-y-3">
          <div className="rounded-lg border border-border/50 overflow-hidden">
            <iframe
              ref={iframeRef}
              srcDoc={gameHtml}
              className="w-full h-[400px] sm:h-[500px] bg-white"
              sandbox="allow-scripts"
              title="AI Generated Game"
              data-testid="iframe-ai-game"
            />
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={reset} className="gap-1.5" data-testid="button-new-game">
              <RotateCcw className="w-4 h-4" />
              Create Another
            </Button>
          </div>
        </div>
      )}

      {state === "error" && (
        <div className="text-center py-6 space-y-3">
          <p className="text-sm text-red-400">{error}</p>
          <Button variant="ghost" size="sm" onClick={reset} data-testid="button-try-again">
            Try Again
          </Button>
        </div>
      )}
    </Card>
  );
}

export default function GamesPage() {
  const { session } = useAuth();
  const [activeTab, setActiveTab] = useState("play");
  const [playingGame, setPlayingGame] = useState<GameId | null>(null);
  const [wallet, setWallet] = useState({ available: 0, lockedForCollege: 0 });
  const [cooldowns, setCooldowns] = useState<Record<string, number>>({});
  const [scores, setScores] = useState<GameScore[]>([]);

  useEffect(() => {
    if (session) {
      setWallet(getWallet(session.username));
      setScores(getScores(session.username));
      updateCooldowns();
      const interval = setInterval(updateCooldowns, 1000);
      return () => clearInterval(interval);
    }
  }, [session]);

  const updateCooldowns = useCallback(() => {
    if (!session) return;
    const cd: Record<string, number> = {};
    GAMES.forEach((g) => {
      cd[g.id] = getCooldownRemaining(session.username, g.id);
    });
    setCooldowns(cd);
  }, [session]);

  const handleGameComplete = useCallback(
    (score: number) => {
      if (!session) return;
      const game = GAMES.find((g) => g.id === playingGame);
      if (!game) return;

      const coinsEarned = Math.min(score, 25);
      if (coinsEarned > 0) {
        addCoins(session.username, session.age, `${game.title} - scored ${score}`, coinsEarned);
      }
      markPlayed(session.username, game.id);
      addScore(session.username, { gameId: game.id, score, coinsEarned, timestamp: Date.now() });
      setWallet(getWallet(session.username));
      setScores(getScores(session.username));
      updateCooldowns();
    },
    [session, playingGame, updateCooldowns]
  );

  const startGame = (gameId: GameId) => {
    if (!session) return;
    if (!canPlay(session.username, gameId)) return;
    setPlayingGame(gameId);
  };

  const bestScores = useMemo(() => {
    const map: Record<string, number> = {};
    scores.forEach((s) => {
      if (!map[s.gameId] || s.score > map[s.gameId]) {
        map[s.gameId] = s.score;
      }
    });
    return map;
  }, [scores]);

  const totalEarned = useMemo(() => {
    return scores.reduce((sum, s) => sum + s.coinsEarned, 0);
  }, [scores]);

  const formatCooldown = (ms: number) => {
    const secs = Math.ceil(ms / 1000);
    return `${secs}s`;
  };

  return (
    <PageLayout>
      <div className="max-w-2xl mx-auto px-4 py-4 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20">
              <Gamepad2 className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">DAH Games</h1>
              <p className="text-xs text-muted-foreground">Play games, earn DAH Coins</p>
            </div>
          </div>
          {session && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-bold text-primary tabular-nums" data-testid="text-games-balance">{wallet.available.toLocaleString()}</span>
            </div>
          )}
        </div>

        {session && (
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 text-center">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
              <p className="text-lg font-bold tabular-nums">{scores.length}</p>
              <p className="text-xs text-muted-foreground">Games Played</p>
            </Card>
            <Card className="p-3 text-center">
              <Coins className="w-5 h-5 mx-auto mb-1 text-primary" />
              <p className="text-lg font-bold tabular-nums">{totalEarned}</p>
              <p className="text-xs text-muted-foreground">Coins Earned</p>
            </Card>
            <Card className="p-3 text-center">
              <Crown className="w-5 h-5 mx-auto mb-1 text-purple-500" />
              <p className="text-lg font-bold tabular-nums">{Object.values(bestScores).reduce((a, b) => a + b, 0)}</p>
              <p className="text-xs text-muted-foreground">Best Total</p>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/40 w-full">
            <TabsTrigger value="play" className="flex-1 gap-1.5" data-testid="tab-play">
              <Play className="w-3.5 h-3.5" />
              Play
            </TabsTrigger>
            <TabsTrigger value="create" className="flex-1 gap-1.5" data-testid="tab-create">
              <Wand2 className="w-3.5 h-3.5" />
              AI Creator
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1 gap-1.5" data-testid="tab-history">
              <Clock className="w-3.5 h-3.5" />
              History
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === "play" && (
          <div className="space-y-3">
            {GAMES.map((game) => {
              const Icon = game.icon;
              const cd = cooldowns[game.id] || 0;
              const best = bestScores[game.id];
              return (
                <Card key={game.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-lg ${game.bgColor} shrink-0`}>
                      <Icon className={`w-6 h-6 ${game.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 className="font-semibold">{game.title}</h3>
                        <Badge variant="secondary" className="text-xs">{game.difficulty}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-0.5">{game.description}</p>
                      <div className="flex items-center justify-between gap-3 mt-3 flex-wrap">
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Coins className="w-3 h-3 text-primary" /> {game.reward}
                          </span>
                          {best !== undefined && (
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" /> Best: {best}
                            </span>
                          )}
                        </div>
                        {session ? (
                          cd > 0 ? (
                            <Button variant="ghost" size="sm" disabled className="gap-1.5" data-testid={`button-play-${game.id}-cooldown`}>
                              <Clock className="w-3.5 h-3.5" />
                              {formatCooldown(cd)}
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => startGame(game.id)} className="gap-1.5" data-testid={`button-play-${game.id}`}>
                              <Play className="w-3.5 h-3.5" />
                              Play
                            </Button>
                          )
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            Log in to play
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {activeTab === "create" && session && (
          <AIGameCreator session={session} />
        )}

        {activeTab === "create" && !session && (
          <Card className="p-6 text-center">
            <Wand2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
            <p className="text-muted-foreground font-medium">Log in to create AI-powered games</p>
          </Card>
        )}

        {activeTab === "history" && (
          <div className="space-y-2">
            {scores.length === 0 ? (
              <Card className="p-6 text-center">
                <Gamepad2 className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                <p className="text-muted-foreground">No games played yet. Start playing to see your history!</p>
              </Card>
            ) : (
              scores.slice(0, 20).map((s, idx) => {
                const game = GAMES.find((g) => g.id === s.gameId);
                if (!game) return null;
                const Icon = game.icon;
                return (
                  <Card key={idx} className="p-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md ${game.bgColor} shrink-0`}>
                        <Icon className={`w-4 h-4 ${game.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{game.title}</p>
                        <p className="text-xs text-muted-foreground">{new Date(s.timestamp).toLocaleDateString()}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-semibold tabular-nums">{s.score} pts</p>
                        <p className="text-xs text-primary tabular-nums">+{s.coinsEarned} DAH</p>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}
      </div>

      <Dialog open={playingGame !== null} onOpenChange={(open) => !open && setPlayingGame(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {playingGame && (() => {
                const game = GAMES.find((g) => g.id === playingGame);
                if (!game) return null;
                const Icon = game.icon;
                return (
                  <>
                    <Icon className={`w-5 h-5 ${game.color}`} />
                    {game.title}
                  </>
                );
              })()}
            </DialogTitle>
            <DialogDescription>
              {playingGame === "coin-rush" && "Tap falling coins as fast as you can!"}
              {playingGame === "memory-match" && "Find all matching pairs"}
              {playingGame === "trivia" && "Answer 5 questions correctly"}
              {playingGame === "color-match" && "Match the color name to the displayed color"}
            </DialogDescription>
          </DialogHeader>

          {playingGame === "coin-rush" && <CoinRushGame onComplete={handleGameComplete} />}
          {playingGame === "memory-match" && <MemoryMatchGame onComplete={handleGameComplete} />}
          {playingGame === "trivia" && <TriviaGame onComplete={handleGameComplete} />}
          {playingGame === "color-match" && <ColorMatchGame onComplete={handleGameComplete} />}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
