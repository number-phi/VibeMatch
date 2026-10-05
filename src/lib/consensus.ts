import type { CardResult, Results, RoomState } from "../types";

/** Pure match calculation: a match = every participant voted YES. */
export function computeResults(state: RoomState): Results {
  const userIds = Object.keys(state.participants);
  const participantCount = userIds.length;

  const ranking: CardResult[] = state.room.cards.map((card, index) => {
    let yes = 0;
    let no = 0;
    for (const uid of userIds) {
      const v = state.votes[uid]?.[card.id];
      if (v === true) yes++;
      else if (v === false) no++;
    }
    return {
      card,
      yes,
      no,
      pending: participantCount - yes - no,
      unanimous: participantCount > 0 && yes === participantCount,
      index,
    };
  }).sort((a, b) => b.yes - a.yes || a.no - b.no || a.index - b.index)
    .map(({ index: _i, ...r }) => r);

  return { participantCount, ranking, matches: ranking.filter((r) => r.unanimous) };
}

export function hasFinished(state: RoomState, userId: string): boolean {
  const v = state.votes[userId] ?? {};
  return state.room.cards.every((c) => c.id in v);
}
