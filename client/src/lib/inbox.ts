import { lsGet, lsSet } from "./storage";

export type Message = {
  id: string;
  ts: number;
  from: string;
  to: string;
  body: string;
  read: boolean;
  reaction?: string;
  replyTo?: string;
};

export type Conversation = {
  id: string;
  participants: string[];
  lastMessage: Message | null;
  unreadCount: number;
  isGroup?: boolean;
  groupName?: string;
  typing?: { user: string; ts: number } | null;
};

export type Letter = {
  id: string;
  ts: number;
  from: string;
  to: string;
  subject: string;
  body: string;
  read: boolean;
};

type InboxState = {
  letters: Letter[];
};

const INBOX_KEY = (username: string) => `dah.inbox.${username}`;
const SENT_KEY = (username: string) => `dah.sent.${username}`;
const MESSAGES_KEY = (u: string) => `dah.messages.${u}`;
const CONVOS_KEY = (u: string) => `dah.conversations.${u}`;
const TYPING_KEY = (u: string) => `dah.typing.${u}`;

function getInboxState(username: string): InboxState {
  if (typeof window === "undefined") return { letters: [] };
  return lsGet<InboxState>(INBOX_KEY(username), { letters: [] });
}

function getSentState(username: string): InboxState {
  if (typeof window === "undefined") return { letters: [] };
  return lsGet<InboxState>(SENT_KEY(username), { letters: [] });
}

function saveInboxState(username: string, state: InboxState) {
  lsSet(INBOX_KEY(username), state);
}

function saveSentState(username: string, state: InboxState) {
  lsSet(SENT_KEY(username), state);
}

export function getInbox(username: string): Letter[] {
  return getInboxState(username).letters;
}

export function getUnreadCount(username: string): number {
  return getInbox(username).filter(l => !l.read).length + getTotalUnreadMessages(username);
}

export function sendLetter(from: string, to: string, subject: string, body: string): Letter {
  const letter: Letter = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    from,
    to,
    subject,
    body,
    read: false,
  };

  const recipientState = getInboxState(to);
  recipientState.letters.unshift(letter);
  saveInboxState(to, recipientState);

  const senderSent = getSentState(from);
  senderSent.letters.unshift({ ...letter, read: true });
  saveSentState(from, senderSent);

  return letter;
}

export function getSentLetters(username: string): Letter[] {
  return getSentState(username).letters;
}

export function markAsRead(username: string, letterId: string) {
  const state = getInboxState(username);
  const letter = state.letters.find(l => l.id === letterId);
  if (letter) {
    letter.read = true;
    saveInboxState(username, state);
  }
}

export function markAllAsRead(username: string) {
  const state = getInboxState(username);
  state.letters.forEach(l => l.read = true);
  saveInboxState(username, state);
}

export function deleteLetter(username: string, letterId: string, fromSent: boolean = false) {
  if (fromSent) {
    const state = getSentState(username);
    state.letters = state.letters.filter(l => l.id !== letterId);
    saveSentState(username, state);
  } else {
    const state = getInboxState(username);
    state.letters = state.letters.filter(l => l.id !== letterId);
    saveInboxState(username, state);
  }
}

export function getConversation(username: string, otherUser: string): Letter[] {
  const inbox = getInbox(username);
  const sent = getSentLetters(username);

  const relevant = [
    ...inbox.filter(l => l.from === otherUser),
    ...sent.filter(l => l.to === otherUser),
  ];

  return relevant.sort((a, b) => a.ts - b.ts);
}

function convoId(a: string, b: string): string {
  return [a, b].sort().join(":");
}

function getMessages(username: string): Message[] {
  return lsGet<Message[]>(MESSAGES_KEY(username), []);
}

function saveMessages(username: string, msgs: Message[]) {
  lsSet(MESSAGES_KEY(username), msgs);
}

