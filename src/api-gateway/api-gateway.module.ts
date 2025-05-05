import {
  MiddlewareConsumer,
  Module,
  NestModule
} from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET_KEY } from '@/constants';
import { AuthMiddleware } from '@/api-gateway/auth.middleware';

@Module({
  imports: [
    HttpModule,
    JwtModule.register({
      secret: JWT_SECRET_KEY,
    }),
  ],
  controllers: [ApiGatewayController]
})
export class ApiGatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware).forRoutes('api/*');
  }
}
