import { Module } from '@nestjs/common';
import {
  MoveService
} from './move.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { VectorModule } from '@/commands/vector/vector.module';

@Module({
  imports: [VectorModule],
  providers: [MoveService, MovingAdapter],
  exports: [MoveService, MovingAdapter],
})
export class MoveModule {}
