import { Module } from '@nestjs/common';
import { QuadraticEquationModule } from './quadratic-equation/quadratic-equation.module';
import { CommandsModule } from './commands/commands.module';
import { ExceptionsModule } from './exceptions/exceptions.module';
import { QueueCommandModule } from '@/commands/queue-command/queue-command.module';
import { IocContainerModule } from './ioc-container/ioc-container.module';

@Module({
	imports: [QuadraticEquationModule, CommandsModule, ExceptionsModule, QueueCommandModule, IocContainerModule],
})
export class AppModule {}
