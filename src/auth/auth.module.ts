import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from '@/constants';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
	imports: [
		JwtModule.register({
			secret: JWT_SECRET_KEY,
			signOptions: {
				expiresIn: '1h',
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
