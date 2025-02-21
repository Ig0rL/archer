import { Module } from '@nestjs/common';
import { MoveService } from './move.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { VectorModule } from '@/commands/vector/vector.module';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { QueueCommandService } from '@/commands/queue-command/queue-command.service';

@Module({
	imports: [VectorModule],
	providers: [
		MoveService,
		MovingAdapter,
		ExceptionsService,
		QueueCommandService,
	],
	exports: [MoveService, MovingAdapter],
})
export class MoveModule {}
