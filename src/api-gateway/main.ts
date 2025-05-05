import { NestFactory } from '@nestjs/core';
import { ApiGatewayModule } from '@/api-gateway/api-gateway.module';

async function bootstrap() {
	const app = await NestFactory.create(ApiGatewayModule);
	await app.listen(3011);
}

bootstrap();
