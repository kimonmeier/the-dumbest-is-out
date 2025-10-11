import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';

export interface VotingSummaryModel {
	playerId: PlayerId;
	voteCount: number;
}
