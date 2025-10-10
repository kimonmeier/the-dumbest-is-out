import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import type { AppServer, AppSocket } from './App';
import type { BasicManager } from './BasicManager';
import type { GameshowEventBus } from '@server/events/Eventbus';
import type { HistoryManager } from './HistoryManager';

export class RoundManager implements BasicManager {
	private readonly historyManager: HistoryManager;
	private readonly eventBus: GameshowEventBus;

	constructor(historyManager: HistoryManager, eventBus: GameshowEventBus) {
		this.historyManager = historyManager;
		this.eventBus = eventBus;
	}

	public registerSocket(socket: AppSocket, uuid: PlayerId): void {
		socket
			.on('START_ROUND', this.startRound.bind(this))
			.on('END_ROUND', this.endRound.bind(this))
			.on('PLAYER_ANSWERED', (code, rightAnswer) => {
				console.log('Player', uuid, 'answered:', rightAnswer);
				// Implement player answer logic here
			})
			.on('NOMINATE_DUMBEST_PLAYER', (dumbestPlayerId) => {
				console.log('Player', uuid, 'nominated player:', dumbestPlayerId);
				// Implement nomination logic here
			});
	}

	private startRound(roomCode: GameCode, timeInSeconds: number): void {
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
	}

	private endRound(roomCode: GameCode): void {
		this.historyManager.SendAndSaveToHistory(roomCode, 'END_ROUND');
	}

	private handlePlayerAnswered(playerId: PlayerId, rightAnswer: boolean): void {
		// Handle player answer logic
	}

	private nominateDumbestPlayer(dumbestPlayerId: PlayerId): void {
		// Handle nomination logic
	}
}
