import { writable, type Readable } from 'svelte/store';
import type { VotingSummaryModel } from '../models/VotingModel';
import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';

interface VotingStore extends Readable<VotingSummaryModel[]> {
	vote: (playerId: PlayerId) => void;
	reset: () => void;
}

function createVotingStore(): VotingStore {
	const { subscribe, set, update } = writable<VotingSummaryModel[]>([]);

	return {
		subscribe,
		vote: (playerId: PlayerId) =>
			update((votes) => {
				const existingVote = votes.find((v) => v.playerId === playerId);
				if (existingVote) {
					return votes.map((v) =>
						v.playerId === playerId ? { ...v, voteCount: v.voteCount + 1 } : v
					);
				} else {
					return [...votes, { playerId, voteCount: 1 }];
				}
			}),
		reset: () => set([])
	};
}

export const isVoting = writable<boolean>(false);
export const votedPlayer = writable<PlayerId | null>(null);
export const votingSummaryStore = createVotingStore();
