import { writable } from 'svelte/store';
import { Sound } from '../components/sounds/Sound';

export const backgroundMusicStore = writable<Sound>();
export const backgroundMusicVolume = writable<number>(0.1);
