import { Module } from '@nestjs/common';
import { QueueCommandService } from './queue-command.service';
import { RetryCommandService } from './retry-command.service';
import { LogCommandService } from './log-command.service';
import { ExceptionsModule } from '@/exceptions/exceptions.module';

@Module({
  imports: [ExceptionsModule],
  providers: [QueueCommandService],
  exports: [QueueCommandService],
})
export class QueueCommandModule {}
