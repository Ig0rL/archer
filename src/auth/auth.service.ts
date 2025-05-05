import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
	) {}
	
	async getToken(userId: string, gameId: string): Promise<string> {
		try {
			const payload = { sub: userId, gameId };
			return this.jwtService.sign(payload);
		} catch (error) {
			throw new Error('Error generating token');
		}
	}
}
