<script lang="ts">
	import GameMaster from '@client/lib/components/game/GameMaster.svelte';
	import PlayerCard from '@client/lib/components/game/PlayerCard.svelte';
	import { playerStore } from '@client/lib/stores/PlayerStore';
</script>

<div class="w-full h-full grid grid-cols-3 grid-rows-3">
	<GameMaster class="row-start-2 col-start-2" />
	{#each $playerStore as player (player.id)}
		<PlayerCard {player} />
	{/each}
</div>
