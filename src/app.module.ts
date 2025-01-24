import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { QuadraticEquationModule } from './quadratic-equation/quadratic-equation.module';

@Module({
	imports: [QuadraticEquationModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
