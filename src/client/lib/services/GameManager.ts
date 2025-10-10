import { goto, invalidateAll } from '$app/navigation';
import type { ClientToServerEvents } from '@gameshow-lib/message/ClientToServerEvents';
import type { ServerToClientEvents } from '@gameshow-lib/message/ServerToClientEvents';
import { io, Socket } from 'socket.io-client';
import { playerStore } from '../stores/PlayerStore';
import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';
import { gameMasterUrl } from '../stores/CredentialStore';

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
			);
	}

	private playerJoined(playerId: PlayerId, name: string, link: string): void {
		playerStore.addPlayer({
			id: playerId,
			name: name,
			link: link,
			status: PlayerStatus.Playing,
			isSpeaking: false
		});
	}

	private playerLeft(playerId: PlayerId): void {
		playerStore.removePlayer(playerId);
	}

	private gameMasterLogin(url: string): void {
		gameMasterUrl.set(url);
	}

	private playerOut(playerId: PlayerId): void {
		playerStore.eliminatePlayer(playerId);
	}

	private playerIsSpeaking(playerId: PlayerId, isSpeaking: boolean): void {
		playerStore.updateSpeakingStatus(playerId, isSpeaking);
	}
}
