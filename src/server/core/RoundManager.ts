import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import type { AppSocket } from './App';
import type { BasicManager } from './BasicManager';
import type { GameshowEventBus } from '@server/events/Eventbus';
import type { HistoryManager } from './HistoryManager';
import type { PlayerManager } from './PlayerManager';
import { PlayerStatus } from '@gameshow-lib/enums/PlayerStatus';

export class RoundManager implements BasicManager {
	private readonly historyManager: HistoryManager;
	private readonly playerManager: PlayerManager;
	private readonly eventBus: GameshowEventBus;

	private readonly playerCurrentlyAnswering: Map<GameCode, PlayerId> = new Map();
	private readonly playersVoted: Map<GameCode, PlayerId[]> = new Map();

	constructor(
		historyManager: HistoryManager,
		playerManager: PlayerManager,
		eventBus: GameshowEventBus
	) {
		this.historyManager = historyManager;
		this.playerManager = playerManager;
		this.eventBus = eventBus;
	}

	public registerSocket(socket: AppSocket, uuid: PlayerId): void {
		socket
			.on('START_ROUND', this.startRound.bind(this))
			.on('END_ROUND', this.endRound.bind(this))
			.on('START_VOTING', this.startVoting.bind(this))
			.on('STOP_VOTING', this.stopVoting.bind(this))
			.on('PLAYER_ANSWERED', (code, rightAnswer) => this.handlePlayerAnswered(code, rightAnswer))
			.on('NOMINATE_DUMBEST_PLAYER', (dumbestPlayerId) =>
				this.nominateDumbestPlayer(uuid, dumbestPlayerId)
			);
	}

	private startRound(roomCode: GameCode, playerToStart: PlayerId, timeInSeconds: number): void {
		this.historyManager.SendAndSaveToHistory(roomCode, 'START_ROUND', timeInSeconds);
		this.eventBus.dispatch({
			event: {
				type: 'START_ROUND',
				payload: {
					roomCode: roomCode,
					timeInSeconds: timeInSeconds
				}
			}
		});

		this.playerCurrentlyAnswering.set(roomCode, playerToStart);
		this.historyManager.SendAndSaveToHistory(roomCode, 'PLAYER_IS_ANSWERING', playerToStart);
	}

	private endRound(roomCode: GameCode): void {
		this.historyManager.SendAndSaveToHistory(roomCode, 'END_ROUND');
		this.historyManager.SendAndSaveToHistory(roomCode, 'PLAYER_IS_ANSWERING', null);
	}

	private startVoting(roomCode: GameCode): void {
		this.historyManager.SendAndSaveToHistory(roomCode, 'STARTED_VOTING');
	}

	private stopVoting(roomCode: GameCode): void {
		this.historyManager.SendAndSaveToHistory(roomCode, 'STOPPED_VOTING');

		let votes = this.playersVoted.get(roomCode)!;
		this.playersVoted.set(roomCode, []);

		let count: Map<PlayerId, number> = new Map();

		if (!votes) {
			console.warn('No votes found for room ' + roomCode + ', skipping elimination.');
		}

		votes.forEach((v) => {
			if (!count.has(v)) {
				count.set(v, 0);
			}
			count.set(v, count.get(v)! + 1);
		});

		let maxVotes = 0;
		let playerWithMaxVotes: PlayerId | null = null;
		count.forEach((v, k) => {
			if (v > maxVotes) {
				maxVotes = v;
				playerWithMaxVotes = k;
			}
		});

		if (!playerWithMaxVotes) {
			console.warn('No player with max votes found, skipping elimination.');
			return;
		}

		this.playerManager.eliminatePlayer(playerWithMaxVotes);
	}

	private handlePlayerAnswered(roomCode: GameCode, rightAnswer: boolean): void {
		this.historyManager.SendAndSaveToHistory(
			roomCode,
			'PLAYER_ANSWERED',
			this.playerCurrentlyAnswering.get(roomCode),
			rightAnswer
		);
		this.selectNextPlayerToAskQuestion(roomCode);
	}

	private nominateDumbestPlayer(playerVoted: PlayerId, dumbestPlayerId: PlayerId): void {
		let roomCode = this.playerManager.getGamecodeByPlayer(playerVoted);

		this.playersVoted.set(roomCode, [...(this.playersVoted.get(roomCode) ?? []), dumbestPlayerId]);

		this.historyManager.SendAndSaveToHistory(
			roomCode,
			'PLAYER_VOTED',
			playerVoted,
			dumbestPlayerId
		);
	}

	private selectNextPlayerToAskQuestion(roomCode: GameCode): void {
		let playingPlayers = this.playerManager
			.getPlayers(roomCode)
			.filter((p) => p.status === PlayerStatus.Playing);

		if (playingPlayers.length === 0) {
			return;
		}

		const currentPlayerId = this.playerCurrentlyAnswering.get(roomCode);
		let nextPlayerIndex = 0;

		if (currentPlayerId) {
			const currentPlayerIndex = playingPlayers.findIndex((p) => p.playerId === currentPlayerId);
			nextPlayerIndex = (currentPlayerIndex + 1) % playingPlayers.length;
		}

		const nextPlayer = playingPlayers[nextPlayerIndex];
		this.playerCurrentlyAnswering.set(roomCode, nextPlayer.playerId);

		this.historyManager.SendAndSaveToHistory(roomCode, 'PLAYER_IS_ANSWERING', nextPlayer.playerId);
	}
}