export function getConversations(username: string): Conversation[] {
  const msgs = getMessages(username);
  const convoMap = new Map<string, { participant: string; messages: Message[] }>();

  msgs.forEach(m => {
    const other = m.from === username ? m.to : m.from;
    const id = convoId(username, other);
    if (!convoMap.has(id)) {
      convoMap.set(id, { participant: other, messages: [] });
    }
    convoMap.get(id)!.messages.push(m);
  });

  const conversations: Conversation[] = [];
  convoMap.forEach((data, id) => {
    const sorted = data.messages.sort((a, b) => b.ts - a.ts);
    const unread = sorted.filter(m => !m.read && m.from !== username).length;
    conversations.push({
      id,
      participants: [username, data.participant],
      lastMessage: sorted[0] || null,
      unreadCount: unread,
    });
  });

  return conversations.sort((a, b) => (b.lastMessage?.ts || 0) - (a.lastMessage?.ts || 0));
}

export function getChatMessages(username: string, otherUser: string): Message[] {
  const msgs = getMessages(username);
  return msgs
    .filter(m => (m.from === otherUser && m.to === username) || (m.from === username && m.to === otherUser))
    .sort((a, b) => a.ts - b.ts);
}

export function sendMessage(from: string, to: string, body: string, replyTo?: string): Message {
  const msg: Message = {
    id: crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    ts: Date.now(),
    from,
    to,
    body,
    read: false,
    replyTo,
  };

  const senderMsgs = getMessages(from);
  senderMsgs.push({ ...msg, read: true });
  saveMessages(from, senderMsgs);

  const recipientMsgs = getMessages(to);
  recipientMsgs.push(msg);
  saveMessages(to, recipientMsgs);

  return msg;
}

export function markMessagesRead(username: string, otherUser: string) {
  const msgs = getMessages(username);
  let changed = false;
  msgs.forEach(m => {
    if (m.from === otherUser && !m.read) {
      m.read = true;
      changed = true;
    }
  });
  if (changed) saveMessages(username, msgs);
}

export function reactToMessage(username: string, messageId: string, reaction: string) {
  const msgs = getMessages(username);
  const msg = msgs.find(m => m.id === messageId);
  if (msg) {
    msg.reaction = msg.reaction === reaction ? undefined : reaction;
    saveMessages(username, msgs);
  }
}

export function getTotalUnreadMessages(username: string): number {
  const msgs = getMessages(username);
  return msgs.filter(m => !m.read && m.from !== username).length;
}

export function setTypingIndicator(username: string, toUser: string, isTyping: boolean) {
  const key = TYPING_KEY(toUser);
  if (isTyping) {
    lsSet(key, { user: username, ts: Date.now() });
  } else {
    const current = lsGet<{ user: string; ts: number } | null>(key, null);
    if (current?.user === username) {
      lsSet(key, null);
    }
  }
}

export function getTypingIndicator(username: string): { user: string; ts: number } | null {
  const data = lsGet<{ user: string; ts: number } | null>(TYPING_KEY(username), null);
  if (!data) return null;
  if (Date.now() - data.ts > 5000) return null;
  return data;
}

export function deleteMessage(username: string, messageId: string) {
  const msgs = getMessages(username);
  saveMessages(username, msgs.filter(m => m.id !== messageId));
}

export function seedConversation(username: string) {
  const msgs = getMessages(username);
  if (msgs.length > 0) return;

  const botMessages: { from: string; body: string; ago: number }[] = [
    { from: "jessica_m", body: "Hey! Welcome to DAH Social! Hope you're enjoying the platform so far", ago: 86400000 * 2 },
    { from: "jessica_m", body: "Let me know if you need any help getting started!", ago: 86400000 * 2 - 60000 },
    { from: "marcus_t", body: "yo what's up! saw your profile, looks cool", ago: 86400000 },
    { from: "marcus_t", body: "you into tech stuff? should check out the gaming section", ago: 86400000 - 120000 },
    { from: "sarah_b", body: "Hi there! Just wanted to say welcome to the community", ago: 43200000 },
    { from: "dah", body: "Welcome to DAH Social! You've earned 50 bonus DAH Coins for joining. Check out the Rewards Store to see what you can redeem!", ago: 172800000 },
  ];

  const now = Date.now();
  const seedMsgs: Message[] = botMessages.map((bm, i) => ({
    id: `seed-msg-${i}-${Math.random().toString(36).slice(2)}`,
    ts: now - bm.ago,
    from: bm.from,
    to: username,
    body: bm.body,
    read: false,
  }));

  saveMessages(username, seedMsgs);
}
