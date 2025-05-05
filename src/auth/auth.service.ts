import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
	) {}
	
	getToken(userId: string, gameId: string): string {
		try {
			const payload = { sub: userId, gameId };
			return this.jwtService.sign(payload);
		} catch (error) {
			throw new Error('Error generating token');
		}
	}
}
