import { Server, Socket } from 'socket.io';
import { HistoryManager } from './HistoryManager';
import type { ClientToServerEvents } from '@gameshow-lib/message/ClientToServerEvents';
import type { ServerToClientEvents } from '@gameshow-lib/message/ServerToClientEvents';
import { randomUUID } from 'node:crypto';
import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import { PUBLIC_ROOM_CODE } from '@server/Konst';

export type AppServer = Server<ClientToServerEvents, ServerToClientEvents, object, object>;
export type AppSocket = Socket<ClientToServerEvents, ServerToClientEvents, object, object>;

export class App {
	private readonly webSocket: AppServer;
	private readonly historyManager: HistoryManager;

	public constructor() {
		this.webSocket = new Server<ClientToServerEvents, ServerToClientEvents, object, object>({
			connectionStateRecovery: {}
		});

		this.historyManager = new HistoryManager(this.webSocket);
	}

	public startApp(): void {
		console.log('Websocket wurde gestartet!');

		this.webSocket.on('connect', () => {
			console.log('Something is trying to connect');
		});

		this.webSocket.on('connect', async (socket) => {
			const userId = randomUUID() as PlayerId;

			socket.join(userId);
			socket.join(PUBLIC_ROOM_CODE);

			this.historyManager.registerSocket(socket, userId);
		});

		this.webSocket.listen(Deno.env.get('PORT') ?? 3000);
	}
}
