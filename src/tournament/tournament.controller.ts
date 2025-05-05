import {
	Body,
	Controller,
	Get,
	HttpException,
	HttpStatus,
	Param,
	Post,
	Request,
} from '@nestjs/common';
import { TournamentService } from '@/tournament/tournament.service';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

class CreateGameDto {
	participants: string[];
}

@Controller('api/tournament')
export class TournamentController {
	constructor(
		private gameService: TournamentService,
		private httpService: HttpService,
	) {}
	
	@Post('create-game')
	createGame(@Body() createGameDto: CreateGameDto) {
		const gameId = this.gameService.createGame(createGameDto.participants);
		return { gameId };
	}
	
	@Get(':gameId/participants')
	getParticipants(@Param('gameId') gameId: string) {
		const participants = this.gameService.getParticipants(gameId);
		if (participants) {
			return { participants };
		}
		return { error: 'Игра не найдена' };
	}
	
	@Post('perform-action')
	async performAction(@Request() req: any) {
		const { sub: userId, gameId } = req.user;
		const participants = this.gameService.getParticipants(gameId);
		
		if (!participants) {
			throw new HttpException('Игра не найдена', HttpStatus.NOT_FOUND);
		}
		
		try {
			const response = await lastValueFrom(
				this.httpService.post('http://localhost:3010/api/auth/get-token', {
					userId,
					gameId,
				})
			);
			
			if (!response.data.token) {
				throw new HttpException('Пользователь не является участником игры', HttpStatus.UNAUTHORIZED);
			}
			
			return { message: `Действие выполнено пользователем ${userId} в игре ${gameId}` };
		} catch (error) {
			throw new HttpException(
				error.response?.data?.error || 'Ошибка при проверке токена',
				error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
