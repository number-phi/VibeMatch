import { useEffect, useState } from "react";
import { animate, motion, useMotionValue, useTransform, type PanInfo } from "framer-motion";
import type { Card } from "../types";
import { swipeDirectionForKey } from "../lib/swipeKeys";

const THRESHOLD = 110;

interface Props {
  card: Card;
  /** Set by the action buttons to trigger a programmatic swipe. */
  forced: "left" | "right" | null;
  onVote: (yes: boolean) => void;
}

export default function SwipeCard({ card, forced, onVote }: Props) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-250, 250], [-14, 14]);
  const yesOpacity = useTransform(x, [20, THRESHOLD], [0, 1]);
  const noOpacity = useTransform(x, [-THRESHOLD, -20], [1, 0]);
  const [imgOk, setImgOk] = useState(true);

  const fling = (dir: "left" | "right") => {
    animate(x, dir === "right" ? 700 : -700, { duration: 0.28 }).then(() => onVote(dir === "right"));
  };

  useEffect(() => {
    if (forced) fling(forced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced]);

  useEffect(() => {
    if (forced) return;
    const onKey = (e: KeyboardEvent) => {
      const dir = swipeDirectionForKey(e);
      if (!dir || x.isAnimating()) return;
      e.preventDefault();
      fling(dir);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [forced]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > THRESHOLD || info.velocity.x > 600) fling("right");
    else if (info.offset.x < -THRESHOLD || info.velocity.x < -600) fling("left");
  };

  return (
    <motion.div
      style={{ x, rotate, touchAction: "pan-y" }}
      drag={forced ? false : "x"}
      dragSnapToOrigin
      dragElastic={0.9}
      onDragEnd={onDragEnd}
      className="absolute inset-0 cursor-grab active:cursor-grabbing select-none overflow-hidden rounded-3xl border border-white/10 bg-[#161a24] shadow-2xl"
    >
      {card.imageUrl && imgOk ? (
        <img src={card.imageUrl} alt="" draggable={false} onError={() => setImgOk(false)}
          className="h-3/5 w-full object-cover" />
      ) : (
        <div className="grid h-3/5 place-items-center bg-gradient-to-br from-indigo-500/30 to-pink-500/30 text-7xl">
          {card.title.charAt(0).toUpperCase()}
        </div>
      )}
      <div className="p-5 space-y-2">
        <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/70">{card.category}</span>
        <h2 className="text-2xl font-bold leading-tight">{card.title}</h2>
        {card.description && <p className="text-sm text-white/60 line-clamp-3">{card.description}</p>}
      </div>

      <motion.div style={{ opacity: yesOpacity }}
        className="pointer-events-none absolute left-5 top-6 -rotate-12 rounded-lg border-4 border-emerald-400 px-3 py-1 text-3xl font-black text-emerald-400">
        YES
      </motion.div>
      <motion.div style={{ opacity: noOpacity }}
        className="pointer-events-none absolute right-5 top-6 rotate-12 rounded-lg border-4 border-red-500 px-3 py-1 text-3xl font-black text-red-500">
        NO
      </motion.div>
    </motion.div>
  );
}
