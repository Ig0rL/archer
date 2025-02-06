import { Module } from '@nestjs/common';
import { VectorService } from './vector.service';

@Module({
  providers: [
    VectorService,
    { provide: 'VECTOR_X', useValue: 0 }, // передаем значение для x
    { provide: 'VECTOR_Y', useValue: 0 }, // передаем значение для y
  ],
  exports: [VectorService],
})
export class VectorModule {}
