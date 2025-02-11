import { Module } from '@nestjs/common';
import { QuadraticEquationService } from './quadratic-equation.service';

@Module({
	providers: [QuadraticEquationService],
	exports: [QuadraticEquationService],
})
export class QuadraticEquationModule {}
