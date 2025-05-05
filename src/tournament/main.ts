import { NestFactory } from '@nestjs/core';
import { TournamentModule } from '@/tournament/tournament.module';

async function bootstrap() {
	const app = await NestFactory.create(TournamentModule);
	await app.listen(3012);
}

bootstrap();
