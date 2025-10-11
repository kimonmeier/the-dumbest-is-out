<script lang="ts">
	import { GameManager } from '@client/lib/services/GameManager';
	import { isVoting, votedPlayer } from '@client/lib/stores/VotingStore';
	import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';

	export let playerId: PlayerId;

	function voteForPlayer() {
		if ($votedPlayer !== null) {
			return;
		}

		GameManager.getInstance().Socket.emit('NOMINATE_DUMBEST_PLAYER', playerId);
		$votedPlayer = playerId;
	}
</script>

{#if $isVoting}
	<div class="absolute w-32 h-16 rounded-tl-2xl rounded-none overflow-hidden">
		<button
			class="hover:bg-red-400 bg-transparent w-full h-full flex flex-col justify-center items-center rounded-br-3xl rounded-tl-2xl"
			on:click={voteForPlayer}
		>
			Vote!
		</button>
	</div>
{/if}
