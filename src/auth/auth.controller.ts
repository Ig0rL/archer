import {
	Body,
	Controller,
	Post
} from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';

class GetTokenDto {
	userId: string;
	gameId: string;
}

@Controller('api/auth')
export class AuthController {
	constructor(private authService: AuthService) {}
	
	@Post('get-token')
	async getToken(@Body() getTokenDto: GetTokenDto) {
		const token = await this.authService.getToken(getTokenDto.userId, getTokenDto.gameId);
		if (token) {
			return { token };
		}
		return { error: 'Пользователь не является участником игры' };
	}
}
