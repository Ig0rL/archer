import {
  Module,
  OnModuleInit
} from '@nestjs/common';
import {
  MoveService
} from './move.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { VectorModule } from '@/commands/vector/vector.module';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { QueueCommandService } from '@/commands/queue-command/queue-command.service';
import { RetryCommandService } from '@/commands/queue-command/retry-command.service';
import { LogCommandService } from '@/commands/queue-command/log-command.service';

@Module({
  imports: [VectorModule],
  providers: [MoveService, MovingAdapter, ExceptionsService, QueueCommandService],
  exports: [MoveService, MovingAdapter],
})
export class MoveModule implements OnModuleInit {
  constructor(
    private readonly exceptionService: ExceptionsService,
    private readonly queueCommandService: QueueCommandService,
  ) {}
  
  onModuleInit(): any {
    this.exceptionService.register('MoveService', 'Error', (cmd, err) => {
      console.log('[MoveModule] Повторяем команду MoveService после ошибки');
      this.queueCommandService.add(new RetryCommandService(cmd));
    });
    
    this.exceptionService.register('RetryCommandService', 'Error', (cmd, err) => {
      console.log('[MoveModule] Повтор не удался, записываем ошибку в лог');
      this.queueCommandService.add(new LogCommandService(err));
    });
  }
}
