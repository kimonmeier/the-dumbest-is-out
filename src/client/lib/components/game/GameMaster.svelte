<script lang="ts">
	import { gameMasterUrl } from '@client/lib/stores/CredentialStore';
	import VodNinjaWrapper from '../cam/VodNinjaWrapper.svelte';
	import { countdown, currentQuestion, playersAnswer } from '@client/lib/stores/GameStore';
	import { fade } from 'svelte/transition';
	import Timer from '../timer/Timer.svelte';

	export { className as class };

	let className = '';

	function getTextColor(value: boolean | null): string {
		if (value == null) {
			return '';
		}

		if (value) {
			return 'text-green-300';
		}

		return 'text-red-300';
	}
</script>

<div
	class="w-full h-full flex flex-col justify-center items-center border-4 bg-slate-700 rounded-3xl overflow-hidden {className}"
>
	{#if $countdown}
		<Timer countFrom={countdown} class="absolute left-1/3 top-3/10 text-3xl" />
	{/if}
	<VodNinjaWrapper url={$gameMasterUrl} />
	{#key $currentQuestion}
		<div
			in:fade
			out:fade
			class="text-center absolute text-3xl top-2/3 break-words max-w-1/3 {getTextColor(
				$playersAnswer
			)}"
		>
			{$currentQuestion}
		</div>
	{/key}
</div>
