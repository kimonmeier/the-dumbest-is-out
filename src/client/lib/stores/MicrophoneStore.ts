import { get, readable, writable } from 'svelte/store';
import { GameManager } from '../services/GameManager';

export const speakingThreshold = writable(10); // Adjust this threshold to a suitable value

export const microphoneSpeakingVolume = readable<number | null>(null, (set) => {
	let audioContext: AudioContext;
	let analyser: AnalyserNode;
	let microphone: MediaStreamAudioSourceNode;
	let intervalId: number;

	const setupAudio = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			audioContext = new AudioContext();
			analyser = audioContext.createAnalyser();
			microphone = audioContext.createMediaStreamSource(stream);

			analyser.smoothingTimeConstant = 0.8;
			analyser.fftSize = 256;

			microphone.connect(analyser);

			const dataArray = new Uint8Array(analyser.frequencyBinCount);

			intervalId = window.setInterval(() => {
				analyser.getByteFrequencyData(dataArray);
				const sum = dataArray.reduce((a, b) => a + b, 0);
				const average = sum / dataArray.length;
				set(average);
			}, 10);
		} catch (err) {
			console.error('Error accessing microphone:', err);
		}
	};

	setupAudio();

	return () => {
		clearInterval(intervalId);
		if (microphone) microphone.disconnect();
		if (analyser) analyser.disconnect();
		if (audioContext) audioContext.close();
	};
});

export const isSpeaking = readable(false, (set) => {
	let intervalId: number;
	let lastValue: boolean = false;
	intervalId = window.setInterval(() => {
		const average = get(microphoneSpeakingVolume);
		const threshold = get(speakingThreshold);
		const isAboveThreshold = average !== null && average > threshold;

		set(isAboveThreshold);

		// TODO: Maybe outsource this code, so that it isn't directly in the store
		if (GameManager.getInstance().IsConnected) {
			if (lastValue === isAboveThreshold) {
				return;
			}

			GameManager.getInstance().Socket.emit('IS_SPEAKING', isAboveThreshold);
		}

		lastValue = isAboveThreshold;
	}, 250);

	return () => {
		clearInterval(intervalId);
	};
});
