export type SwipeDir = "left" | "right";

interface KeyLike {
  key: string;
  altKey?: boolean;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  repeat?: boolean;
  target?: EventTarget | { tagName?: string; isContentEditable?: boolean } | null;
}

/** Maps a keydown event to a swipe direction, or null if it should be ignored. */
export function swipeDirectionForKey(e: KeyLike): SwipeDir | null {
  if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.repeat) return null;
  const t = e.target as { tagName?: string; isContentEditable?: boolean } | null | undefined;
  const tag = t?.tagName?.toUpperCase();
  if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t?.isContentEditable) return null;
  if (e.key === "ArrowRight") return "right";
  if (e.key === "ArrowLeft") return "left";
  return null;
}
