import { Module } from '@nestjs/common';
import { QuadraticEquationModule } from './quadratic-equation/quadratic-equation.module';
import { CommandsModule } from './commands/commands.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { QueueCommandModule } from '@/commands/queue-command/queue-command.module';
import { IocContainerModule } from './ioc-container/ioc-container.module';
import { IocModule } from './ioc/ioc.module';
import { GameController } from './controllers/game.controller';
import { IocService } from './ioc/ioc.service';
import { ExceptionsService } from './exceptions/exceptions.service';

@Module({
	imports: [
		QuadraticEquationModule,
		CommandsModule,
		ExceptionsModule,
		QueueCommandModule,
		IocContainerModule,
		IocModule,
	],
	controllers: [GameController],
	providers: [IocService, ExceptionsService],
})

export class AppModule {}
