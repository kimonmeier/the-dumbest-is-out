<script lang="ts">
	import {
		backgroundMusicVolume,
		rightAnswerSoundVolume,
		wrongAnswerSoundVolume
	} from '@client/lib/stores/AudioStore';
	import GroupBox from '../groupBox/GroupBox.svelte';
	import Modal from '../modal/Modal.svelte';
	import {
		isSpeaking,
		microphoneSpeakingVolume,
		speakingThreshold
	} from '@client/lib/stores/MicrophoneStore';

	export let showModal: boolean;
</script>

<Modal bind:showModal>
	<GroupBox title="Mikrofon">
		<div class="flex flex-col w-full gap-5">
			<div class="flex flex-row">
				<div>Empfindlichkeit (je höher, desto eher wird dein Mikrofon als sprechend erkannt):</div>
				<input type="range" bind:value={$speakingThreshold} min={0} max={100} step="0.1" />
			</div>
			<div class="flex flex-row">
				<div>Aktueller Pegel:</div>
				<progress class="w-full" max="100" value={$microphoneSpeakingVolume}></progress>
			</div>
			<div class="flex flex-row">
				<div>Wird als sprechend erkannt:</div>
				{#if $isSpeaking}
					<span class="text-green-500 font-bold">Ja</span>
				{:else}
					<span class="text-red-500 font-bold">Nein</span>
				{/if}
			</div>
		</div>
	</GroupBox>
	<GroupBox title="Musik" class="w-full">
		<div class="flex flex-col w-full gap-5">
			<div class="flex flex-row">
				<div>Lautstärke normale Musik:</div>

				<input type="range" bind:value={$backgroundMusicVolume} min={0} max={1} step="0.005" />
			</div>
			<div class="flex flex-row">
				<div>Lautstärke richtige Antwort:</div>

				<input type="range" bind:value={$rightAnswerSoundVolume} min={0} max={0.5} step="0.005" />
			</div>
			<div class="flex flex-row">
				<div>Lautstärke falsche Antwort:</div>

				<input type="range" bind:value={$wrongAnswerSoundVolume} min={0} max={0.5} step="0.005" />
			</div>
		</div>
	</GroupBox>
</Modal>
