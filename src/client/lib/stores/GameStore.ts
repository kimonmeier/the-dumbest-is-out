import type { PlayerId, GameCode } from '@gameshow-lib/message/OpaqueTypes';
import { writable } from 'svelte/store';

export const gameCode = writable<GameCode | undefined>(undefined);
export const currentQuestion = writable<string | null>(null);
export const currentAnswer = writable<string | null>(null);
export const currentPlayerAsking = writable<PlayerId | null>(null);
export const countdown = writable<number | null>(null);
