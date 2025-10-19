import type { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';

export interface PlayerModel {
	id: PlayerId;
	name: string;
	link: string | null;
	status: PlayerStatus;
	isSpeaking: boolean;
	votedForDumbest: PlayerId | null;
}
