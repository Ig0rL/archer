import { IQueueState } from './queue-state.interface';
import { ICommands } from '@/commands/commands.interface';

let normalStateConstructor: new () => IQueueState;
let moveToStateConstructor: new (targetQueue: ICommands[]) => IQueueState;

export function registerNormalState(constructor: new () => IQueueState) {
    normalStateConstructor = constructor;
}

export function registerMoveToState(constructor: new (targetQueue: ICommands[]) => IQueueState) {
    moveToStateConstructor = constructor;
}

export class StateFactory {
    static createNormalState(): IQueueState {
        return new normalStateConstructor();
    }

    static createMoveToState(targetQueue: ICommands[]): IQueueState {
        return new moveToStateConstructor(targetQueue);
    }
} 