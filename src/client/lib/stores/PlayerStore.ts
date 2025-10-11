import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import type { PlayerModel } from '../models/PlayerModel';
import { writable, type Readable } from 'svelte/store';
import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';

interface PlayerStore extends Readable<PlayerModel[]> {
	addPlayer: (player: PlayerModel) => void;
	removePlayer: (playerId: PlayerId) => void;
	eliminatePlayer: (playerId: PlayerId) => void;
	updateSpeakingStatus: (playerId: PlayerId, isSpeaking: boolean) => void;
	votedForDumbest: (playerId: PlayerId, votedFor: PlayerId) => void;
	clearVoting: () => void;
	reset: () => void;
}

function createPlayerStore(): PlayerStore {
	const { subscribe, set, update } = writable<PlayerModel[]>([]);

	return {
		subscribe,
		addPlayer: (player: PlayerModel) =>
			update((players) => {
				if (players.find((p) => p.id === player.id)) {
					return players; // Player already exists, do not add
				}
				return [...players, player];
			}),
		removePlayer: (playerId: PlayerId) =>
			update((players) => players.filter((p) => p.id !== playerId)),
		eliminatePlayer: (playerId: PlayerId) =>
			update((players) =>
				players.map((p) => (p.id === playerId ? { ...p, status: PlayerStatus.Eliminated } : p))
			),
		updateSpeakingStatus: (playerId: PlayerId, isSpeaking: boolean) =>
			update((players) => players.map((p) => (p.id === playerId ? { ...p, isSpeaking } : p))),
		reset: () => set([]),
		clearVoting: () => update((players) => players.map((p) => ({ ...p, votedForDumbest: null }))),
		votedForDumbest: (playerId: PlayerId, votedFor: PlayerId) =>
			update((players) =>
				players.map((p) => (p.id === playerId ? { ...p, votedForDumbest: votedFor } : p))
			)
	};
}

export const playerStore = createPlayerStore();
export const hasControl = writable<boolean>(false);
