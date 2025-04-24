import { ICommands } from '@/commands/commands.interface';

export class HardStopCommand implements ICommands {
    execute(): void {}
}

export class MoveToCommand implements ICommands {
    constructor(private readonly targetQueue: ICommands[]) {}
    
    execute(): void {}
    
    getTargetQueue(): ICommands[] {
        return this.targetQueue;
    }
}

export class RunCommand implements ICommands {
    execute(): void {}
} 