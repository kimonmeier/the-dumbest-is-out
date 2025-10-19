import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import { writable } from 'svelte/store';

export const isGamemaster = writable<boolean>(false);
export const gameMasterUrl = writable<string | undefined>(undefined);
export const isLoggedIn = writable<boolean>(false);
export const currentPlayerId = writable<PlayerId>();
export const isEliminated = writable<boolean>(false);
