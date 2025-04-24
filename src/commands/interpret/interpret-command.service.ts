import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { IocService } from '@/ioc/ioc.service';
import { IGameMessage } from './game-message.interface';

@Injectable()
export class InterpretCommandService implements ICommands {
    private message: IGameMessage;

    constructor(
        private readonly iocService: IocService,
        message: IGameMessage
    ) {
        this.message = message;
    }

    execute(): void {
        // Получаем игровой объект по ID
        const gameObject = this.iocService.resolve('GameObjects.Get', this.message.objectId);
        
        // Создаем команду на основе operationId
        const command = this.iocService.resolve<ICommands>(
            this.message.operationId,
            gameObject,
            ...Object.values(this.message.args)
        );

        // Добавляем команду в очередь соответствующего скопа (игры)
        this.iocService.addToQueue(this.message.gameId, command);
    }
} 