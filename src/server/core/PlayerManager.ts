import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import type { AppServer, AppSocket } from './App';
import type { BasicManager } from './BasicManager';
import type { HistoryManager } from './HistoryManager';
import type { Player } from '@server/models/Player';
import { PUBLIC_ROOM_CODE } from '@server/Konst';
import StringHelper from '@gameshow-lib/utils/StringUtils';
import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';

export class PlayerManager implements BasicManager {
	private readonly historyManager: HistoryManager;
	private readonly server: AppServer;

	private players: Map<PlayerId, Player> = new Map();
	private rooms: Map<GameCode, PlayerId[]> = new Map();

	public constructor(historyManager: HistoryManager, server: AppServer) {
		this.historyManager = historyManager;
		this.server = server;
	}

	public registerSocket(socket: AppSocket, uuid: PlayerId): void {
		socket
			.on('disconnect', () => this.disconnectPlayer(uuid))
			.on('PLAYER_CONNECTING', (name, link, gameCode, callback) =>
				callback(this.connectPlayer(socket, uuid, gameCode, name, link))
			)
			.on('GAME_MASTER_CONNECTING', (twitchName, link, callback) => {
				const roomCode = StringHelper.generateRandomString(12) as GameCode;

				this.rooms.set(roomCode, [...(this.rooms.get(roomCode) ?? []), uuid]);
				this.historyManager.SendAndSaveToHistory(roomCode, 'GAMEMASTER_LOGIN', link);
				this.historyManager.SendAndSaveToHistory(roomCode, 'SET_STREAMER_NAME', twitchName);

				socket.join(roomCode);
				socket.join('game-master-' + roomCode);

				callback(uuid, roomCode);
			})
			.on('PUBLIC_CONNECTING', (roomCode) => {
				this.rooms.set(roomCode, [...(this.rooms.get(roomCode) ?? []), uuid]);
				socket.join(roomCode);
				socket.join(PUBLIC_ROOM_CODE + '-' + roomCode);
				this.historyManager.PublishHistory(socket, roomCode);
			})
			.on('IS_SPEAKING', (speaking) => this.playerIsSpeaking(uuid, speaking))
			.on('CHANGE_PLAYER_STATUS', (playerId, status) => this.changePlayerStatus(playerId, status));
	}

	private connectPlayer(
		socket: AppSocket,
		playerId: PlayerId,
		roomCode: GameCode,
		name: string,
		link: string
	): PlayerId {
		this.players.set(playerId, {
			playerId: playerId,
			name: name,
			link: link,
			roomCode: roomCode,
			status: PlayerStatus.Playing,
			isSpeaking: false
		});

		socket.join(roomCode);
		socket.leave(PUBLIC_ROOM_CODE);

		this.rooms.set(roomCode, [...(this.rooms.get(roomCode) ?? []), playerId]);

		this.historyManager.PublishHistory(socket, roomCode);

		this.historyManager.SendAndSaveToHistory(roomCode, 'PLAYER_JOINED', playerId, name, link);

		console.log('Player connected', playerId, roomCode, name);
		console.log('Rooms:', socket.rooms);

		return playerId;
	}

	private disconnectPlayer(playerId: PlayerId): void {
		let gameRoomCode: GameCode;
		this.rooms.forEach((playerIds, roomCode) => {
			if (playerIds.includes(playerId)) {
				this.rooms.set(
					roomCode,
					playerIds.filter((id) => id !== playerId)
				);
				gameRoomCode = roomCode;
			}
		});

		this.players.delete(playerId);

		this.historyManager.SendAndSaveToHistory(gameRoomCode!, 'PLAYER_LEFT', playerId);
	}

	private playerIsSpeaking(playerId: PlayerId, speaking: boolean): void {
		const player = this.players.get(playerId);
		if (!player) {
			return;
		}

		if (player.isSpeaking === speaking) {
			return;
		}

		player.isSpeaking = speaking;
		this.players.set(playerId, player);

		this.historyManager.SendAndSaveToHistory(
			player.roomCode,
			'PLAYER_SPEAKING_STATUS_CHANGED',
			playerId,
			speaking
		);
	}

	public getGamecodeByPlayer(id: PlayerId): GameCode {
		let retVal: GameCode | null = null;
		this.rooms.forEach((players, room) => {
			if (players.find((x) => x == id)) {
				retVal = room;
			}
		});

		if (!retVal) {
			throw new Error('Room not found');
		}

		return retVal;
	}

	public getPlayers(roomCode: GameCode): Player[] {
		return (
			this.players
				.values()
				.filter((x) => x.roomCode === roomCode)
				?.toArray() ?? []
		);
	}

	public eliminatePlayer(playerWithMaxVotes: PlayerId) {
		this.players.get(playerWithMaxVotes)!.status = PlayerStatus.Eliminated;
		this.historyManager.SendAndSaveToHistory(
			this.players.get(playerWithMaxVotes)!.roomCode,
			'PLAYER_OUT',
			playerWithMaxVotes
		);
	}

	private changePlayerStatus(uuid: PlayerId, status: PlayerStatus): void {
		this.players.get(uuid)!.status = status;
		this.historyManager.SendAndSaveToHistory(
			this.players.get(uuid)!.roomCode,
			'CHNAGE_PLAYER_STATUS',
			uuid,
			status
		);
	}
}
