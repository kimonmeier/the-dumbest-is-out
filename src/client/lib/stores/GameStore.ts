import type { GameCode } from '@gameshow-lib/message/OpaqueTypes';
import { writable } from 'svelte/store';

export const gameCode = writable<GameCode | undefined>(undefined);
