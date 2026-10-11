import { describe, expect, it } from "vitest";
import { swipeDirectionForKey } from "./swipeKeys";

describe("swipeDirectionForKey", () => {
  it("maps arrows", () => {
    expect(swipeDirectionForKey({ key: "ArrowRight" })).toBe("right");
    expect(swipeDirectionForKey({ key: "ArrowLeft" })).toBe("left");
  });
  it("ignores other keys, modifiers and repeats", () => {
    expect(swipeDirectionForKey({ key: "a" })).toBeNull();
    expect(swipeDirectionForKey({ key: "ArrowRight", ctrlKey: true })).toBeNull();
    expect(swipeDirectionForKey({ key: "ArrowLeft", repeat: true })).toBeNull();
  });
  it("ignores typing in form fields", () => {
    expect(swipeDirectionForKey({ key: "ArrowLeft", target: { tagName: "INPUT" } })).toBeNull();
  });
});
