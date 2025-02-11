import { Module } from '@nestjs/common';
import { QuadraticEquationModule } from './quadratic-equation/quadratic-equation.module';
import { CommandsModule } from './commands/commands.module';
import { ExceptionsModule } from './exceptions/exceptions.module';

@Module({
	imports: [QuadraticEquationModule, CommandsModule, ExceptionsModule],
})
export class AppModule {}
