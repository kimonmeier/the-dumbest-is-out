<script lang="ts">
	import { gameMasterUrl } from '@client/lib/stores/CredentialStore';
	import VodNinjaWrapper from '../cam/VodNinjaWrapper.svelte';
	import { countdown, currentQuestion } from '@client/lib/stores/GameStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Timer from '../timer/Timer.svelte';

	export { className as class };

	let className = '';

	onMount(() => {
		$currentQuestion = null;
		setTimeout(() => {
			$gameMasterUrl = 'https://vdo.ninja/?view=J9GN9Uq';
			$currentQuestion = 'DIE SCHHEISEN DRECK ISCH DUMM?';
			console.log($currentQuestion);

			setTimeout(() => {
				$currentQuestion = 'Du hast mich entlarvt, du dumme Sau!';
				$countdown = 30;

				setTimeout(() => {
					$countdown = null;
				}, 35000);
			}, 5000);
		}, 2500);
	});
</script>

<div
	class="w-full h-full flex flex-col justify-center items-center border-4 bg-slate-700 rounded-3xl overflow-hidden {className}"
>
	{#if $countdown}
		<Timer countFrom={$countdown} class="absolute left-1/3 top-3/10 text-3xl" />
	{/if}
	<VodNinjaWrapper url={$gameMasterUrl} />
	{#key $currentQuestion}
		<div in:fade out:fade class="text-center absolute text-3xl top-2/3">{$currentQuestion}</div>
	{/key}
</div>
