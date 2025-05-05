import {
	Body,
	Controller,
	HttpException,
	HttpStatus,
	Post,
	Request,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Controller('api')
export class ApiGatewayController {
	constructor(private httpService: HttpService) {}
	
	@Post('tournament/create-game')
	async createGame(@Body() body: any) {
		try {
			const response = await lastValueFrom(
				this.httpService.post('http://localhost:3012/api/tournament/create-game', body)
			);
			return response.data;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Post('auth/get-token')
	async getToken(@Body() body: any) {
		try {
			const response = await lastValueFrom(
				this.httpService.post('http://localhost:3010/auth/get-token', body)
			);
			return response.data;
		} catch (error) {
			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
	
	@Post('tournament/perform-action')
	async performAction(@Request() req: any) {
		try {
			const { sub: userId, gameId } = req.user as { sub: string; gameId: string };
			const response = await lastValueFrom(
				this.httpService.post('http://localhost:3012/api/tournament/perform-action', {
					userId,
					gameId,
				})
			);
			return response.data;
		} catch (error) {
			throw new HttpException(
				error.response?.data?.error || 'Ошибка при выполнении действия',
				error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
			);
		}
	}
}
