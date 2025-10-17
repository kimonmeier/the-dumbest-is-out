<script lang="ts">
	import { GameManager } from '@client/lib/services/GameManager';
	import { isVoting, votedPlayer } from '@client/lib/stores/VotingStore';
	import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';

	export let playerId: PlayerId;

	function voteForPlayer() {
		console.log('Voting for player', playerId);

		if ($votedPlayer !== null) {
			return;
		}

		$votedPlayer = playerId;
		GameManager.getInstance().Socket.emit('NOMINATE_DUMBEST_PLAYER', playerId);
	}

	function getBackgroundColor(): string {
		let value = '';

		if ($votedPlayer === null) {
			value += 'hover:bg-red-400 text-transparent hover:text-white ';
		}

		if ($votedPlayer === playerId) {
			value += 'bg-red-400 text-white';
		} else {
			value += 'bg-transparent text-transparent';
		}

		return value;
	}
</script>

{#if $isVoting}
	<button
		class="absolute w-32 h-16 rounded-tl-2xl rounded-none overflow-hidden"
		on:click={voteForPlayer}
	>
		<div
			class="{getBackgroundColor()} w-full h-full flex flex-col justify-center items-center rounded-br-3xl rounded-tl-2xl"
		>
			Vote!
		</div>
	</button>
{/if}
