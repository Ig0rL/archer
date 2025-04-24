import { Controller, Post, Body } from '@nestjs/common';
import { IocService } from '@/ioc/ioc.service';
import { IGameMessage } from '@/commands/interpret/game-message.interface';
import { InterpretCommandService } from '@/commands/interpret/interpret-command.service';

/**
 * {
    "gameId": "game-123",
    "objectId": "object-456",
    "operationId": "Move.Start",
    "args": {
        "speed": 2,
        "direction": "forward"
    }
}
 */
@Controller('game')
export class GameController {
    constructor(private readonly iocService: IocService) {}

    @Post('command')
    async handleCommand(@Body() message: IGameMessage) {
        // Проверяем существование скопа для игры, если нет - создаем
        try {
            this.iocService.resolve('Scopes.Current', message.gameId);
        } catch {
            this.iocService.resolve('Scopes.New', message.gameId);
            this.iocService.resolve('Scopes.Current', message.gameId);
        }

        // Создаем команду интерпретации
        const interpretCommand = new InterpretCommandService(this.iocService, message);
        
        // Добавляем команду в очередь игры
        this.iocService.addToQueue(message.gameId, interpretCommand);

        // Запускаем обработку очереди
        await this.iocService.resolve('Queue.Start', message.gameId);

        return { status: 'success', message: 'Command queued successfully' };
    }
} 