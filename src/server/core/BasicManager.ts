import type { PlayerId } from '@gameshow-lib/message/OpaqueTypes.ts';
import type { AppSocket } from './App.ts';

export interface BasicManager {
	registerSocket: (socket: AppSocket, uuid: PlayerId) => void;
}
