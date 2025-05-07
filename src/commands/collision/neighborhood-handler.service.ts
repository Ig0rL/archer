import { Injectable } from '@nestjs/common';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { MacroCommandService } from '@/commands/macro-command/macro-command.service';
import { VectorService } from '@/commands/vector/vector.service';

@Injectable()
export abstract class NeighborhoodHandler {
    protected nextHandler: NeighborhoodHandler | null = null;
    protected objects: Map<string, Set<MovingAdapter>> = new Map();
    protected offset: VectorService;

    constructor(
        protected readonly macroCommandService: MacroCommandService,
        offset: VectorService = new VectorService(0, 0)
    ) {
        this.offset = offset;
    }

    setNext(handler: NeighborhoodHandler): NeighborhoodHandler {
        this.nextHandler = handler;
        return handler;
    }

    handle(object: MovingAdapter): void {
        this.processObject(object);
        if (this.nextHandler) {
            this.nextHandler.handle(object);
        }
    }

    protected getNeighborhoodKey(position: VectorService): string {
        const { x, y } = position.getPosition();
        const { x: offsetX, y: offsetY } = this.offset.getPosition();
        const adjustedX = x - offsetX;
        const adjustedY = y - offsetY;
        const gridSize = 100; // Размер ячейки сетки
        return `${Math.floor(adjustedX / gridSize)},${Math.floor(adjustedY / gridSize)}`;
    }

    protected abstract processObject(object: MovingAdapter): void;
}
