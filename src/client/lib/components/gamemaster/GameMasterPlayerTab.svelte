<script lang="ts">
	import { playerStore } from '@client/lib/stores/PlayerStore';
	import GameMasterPlayerTabPlayer from './GameMasterPlayerTabPlayer.svelte';
	import { countdown, gameCode } from '@client/lib/stores/GameStore';
	import Timer from '../timer/Timer.svelte';

	function copyPublicUrl() {
		navigator.clipboard.writeText(window.location.host + '/?public=true&roomCode=' + $gameCode);
	}
</script>

<h3 on:dblclick={copyPublicUrl}>GameCode: {$gameCode}</h3>
<h3>
	{#if $countdown}
		<Timer countFrom={countdown} />
	{:else}
		Kein Countdown
	{/if}
</h3>
<div class="flex flex-col">
	{#each $playerStore as player}
		<GameMasterPlayerTabPlayer playerId={player.id} />
	{/each}
</div>
