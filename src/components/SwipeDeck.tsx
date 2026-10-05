import { useState } from "react";
import type { Card } from "../types";
import SwipeCard from "./SwipeCard";

interface Props {
  cards: Card[];
  startIndex: number;
  onVote: (card: Card, yes: boolean) => void;
}

export default function SwipeDeck({ cards, startIndex, onVote }: Props) {
  const [index, setIndex] = useState(startIndex);
  const [forced, setForced] = useState<"left" | "right" | null>(null);
  const card = cards[index];
  if (!card) return null;

  const handle = (yes: boolean) => {
    onVote(card, yes);
    setForced(null);
    setIndex((i) => i + 1);
  };

  return (
    <div className="mx-auto flex h-full w-full max-w-sm flex-col gap-4">
      <div className="text-center text-sm text-white/60" aria-live="polite">
        Card {index + 1} of {cards.length}
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full bg-gradient-to-r from-pink-500 to-indigo-500 transition-all"
            style={{ width: `${(index / cards.length) * 100}%` }} />
        </div>
      </div>

      <div className="relative min-h-0 flex-1">
        {cards[index + 1] && (
          <div className="absolute inset-0 scale-95 rounded-3xl border border-white/5 bg-[#12151d]" />
        )}
        <SwipeCard key={card.id} card={card} forced={forced} onVote={handle} />
      </div>

      <div className="flex justify-center gap-8 pb-2">
        <button onClick={() => setForced("left")} disabled={!!forced} aria-label="No"
          className="grid h-16 w-16 place-items-center rounded-full border border-red-500/40 bg-red-500/10 text-2xl transition hover:scale-110 hover:bg-red-500/20">
          ❌
        </button>
        <button onClick={() => setForced("right")} disabled={!!forced} aria-label="Yes"
          className="grid h-16 w-16 place-items-center rounded-full border border-emerald-400/40 bg-emerald-400/10 text-2xl transition hover:scale-110 hover:bg-emerald-400/20">
          ❤️
        </button>
      </div>
    </div>
  );
}
