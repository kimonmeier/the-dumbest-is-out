<script lang="ts">
	import PlayerCard from '@client/lib/components/game/PlayerCard.svelte';
	import { playerStore } from '@client/lib/stores/PlayerStore';

	function getCols(playerLength: number): number {
		if (playerLength > 5) {
			return 6;
		}

		return 5;
	}

	function getRows(playerLength: number): number {
		if (playerLength > 5) {
			return 4;
		}

		return 3;
	}
</script>

<div
	class="w-full h-full grid grid-cols-{getCols($playerStore.length)} grid-rows-{getRows(
		$playerStore.length
	)}"
>
	{#each $playerStore as player}
		<PlayerCard {player} />
	{/each}
</div>
