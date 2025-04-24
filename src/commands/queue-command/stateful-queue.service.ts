import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { QueueStateHandlerService } from './queue-state-handler.service';

@Injectable()
export class StatefulQueueService {
    private queue: ICommands[] = [];
    private isProcessing: boolean = false;

    constructor(private readonly stateHandler: QueueStateHandlerService) {}

    add(command: ICommands) {
        this.queue.push(command);
        if (!this.isProcessing) {
            this.processQueue();
        }
    }

    isRunning() {
        return this.isProcessing;
    }

    private async processQueue() {
        if (this.isProcessing) return;

        this.isProcessing = true;

        while (this.queue.length > 0) {
            const command = this.queue.shift();
            const shouldContinue = await this.stateHandler.processCommand(command);
            
            if (!shouldContinue) {
                break;
            }
        }

        this.isProcessing = false;
    }
} 