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
}
