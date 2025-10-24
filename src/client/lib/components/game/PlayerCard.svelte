<script lang="ts">
	import type { PlayerModel } from '@client/lib/models/PlayerModel';
	import VodNinjaWrapper from '../cam/VodNinjaWrapper.svelte';
	import PlayerName from './PlayerName.svelte';
	import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
	import Icon from '@iconify/svelte';
	import PlayerVoteButton from './PlayerVoteButton.svelte';
	import { currentPlayerAsking } from '@client/lib/stores/GameStore';

	export let player: PlayerModel;
	export { className as class };

	let className = '';
	$: hasControl = $currentPlayerAsking == player.id;
</script>

<div
	class="{className} {player.isSpeaking ? 'border-green-500' : 'border-[#1e699c]'} {hasControl
		? 'pulseCam'
		: ''} flex flex-col rounded-3xl rounded-b-2xl border-8 my-auto shadow-lg shadow-black text-xl relative aspect-video mx-20"
>
	{#if player.status == PlayerStatus.Eliminated}
		<PlayerName name={player.name} />
		<Icon icon="mdi:skull" class="w-full h-full text-red-400 opacity-70" />
	{:else}
		<PlayerVoteButton playerId={player.id} />
		<PlayerName name={player.name} />

		{#if player.link?.match(/^https:\/\/vdo\.ninja/)}
			<VodNinjaWrapper url={player.link} />
		{:else}
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<!-- svelte-ignore a11y_missing_attribute -->
			<img src={player.link} class="w-full h-full rounded-b-lg rounded-t-2xl object-contain" />
		{/if}
	{/if}
</div>

<style>
	@keyframes pulse-animation {
		0% {
			box-shadow: 0px 0px 30px 7.5px rgba(255, 0, 0, 0.4);
		}
		50% {
			box-shadow: 0px 0px 30px 15px rgba(255, 0, 0, 0.9);
		}
		100% {
			box-shadow: 0px 0px 30px 7.5px rgba(255, 0, 0, 0.4);
		}
	}

	.pulseCam {
		animation: pulse-animation 5s infinite linear;
	}
</style>
