import { useMemo } from "react";
import { computeResults } from "../lib/consensus";
import type { CardResult, RoomState } from "../types";

function Row({ r, total, highlight }: { r: CardResult; total: number; highlight?: boolean }) {
  return (
    <li className={`flex items-center gap-3 rounded-2xl border p-3 ${highlight ? "border-emerald-400/50 bg-emerald-400/10" : "border-white/10 bg-white/[0.03]"}`}>
      {r.card.imageUrl ? (
        <img src={r.card.imageUrl} alt="" className="h-14 w-14 rounded-xl object-cover" />
      ) : (
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/10 text-xl">{r.card.title.charAt(0).toUpperCase()}</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{r.card.title}</p>
        <p className="truncate text-xs text-white/50">{r.card.category}</p>
      </div>
      <div className="text-right text-sm">
        <p className="font-bold text-emerald-400">{r.yes}/{total} yes</p>
        {r.pending > 0 && <p className="text-xs text-white/40">{r.pending} pending</p>}
      </div>
    </li>
  );
}

export default function ResultsView({ state, finished }: { state: RoomState; finished: boolean }) {
  const res = useMemo(() => computeResults(state), [state]);
  const names = Object.values(state.participants).map((p) => p.name);

  return (
    <div className="mx-auto w-full max-w-md space-y-5 pb-10">
      {finished && <p className="text-center text-white/60">You're done! Results update live as others vote.</p>}
      <p className="text-center text-xs text-white/40">
        {res.participantCount} participant{res.participantCount === 1 ? "" : "s"}: {names.join(", ")}
      </p>

      {res.matches.length > 0 ? (
        <section>
          <h2 className="mb-3 text-xl font-bold">🎉 Unanimous matches</h2>
          <ul className="space-y-2">{res.matches.map((r) => <Row key={r.card.id} r={r} total={res.participantCount} highlight />)}</ul>
        </section>
      ) : (
        <section>
          <h2 className="mb-1 text-xl font-bold">No unanimous match yet</h2>
          <p className="mb-3 text-sm text-white/50">Top options by number of yes votes:</p>
          <ul className="space-y-2">{res.ranking.slice(0, 5).map((r) => <Row key={r.card.id} r={r} total={res.participantCount} />)}</ul>
        </section>
      )}
    </div>
  );
}
