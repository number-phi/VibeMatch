import { describe, expect, it } from "vitest";
import { computeResults } from "./consensus";
import type { RoomState } from "../types";

const card = (id: string) => ({ id, title: id, description: "", category: "" });
const state: RoomState = {
  room: { id: "r", title: "t", createdAt: 0, cards: [card("a"), card("b"), card("c")] },
  participants: { u1: { name: "A" }, u2: { name: "B" } },
  votes: { u1: { a: true, b: true, c: false }, u2: { a: true, b: false } },
};

describe("computeResults", () => {
  it("returns only unanimous YES as matches", () => {
    const r = computeResults(state);
    expect(r.matches.map((m) => m.card.id)).toEqual(["a"]);
  });
  it("ranks by yes votes and tracks pending", () => {
    const r = computeResults(state);
    expect(r.ranking.map((m) => m.card.id)).toEqual(["a", "b", "c"]);
    expect(r.ranking[2].pending).toBe(1);
  });
  it("has no matches without participants", () => {
    const r = computeResults({ ...state, participants: {}, votes: {} });
    expect(r.matches).toEqual([]);
  });
});
