import { Injectable } from '@nestjs/common';
import { CollisionHandler } from './collision-handler.service';
import { MacroCommandService } from '@/commands/macro-command/macro-command.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { VectorService } from '@/commands/vector/vector.service';

@Injectable()
export class CollisionCheckerService {
    private readonly handlers: CollisionHandler[];
    
    constructor(private readonly macroCommandService: MacroCommandService) {
        this.handlers = [
            new CollisionHandler(this.macroCommandService, new VectorService(0, 0)),
            new CollisionHandler(this.macroCommandService, new VectorService(50, 50)),
        ];
        this.handlers[0].setNext(this.handlers[1]);
    }
    
    checkCollision(movingObjects: MovingAdapter[]) {
        movingObjects.forEach(object => {
            this.handlers[0].handle(object);
        });
    }
}
