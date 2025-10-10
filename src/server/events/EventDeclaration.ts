import type { GameCode } from '@gameshow-lib/message/OpaqueTypes';

export type EventDeclaration = {
	START_ROUND: { roomCode: GameCode; timeInSeconds: number };
	PLAYER_ANSWERED: { playerId: string; rightAnswer: boolean };
	NOMINATE_DUMBEST_PLAYER: { playerId: string; dumbestPlayerId: string };
};
