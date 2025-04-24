import { Test, TestingModule } from '@nestjs/testing';
import { StatefulQueueService } from './stateful-queue.service';
import { QueueStateHandlerService } from './queue-state-handler.service';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { HardStopCommand, MoveToCommand, RunCommand } from './commands/state-commands';
import { ICommands } from '../commands.interface';
// Импортируем состояния для регистрации
import './states/normal.state';
import './states/move-to.state';

describe('StatefulQueueService', () => {
    let service: StatefulQueueService;
    let targetQueue: ICommands[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                StatefulQueueService,
                QueueStateHandlerService,
                ExceptionsService,
            ],
        }).compile();

        service = module.get<StatefulQueueService>(StatefulQueueService);
        targetQueue = [];
    });

    it('should stop processing after HardStop command', async () => {
        const mockCommand: ICommands = { execute: jest.fn() };
        
        service.add(mockCommand);
        service.add(new HardStopCommand());
        service.add(mockCommand);

        // Даем время на обработку
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockCommand.execute).toHaveBeenCalledTimes(1);
    });

    it('should switch to MoveTo state after MoveToCommand', async () => {
        const mockCommand: ICommands = { execute: jest.fn() };
        
        service.add(new MoveToCommand(targetQueue));
        service.add(mockCommand);

        // Даем время на обработку
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockCommand.execute).not.toHaveBeenCalled();
        expect(targetQueue).toContain(mockCommand);
    });

    it('should return to Normal state after RunCommand', async () => {
        const mockCommand: ICommands = { execute: jest.fn() };
        
        service.add(new MoveToCommand(targetQueue));
        service.add(new RunCommand());
        service.add(mockCommand);

        // Даем время на обработку
        await new Promise(resolve => setTimeout(resolve, 100));

        expect(mockCommand.execute).toHaveBeenCalled();
    });
}); 