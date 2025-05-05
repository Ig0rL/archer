import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TournamentService {
	public games: Map<string, string[]> = new Map();
	
	createGame(participants: string[]): string {
		const gameId = uuidv4();
		this.games.set(gameId, participants);
		return gameId;
	}
	
	getParticipants(gameId: string): string[] | null {
		return this.games.get(gameId) || null;
	}
}
