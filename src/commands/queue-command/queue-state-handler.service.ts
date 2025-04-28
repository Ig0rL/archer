import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { IQueueState } from './states/queue-state.interface';
import { StateFactory } from './states/state.factory';
import { ExceptionsService } from '@/exceptions/exceptions.service';

@Injectable()
export class QueueStateHandlerService {
    private currentState: IQueueState;

    constructor(private readonly exceptionHandler: ExceptionsService) {
        this.currentState = StateFactory.createNormalState();
    }

    async processCommand(command: ICommands): Promise<boolean> {
        try {
            const nextState = await this.currentState.handle(command);
            
            if (nextState === null) {
                return false; // Завершаем обработку
            }
            
            this.currentState = nextState;
            return true;
        } catch (error) {
            this.exceptionHandler.handle(command, error);
            return true; // Продолжаем обработку несмотря на ошибку
        }
    }
} 