import { ICommands } from '@/commands/commands.interface';

export interface IQueueState {
    handle(command: ICommands): Promise<IQueueState | null>;
} 