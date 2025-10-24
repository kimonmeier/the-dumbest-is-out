<script lang="ts">
	import { playerStore } from '@client/lib/stores/PlayerStore';
	import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';
	import Select from '../select/Select.svelte';
	import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
	import { GameManager } from '@client/lib/services/GameManager';

	const items: PlayerStatus[] = [PlayerStatus.Playing, PlayerStatus.Eliminated];

	export let playerId: PlayerId;

	function changePlayerStatus() {
		GameManager.getInstance().Socket.emit('CHANGE_PLAYER_STATUS', playerId, currentPlayer.status);
	}

	$: currentPlayer = $playerStore.find((x) => x.id == playerId)!;
</script>

<div class="flex flex-row h-10 gap-5 items-center">
	<div class="flex-grow font-bold">{currentPlayer?.name ?? 'Spieler'}</div>
	<div class="font-bold px-2">{currentPlayer.points}</div>
	<Select {items} bind:value={currentPlayer.status} class="w-10" on:blur={changePlayerStatus} />
</div>
