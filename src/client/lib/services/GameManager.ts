import { goto, invalidateAll } from '$app/navigation';
import type { ClientToServerEvents } from '@gameshow-lib/message/ClientToServerEvents';
import type { ServerToClientEvents } from '@gameshow-lib/message/ServerToClientEvents';
import { io, Socket } from 'socket.io-client';
import { playerStore } from '../stores/PlayerStore';
import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
import {
	currentPlayerId,
	gameMasterUrl,
	isEliminated,
	isGamemaster
} from '../stores/CredentialStore';
import { isVoting, votedPlayer, votingSummaryStore } from '../stores/VotingStore';
import {
	countdown,
	currentAnswer,
	currentPlayerAsking,
	currentQuestion,
	playersAnswer
} from '../stores/GameStore';
import {
	backgroundMusicStore,
	rightAnswerSoundStore,
	wrongAnswerSoundStore
} from '../stores/AudioStore';
import { get } from 'svelte/store';

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

export class GameManager {
	private static instance: GameManager;

	public static getInstance(): GameManager {
		if (GameManager.instance == undefined) {
			new GameManager();
		}

		return GameManager.instance;
	}

	private client!: AppSocket;

	private constructor() {
		GameManager.instance = this;
	}

	public get IsConnected() {
		return this.client?.connected ?? false;
	}

	public get Socket() {
		return this.client;
	}

	public startApp(): void {
		this.client = io({
			autoConnect: true,
			reconnection: true,
			reconnectionAttempts: 10000
		});
		this.registerHandlers(this.client);

		this.client.connect();
	}

	public stopApp(): void {
		this.client.disconnect();

		invalidateAll().then(() => {
			console.log('Successfully invalidated all');
			goto('').then(() => {
				console.log('Rerouted to login!');
			});
		});
	}

	public async awaitConnection(timeout: number): Promise<boolean> {
		console.log('await connection');
		let index = 0;
		while (!this.client.connected && index < timeout) {
			console.log('Checking', this.client.connected, index);
			await new Promise((r) => setTimeout(r, 250));
			index++;
		}

		console.log('No checking anymore');

		return this.client.connected;
	}

	private registerHandlers(socket: AppSocket): void {
		socket
			.on('PLAYER_JOINED', (id, name, link) => this.playerJoined(id, name, link))
			.on('PLAYER_LEFT', (id) => this.playerLeft(id))
			.on('GAMEMASTER_LOGIN', (url) => this.gameMasterLogin(url))
			.on('PLAYER_OUT', (playerId) => this.playerOut(playerId))
			.on('PLAYER_SPEAKING_STATUS_CHANGED', (playerId, isSpeaking) =>
				this.playerIsSpeaking(playerId, isSpeaking)
			)
			.on('PLAYER_VOTED', (playerId, votedFor) => this.votedForDumbest(playerId, votedFor))
			.on('STARTED_VOTING', () => this.startedVoting())
			.on('STOPPED_VOTING', () => this.stoppedVoting())
			.on('START_ROUND', (timeInSeconds) => this.startGame(timeInSeconds))
			.on('NEW_QUESTION', (question) => this.newQuestion(question))
			.on('NEW_ANSWER', (answer) => this.newAnswer(answer))
			.on('PLAYER_ANSWERED', (playerId, rightAnswer) => this.playerAnswered(playerId, rightAnswer))
			.on('END_ROUND', () => this.endRound())
			.on('PLAYER_IS_ANSWERING', (player) => this.isAnswering(player))
			.on('CHNAGE_PLAYER_STATUS', (playerId, status) => this.updatePlayerStatus(playerId, status));
	}

	private playerJoined(playerId: PlayerId, name: string, link: string): void {
		playerStore.addPlayer({
			id: playerId,
			name: name,
			link: link,
			status: PlayerStatus.Playing,
			isSpeaking: false,
			points: 0,
			votedForDumbest: null
		});
	}

	private playerLeft(playerId: PlayerId): void {
		playerStore.removePlayer(playerId);
	}

	private gameMasterLogin(url: string): void {
		gameMasterUrl.set(url);
	}

	private playerOut(playerId: PlayerId): void {
		playerStore.updatePlayerStatus(playerId, PlayerStatus.Eliminated);

		if (get(currentPlayerId) === playerId) {
			isEliminated.set(true);
		}
	}

	private playerIsSpeaking(playerId: PlayerId, isSpeaking: boolean): void {
		playerStore.updateSpeakingStatus(playerId, isSpeaking);
	}

	private startedVoting(): void {
		votingSummaryStore.reset();
		playerStore.clearVoting();
		playerStore.clearPoints();

		isVoting.set(true);
	}

	private stoppedVoting(): void {
		isVoting.set(false);
		votedPlayer.set(null);
	}

	private votedForDumbest(playerId: PlayerId, votedFor: PlayerId): void {
		votingSummaryStore.vote(votedFor);
		playerStore.votedForDumbest(playerId, votedFor);
	}

	private startGame(timeInSeconds: number): void {
		countdown.set(timeInSeconds);
		get(backgroundMusicStore).play();
	}

	private newQuestion(question: string): void {
		console.log('New Question:', question);

		let baseTimeout = 250;
		if (get(isGamemaster)) {
			baseTimeout = 10;
		}

		setTimeout(() => {
			currentQuestion.set(null);
			playersAnswer.set(null);
		}, baseTimeout);

		setTimeout(() => {
			currentQuestion.set(question);
		}, baseTimeout * 4);
	}

	private newAnswer(answer: string): void {
		console.log('New Answer:', answer);
		currentAnswer.set(answer);
	}

	private endRound(): void {
		countdown.set(null);
		currentQuestion.set('');
		currentAnswer.set('');
		get(backgroundMusicStore).play();
	}

	private isAnswering(player: PlayerId | null): void {
		currentPlayerAsking.set(player);
	}

	private updatePlayerStatus(playerId: PlayerId, status: PlayerStatus): void {
		playerStore.updatePlayerStatus(playerId, status);
	}

	private playerAnswered(playerId: PlayerId, rightAnswer: boolean): void {
		console.log('Player answered:', playerId, rightAnswer);

		playersAnswer.set(rightAnswer);
		if (rightAnswer) {
			get(rightAnswerSoundStore).play();
			playerStore.playerScored(playerId);
		} else {
			get(wrongAnswerSoundStore).play();
		}
	}
}
