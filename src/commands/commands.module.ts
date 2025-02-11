import { Module } from '@nestjs/common';
import { MoveModule } from './move/move.module';
import { RotateModule } from './rotate/rotate.module';
import { QueueCommandModule } from '@/commands/queue-command/queue-command.module';

@Module({
  imports: [MoveModule, RotateModule, QueueCommandModule],
})
export class CommandsModule {}
