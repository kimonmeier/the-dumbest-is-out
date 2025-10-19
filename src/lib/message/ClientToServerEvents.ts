import type { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
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

	START_ROUND: (roomCode: GameCode, playerToAskQuestion: PlayerId, timeInSeconds: number) => void;

	END_ROUND: (roomCode: GameCode) => void;

	PLAYER_ANSWERED: (roomCode: GameCode, rightAnswer: boolean) => void;

	NOMINATE_DUMBEST_PLAYER: (dumbestPlayerId: PlayerId) => void;

	IS_SPEAKING: (speaking: boolean) => void;

	START_VOTING: (roomCode: GameCode) => void;

	STOP_VOTING: (roomCode: GameCode) => void;

	CHANGE_PLAYER_STATUS: (playerId: PlayerId, status: PlayerStatus) => void;
}
