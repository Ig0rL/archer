import { Module } from '@nestjs/common';
import { QuadraticEquationModule } from './quadratic-equation/quadratic-equation.module';
import { CommandsModule } from './commands/commands.module';

@Module({
	imports: [QuadraticEquationModule, CommandsModule],
})
export class AppModule {}
