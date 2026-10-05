import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createRoom, newId } from "../lib/api";
import type { Card } from "../types";

const empty = (): Card => ({ id: newId(), title: "", description: "", category: "", imageUrl: "" });
const input =
  "w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2.5 text-sm placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400/60";

export default function Home() {
  const nav = useNavigate();
  const [title, setTitle] = useState("");
  const [cards, setCards] = useState<Card[]>([empty(), empty()]);

  const update = (id: string, patch: Partial<Card>) =>
    setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const valid = cards.filter((c) => c.title.trim());

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid.length) return;
    const id = `${newId().slice(0, 3)}-${newId().slice(0, 3)}-${newId().slice(0, 3)}`;
    createRoom({
      id,
      title: title.trim() || "Untitled session",
      createdAt: Date.now(),
      cards: valid.map((c) => ({
        ...c,
        title: c.title.trim(),
        description: c.description.trim(),
        category: c.category.trim() || "General",
        imageUrl: c.imageUrl?.trim() || undefined,
      })),
    });
    nav(`/room/${id}`);
  };

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 to-indigo-400 bg-clip-text text-transparent">
        VibeMatch
      </h1>
      <p className="mt-2 text-white/60">Build a deck, share the link, swipe together, find what everyone agrees on.</p>

      <form onSubmit={submit} className="mt-8 space-y-4">
        <input className={input} placeholder="Session title (e.g. Friday dinner)" value={title}
          onChange={(e) => setTitle(e.target.value)} aria-label="Session title" />

        {cards.map((c, i) => (
          <fieldset key={c.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <legend className="text-xs uppercase tracking-wider text-white/40">Card {i + 1}</legend>
              {cards.length > 1 && (
                <button type="button" onClick={() => setCards((cs) => cs.filter((x) => x.id !== c.id))}
                  className="text-xs text-white/40 hover:text-red-400" aria-label={`Remove card ${i + 1}`}>Remove</button>
              )}
            </div>
            <input className={input} placeholder="Title *" value={c.title} onChange={(e) => update(c.id, { title: e.target.value })} />
            <textarea className={input} rows={2} placeholder="Short description" value={c.description}
              onChange={(e) => update(c.id, { description: e.target.value })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={input} placeholder="Category" value={c.category} onChange={(e) => update(c.id, { category: e.target.value })} />
              <input className={input} type="url" placeholder="Image / icon URL (optional)" value={c.imageUrl}
                onChange={(e) => update(c.id, { imageUrl: e.target.value })} />
            </div>
          </fieldset>
        ))}

        <button type="button" onClick={() => setCards((cs) => [...cs, empty()])}
          className="w-full rounded-2xl border border-dashed border-white/20 py-3 text-sm text-white/60 hover:bg-white/5">
          + Add card
        </button>

        <button disabled={!valid.length}
          className="w-full rounded-2xl bg-gradient-to-r from-pink-500 to-indigo-500 py-3.5 font-semibold disabled:opacity-40">
          Create Room ({valid.length} card{valid.length === 1 ? "" : "s"})
        </button>
      </form>
    </main>
  );
}
