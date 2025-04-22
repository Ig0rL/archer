import { Module } from '@nestjs/common';
import { QueueCommandService } from './queue-command.service';
import { ExceptionsModule } from '@/exceptions/exceptions.module';
import { QueueWorkerService } from './queue-worker.service';

@Module({
	imports: [ExceptionsModule],
	providers: [QueueCommandService, QueueWorkerService],
	exports: [QueueCommandService, QueueWorkerService],
})
export class QueueCommandModule {}
