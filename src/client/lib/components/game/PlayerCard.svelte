<script lang="ts">
	import type { PlayerModel } from '@client/lib/models/PlayerModel';
	import VodNinjaWrapper from '../cam/VodNinjaWrapper.svelte';
	import PlayerName from './PlayerName.svelte';
	import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
	import Icon from '@iconify/svelte';
	import PlayerVoteButton from './PlayerVoteButton.svelte';

	export let player: PlayerModel;
	export { className as class };

	let className = '';
</script>

<div
	class="{className} {player.isSpeaking
		? 'border-green-500'
		: 'border-[#1e699c]'} flex flex-col rounded-3xl rounded-b-2xl border-8 m-24 my-auto shadow-lg shadow-black text-xl relative"
>
	{#if player.status == PlayerStatus.Eliminated}
		<PlayerName name={player.name} />
		<Icon icon="mdi:skull" class="w-full h-full text-gray-700 opacity-70" />
	{:else}
		<PlayerVoteButton playerId={player.id} />
		<PlayerName name={player.name} />
		<VodNinjaWrapper url={player.link} />
	{/if}
</div>
