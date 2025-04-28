export interface IGameMessage {
    gameId: string;
    objectId: string;
    operationId: string;
    args: Record<string, any>;
} 