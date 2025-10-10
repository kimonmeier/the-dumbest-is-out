import type { GameCode, PlayerId } from './OpaqueTypes';

export interface ClientToServerEvents {
	/// This event describes when an client tries to connect to the server
	PLAYER_CONNECTING: (
		name: string,
		link: string,
		gameCode: GameCode,
		callback: (playerId: PlayerId | undefined) => void
	) => void;

	GAME_MASTER_CONNECTING: (
		twitchname: string,
		link: string,
		callback: (playerId: PlayerId | undefined, gameCode: GameCode) => void
	) => void;

	PUBLIC_CONNECTING: (roomCode: GameCode) => void;

	START_ROUND: (roomCode: GameCode, timeInSeconds: number) => void;

	END_ROUND: (roomCode: GameCode) => void;

	PLAYER_ANSWERED: (roomCode: GameCode, rightAnswer: boolean) => void;

	NOMINATE_DUMBEST_PLAYER: (dumbestPlayerId: PlayerId) => void;

	IS_SPEAKING: (speaking: boolean) => void;
}
