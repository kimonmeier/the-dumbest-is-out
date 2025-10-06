import type { BasicManager } from './BasicManager.ts';
import type { AppServer, AppSocket } from './App.ts';
import type { ServerToClientEvents } from '@gameshow-lib/message/ServerToClientEvents.ts';
import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes.ts';

type EventType = keyof ServerToClientEvents;
// Define a type for the history entries
type EventHistoryEntry<Ev extends EventType> = {
	event: Ev;
	args: unknown[];
};

export class HistoryManager implements BasicManager {
	private readonly connection: AppServer;
	// Define the history array to store events and arguments
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private eventHistory: Map<GameCode, EventHistoryEntry<any>[]> = new Map();

	public constructor(connection: AppServer) {
		this.connection = connection;
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public registerSocket(socket: AppSocket, uuid: PlayerId) {}

	public PublishHistory(socket: AppSocket, gameCode: GameCode): void {
		if (!this.eventHistory.has(gameCode)) {
			this.eventHistory.set(gameCode, []);
		}

		this.eventHistory.get(gameCode)!.forEach((element) => {
			socket.emit(element.event, ...element.args);
		});
	}

	public SendAndSaveToHistory<Ev extends EventType>(
		gameCode: GameCode,
		ev: Ev,
		...args: unknown[]
	) {
		this.SaveToHistory(gameCode, ev, ...args);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.connection.to(gameCode).emit(ev, ...(args as any));
	}

	public SaveToHistory<Ev extends EventType>(gameCode: GameCode, ev: Ev, ...args: unknown[]) {
		if (!this.eventHistory.has(gameCode)) {
			this.eventHistory.set(gameCode, []);
		}

		this.eventHistory.get(gameCode)!.push({
			event: ev,
			args: args
		});
	}
}
