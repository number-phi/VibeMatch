import type { Room, RoomState } from "../types";

/**
 * Simulated room API backed by localStorage. Other tabs are notified via the
 * `storage` event, same-tab via a local listener set. To go multi-device, replace
 * the bodies of getRoom/saveState with Supabase/Firebase calls (same signatures).
 */
const KEY = (id: string) => `cs:room:${id}`;
const listeners = new Set<(id: string) => void>();

export const newId = () => crypto.randomUUID().replace(/-/g, "").slice(0, 12);

export function getUserId(): string {
  let id = localStorage.getItem("cs:uid");
  if (!id) {
    id = newId();
    localStorage.setItem("cs:uid", id);
  }
  return id;
}

export function getRoom(id: string): RoomState | null {
  const raw = localStorage.getItem(KEY(id));
  if (!raw) return null;
  try {
    return JSON.parse(raw) as RoomState;
  } catch {
    return null;
  }
}

function saveState(state: RoomState) {
  localStorage.setItem(KEY(state.room.id), JSON.stringify(state));
  listeners.forEach((l) => l(state.room.id));
}

export function createRoom(room: Room): RoomState {
  const state: RoomState = { room, participants: {}, votes: {} };
  saveState(state);
  return state;
}

/** Seeds a room that arrived through a shared link (deck encoded in the URL). */
export function importRoom(room: Room): RoomState {
  return getRoom(room.id) ?? createRoom(room);
}

function mutate(id: string, fn: (s: RoomState) => void) {
  const s = getRoom(id);
  if (!s) return;
  fn(s);
  saveState(s);
}

export const joinRoom = (id: string, userId: string, name: string) =>
  mutate(id, (s) => {
    s.participants[userId] = { name };
    s.votes[userId] ??= {};
  });

export const castVote = (id: string, userId: string, cardId: string, yes: boolean) =>
  mutate(id, (s) => {
    s.votes[userId] ??= {};
    s.votes[userId][cardId] = yes;
  });

export function subscribe(id: string, cb: () => void): () => void {
  const local = (changed: string) => changed === id && cb();
  const remote = (e: StorageEvent) => e.key === KEY(id) && cb();
  listeners.add(local);
  window.addEventListener("storage", remote);
  return () => {
    listeners.delete(local);
    window.removeEventListener("storage", remote);
  };
}

/** Deck <-> URL hash so a link works on a device that has never seen the room. */
export function encodeRoom(room: Room): string {
  const bytes = new TextEncoder().encode(JSON.stringify(room));
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeRoom(s: string): Room | null {
  try {
    const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    const room = JSON.parse(new TextDecoder().decode(bytes)) as Room;
    return room?.id && Array.isArray(room.cards) ? room : null;
  } catch {
    return null;
  }
}

export const shareUrl = (room: Room) =>
  `${location.origin}${location.pathname}#/room/${room.id}?d=${encodeRoom(room)}`;
