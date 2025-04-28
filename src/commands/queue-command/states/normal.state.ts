import { IQueueState } from './queue-state.interface';
import { ICommands } from '@/commands/commands.interface';
import { HardStopCommand, MoveToCommand } from '../commands/state-commands';
import { StateFactory, registerNormalState } from './state.factory';

export class NormalState implements IQueueState {
    async handle(command: ICommands): Promise<IQueueState | null> {
        if (command instanceof HardStopCommand) {
            return null;
        }
        
        if (command instanceof MoveToCommand) {
            return StateFactory.createMoveToState(command.getTargetQueue());
        }
        
        await Promise.resolve(command.execute());
        return this;
    }
}

registerNormalState(NormalState); 