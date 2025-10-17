import { writable } from 'svelte/store';
import { Sound } from '../components/sounds/Sound';

export const backgroundMusicStore = writable<Sound>();
export const backgroundMusicVolume = writable<number>(0.1);

export const rightAnswerSoundStore = writable<Sound>();
export const rightAnswerSoundVolume = writable<number>(0.1);
export const wrongAnswerSoundStore = writable<Sound>();
export const wrongAnswerSoundVolume = writable<number>(0.1);
