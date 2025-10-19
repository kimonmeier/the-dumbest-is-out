<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import {
		backgroundMusicStore,
		backgroundMusicVolume,
		rightAnswerSoundStore,
		rightAnswerSoundVolume,
		wrongAnswerSoundStore,
		wrongAnswerSoundVolume
	} from '@client/lib/stores/AudioStore';
	import { Sound } from '@client/lib/components/sounds/Sound';

	import backgroundMusic from '$lib/assets/background_music.mp3';
	import rightAnswerSound from '$lib/assets/right_answer.mp3';
	import wrongAnswerSound from '$lib/assets/wrong_answer.mp3';

	$backgroundMusicStore = new Sound(backgroundMusic, backgroundMusicVolume, {
		loop: true
	});

	$rightAnswerSoundStore = new Sound(rightAnswerSound, rightAnswerSoundVolume);
	$wrongAnswerSoundStore = new Sound(wrongAnswerSound, wrongAnswerSoundVolume);

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
