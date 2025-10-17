import type { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes';

export interface Player {
	playerId: PlayerId;
	name: string;
	link: string;
	status: PlayerStatus;
	roomCode: GameCode;
	isSpeaking: boolean;
}
