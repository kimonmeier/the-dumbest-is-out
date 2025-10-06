import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes';

export interface Player {
	playerId: PlayerId;
	name: string;
	link: string;
	roomCode: GameCode;
}
