import { IQueueState } from './queue-state.interface';
import { ICommands } from '@/commands/commands.interface';
import { HardStopCommand, RunCommand } from '../commands/state-commands';
import { StateFactory, registerMoveToState } from './state.factory';

export class MoveToState implements IQueueState {
    constructor(private readonly targetQueue: ICommands[]) {}

    async handle(command: ICommands): Promise<IQueueState | null> {
        if (command instanceof HardStopCommand) {
            return null;
        }

        if (command instanceof RunCommand) {
            return StateFactory.createNormalState();
        }

        this.targetQueue.push(command);
        return this;
    }
}

registerMoveToState(MoveToState); 