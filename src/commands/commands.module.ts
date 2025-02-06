import { Module } from '@nestjs/common';
import { MoveModule } from './move/move.module';
import { RotateModule } from './rotate/rotate.module';

@Module({
  imports: [MoveModule, RotateModule],
})
export class CommandsModule {}
