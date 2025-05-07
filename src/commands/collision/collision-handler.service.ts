import { Injectable } from '@nestjs/common';
import { NeighborhoodHandler } from './neighborhood-handler.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { ICommands } from '@/commands/commands.interface';

@Injectable()
export class CollisionHandler extends NeighborhoodHandler {
    protected processObject(object: MovingAdapter): void {
        const currentKey = this.getNeighborhoodKey(object.getLocation());
        let oldKey: string | null = null;
        
        for (const [key, objects] of this.objects.entries()) {
            if (objects.has(object)) {
                oldKey = key;
                break;
            }
        }

        if (oldKey !== currentKey) {
            if (oldKey) {
                this.objects.get(oldKey)?.delete(object);
            }

            if (!this.objects.has(currentKey)) {
                this.objects.set(currentKey, new Set());
            }
            this.objects.get(currentKey)?.add(object);
            this.updateCollisionCommands(object, currentKey);
        }
    }
    
    private updateCollisionCommands(object: MovingAdapter, neighborhoodKey: string): void {
        const objectsInNeighborhood = this.objects.get(neighborhoodKey);
        const commands: ICommands[] = [];
        
        objectsInNeighborhood?.forEach(otherObject => {
            if (object !== otherObject) {
                commands.push({
                    execute: () => {
                        const pos1 = object.getLocation().getPosition();
                        const pos2 = otherObject.getLocation().getPosition();
                        const dx = pos1.x - pos2.x;
                        const dy = pos1.y - pos2.y;
                        const distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < 10) {
                            // Реакция на коллизию
                        }
                    }
                });
            }
        });
        
        if (commands.length > 0) {
            this.macroCommandService.execute();
        }
    }
}
