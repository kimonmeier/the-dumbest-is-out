import type { GameCode, PlayerId } from '@gameshow-lib/message/OpaqueTypes';
import type { AppServer, AppSocket } from './App';
import type { BasicManager } from './BasicManager';
import type { Question } from '@server/models/Question';
import questionsData from '@server/data/questions.json' with { type: 'json' };
import type { HistoryManager } from './HistoryManager';
import type { GameshowEventBus } from '@server/events/Eventbus';
import { randomInt } from 'node:crypto';
import { PUBLIC_ROOM_CODE } from '@server/Konst';

export class QuestionManager implements BasicManager {
	private readonly historyManager: HistoryManager;
	private readonly appServer: AppServer;

	private questions: Question[] = [];
	private currentQuestion: Question | null = null;

	public constructor(
		historyManager: HistoryManager,
		appServrer: AppServer,
		eventBus: GameshowEventBus
	) {
		this.historyManager = historyManager;
		this.appServer = appServrer;

		eventBus.registerToEvent({
			event: 'START_ROUND',
			listener: (request) =>
				this.roundStart(request.payload.roomCode, request.payload.timeInSeconds)
		});

		this.questions = questionsData as Question[];
	}

	public registerSocket(socket: AppSocket, uuid: PlayerId): void {}

	private roundStart(roomCode: GameCode, timeInSeconds: number): void {
		this.chooseNextQuestion(roomCode);
	}

	private chooseNextQuestion(roomCode: GameCode): void {
		const randomQuestion = this.questions[randomInt(this.questions.length - 1)];

		this.historyManager.SendAndSaveToHistory(roomCode, 'NEW_QUESTION', randomQuestion.frage);

		// Only send to the game master and public players, not to all players
		this.appServer
			.to('game-master-' + roomCode)
			.to(PUBLIC_ROOM_CODE + '-' + roomCode)
			.emit('NEW_ANSWER', randomQuestion.antwort);
	}
}
