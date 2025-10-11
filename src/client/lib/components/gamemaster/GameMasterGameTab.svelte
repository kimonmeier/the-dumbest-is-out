<script lang="ts">
	import {
		countdown,
		currentAnswer,
		currentQuestion,
		gameCode
	} from '@client/lib/stores/GameStore';
	import GroupBox from '../groupBox/GroupBox.svelte';
	import { GameManager } from '@client/lib/services/GameManager';
	import Timer from '../timer/Timer.svelte';
	import { isVoting, votingSummaryStore } from '@client/lib/stores/VotingStore';
	import { playerStore } from '@client/lib/stores/PlayerStore';

	function startGame() {
		GameManager.getInstance().Socket.emit('START_ROUND', $gameCode!, 300);
	}

	function rightAnswer() {
		GameManager.getInstance().Socket.emit('PLAYER_ANSWERED', $gameCode!, true);
	}

	function wrongAnswer() {
		GameManager.getInstance().Socket.emit('PLAYER_ANSWERED', $gameCode!, false);
	}

	function endRound() {
		GameManager.getInstance().Socket.emit('END_ROUND', $gameCode!);
	}

	function startVoting() {
		GameManager.getInstance().Socket.emit('START_VOTING', $gameCode!);
	}

	function stopVoting() {
		GameManager.getInstance().Socket.emit('STOP_VOTING', $gameCode!);
	}
</script>

<div class="flex flex-col">
	<GroupBox title="Spiel">
		{#if $countdown}
			<Timer countFrom={$countdown} />
			<div class="text-2xl font-bold">{$currentQuestion}</div>
			<div class="text-2xl font-bold">{$currentAnswer}</div>
			<div class="flex flex-row">
				<button class="bg-red-400" on:click={rightAnswer}>Richtig</button>
				<button class="bg-green-400" on:click={wrongAnswer}>Falsch</button>
			</div>
			<button class="bg-yellow-400" on:click={endRound}>Runde beenden</button>
		{:else}
			<h1>NO GAME IN PROGRESS</h1>
			<button class="bg-green-400" on:click={startGame}>Runde starten</button>
		{/if}
	</GroupBox>
	<GroupBox title="Voting">
		{#if $isVoting}
			<p>Voting läuft</p>
			<GroupBox title="Voting Zusammenfassung">
				<div class="flex flex-col">
					{#each $votingSummaryStore as vote}
						<div class="flex flex-row">
							<div class="flex-grow">{$playerStore.find((x) => x.id == vote.playerId)?.name}</div>
							<div>{vote.voteCount}</div>
						</div>
					{/each}
				</div>
			</GroupBox>
			<GroupBox title="Spieler Voting">
				<div class="flex flex-col">
					{#each $playerStore as player}
						<div class="flex flex-row">
							<div class="flex-grow">{player.name}</div>
							{#if player.votedForDumbest !== null}
								<div class="flex-grow">
									{$playerStore.find((x) => x.id == player.votedForDumbest)?.name}
								</div>
							{:else}
								<div class="flex-grow text-red-400">Noch nicht gevotet</div>
							{/if}
						</div>
					{/each}
				</div>
			</GroupBox>
			<button class="bg-red-400" on:click={stopVoting}>Voting stoppen</button>
		{:else}
			<p>Kein Voting aktiv</p>
			<button class="bg-green-400" on:click={startVoting}>Voting starten</button>
		{/if}
	</GroupBox>
</div>
