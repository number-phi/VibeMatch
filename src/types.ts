export interface Card {
  id: string;
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
}

export interface Room {
  id: string;
  title: string;
  cards: Card[];
  createdAt: number;
}

/** Everything persisted for a room. Votes: userId -> cardId -> yes/no. */
export interface RoomState {
  room: Room;
  participants: Record<string, { name: string }>;
  votes: Record<string, Record<string, boolean>>;
}

export interface CardResult {
  card: Card;
  yes: number;
  no: number;
  /** Participants who have not voted on this card yet. */
  pending: number;
  unanimous: boolean;
}

export interface Results {
  participantCount: number;
  matches: CardResult[];
  ranking: CardResult[];
}
