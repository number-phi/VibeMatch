import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import SwipeDeck from "../components/SwipeDeck";
import ResultsView from "../components/ResultsView";
import { castVote, decodeRoom, getUserId, importRoom, joinRoom, shareUrl } from "../lib/api";
import { hasFinished } from "../lib/consensus";
import { useRoomState } from "../lib/useRoomState";

export default function RoomPage() {
  const { roomId = "" } = useParams();
  const [params] = useSearchParams();
  const userId = useMemo(getUserId, []);
  const [seeded, setSeeded] = useState(false);
  const [name, setName] = useState("");
  const [copied, setCopied] = useState(false);
  const state = useRoomState(roomId, seeded);

  useEffect(() => {
    const d = params.get("d");
    const room = d ? decodeRoom(d) : null;
    if (room && room.id === roomId) importRoom(room);
    setSeeded(true);
  }, [roomId, params]);

  if (!state) {
    return (
      <main className="grid h-full place-items-center p-6 text-center">
        <div>
          <p className="text-lg">Room not found.</p>
          <Link to="/" className="mt-3 inline-block text-indigo-400 underline">Create a new one</Link>
        </div>
      </main>
    );
  }

  const me = state.participants[userId];
  const finished = !!me && hasFinished(state, userId);
  const startIndex = me ? state.room.cards.filter((c) => c.id in (state.votes[userId] ?? {})).length : 0;

  const copy = async () => {
    await navigator.clipboard.writeText(shareUrl(state.room));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="mx-auto flex h-full max-w-2xl flex-col px-4 py-4">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <Link to="/" className="text-xs text-white/40 hover:text-white/70">← VibeMatch</Link>
          <h1 className="truncate text-lg font-bold">{state.room.title}</h1>
        </div>
        <button onClick={copy} className="shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white/10">
          {copied ? "Copied!" : `Share · ${state.room.id}`}
        </button>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {!me ? (
          <form
            onSubmit={(e) => { e.preventDefault(); if (name.trim()) joinRoom(roomId, userId, name.trim()); }}
            className="mx-auto mt-16 max-w-sm space-y-3 text-center"
          >
            <h2 className="text-2xl font-bold">What's your name?</h2>
            <p className="text-sm text-white/50">{state.room.cards.length} cards to swipe.</p>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={30}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-center focus:outline-none focus:ring-2 focus:ring-indigo-400/60" />
            <button disabled={!name.trim()} className="w-full rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3 font-semibold disabled:opacity-40">
              Start swiping
            </button>
          </form>
        ) : finished ? (
          <ResultsView state={state} finished />
        ) : (
          <SwipeDeck cards={state.room.cards} startIndex={startIndex} onVote={(c, yes) => castVote(roomId, userId, c.id, yes)} />
        )}
      </div>
    </main>
  );
}

