import { lsGet, lsSet } from "./storage";

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
  return getInbox(username).filter(l => !l.read).length;
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
