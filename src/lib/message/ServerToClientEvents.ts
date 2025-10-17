import type { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
import type { PlayerId } from './OpaqueTypes';

export interface ServerToClientEvents {
	// Player joined the game
	PLAYER_JOINED: (playerId: PlayerId, name: string, link: string) => void;

	// Player left the game
	PLAYER_LEFT: (playerId: PlayerId) => void;

	// Gamemaster login with the camera link
	GAMEMASTER_LOGIN: (link: string) => void;

	// Sets the streamer name in the chat window
	SET_STREAMER_NAME: (name: string) => void;

	// New question for the players
	NEW_QUESTION: (question: string) => void;

	// New Answer available for the curretn Question
	NEW_ANSWER: (answer: string) => void;

	// Start the round with a countdown
	START_ROUND: (timeInSeconds: number) => void;

	// Ends the Countdown of the round
	END_ROUND: () => void;

	// Player has answered the question
	PLAYER_ANSWERED: (playerId: PlayerId, rightAnswer: boolean) => void;

	// The voting for the dumbest player
	PLAYER_VOTED: (playerId: PlayerId, dumbestPlayerVote: PlayerId) => void;

	// The dumbest player has been nominated
	PLAYER_OUT: (playerId: PlayerId) => void;

	// This sends the player that is currently answering to the client
	PLAYER_IS_ANSWERING: (player: PlayerId | null) => void;

	// Manually change the player status
	CHNAGE_PLAYER_STATUS: (playerId: PlayerId, status: PlayerStatus) => void;

	PLAYER_SPEAKING_STATUS_CHANGED: (playerId: PlayerId, speaking: boolean) => void;

	STARTED_VOTING: () => void;

	STOPPED_VOTING: () => void;
}
