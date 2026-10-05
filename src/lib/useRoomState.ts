import { useEffect, useState } from "react";
import { getRoom, subscribe } from "../lib/api";
import type { RoomState } from "../types";

export function useRoomState(id: string, enabled = true): RoomState | null {
  const [state, setState] = useState<RoomState | null>(() => getRoom(id));
  useEffect(() => {
    if (!enabled) return;
    setState(getRoom(id));
    return subscribe(id, () => setState(getRoom(id)));
  }, [id, enabled]);
  return state;
}
