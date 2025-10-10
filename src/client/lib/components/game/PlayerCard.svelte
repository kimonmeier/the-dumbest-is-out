<script lang="ts">
	import type { PlayerModel } from '@client/lib/models/PlayerModel';
	import VodNinjaWrapper from '../cam/VodNinjaWrapper.svelte';

	export const player: PlayerModel = undefined!;
</script>

<div class="w-full h-full flex flex-col justify-center items-center border-4">
	<VodNinjaWrapper url={player.link} />
</div>
