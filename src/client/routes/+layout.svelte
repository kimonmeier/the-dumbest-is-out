<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { backgroundMusicStore, backgroundMusicVolume } from '@client/lib/stores/AudioStore';
	import { Sound } from '@client/lib/components/sounds/Sound';

	import backgroundMusic from '$lib/assets/background_music.mp3';

	$backgroundMusicStore = new Sound(backgroundMusic, backgroundMusicVolume, {
		loop: true
	});

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children?.()}
