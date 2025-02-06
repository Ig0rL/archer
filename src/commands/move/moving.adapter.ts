import { Injectable } from '@nestjs/common';
import { VectorService } from '@/commands/vector/vector.service';
import { IMovable } from '@/commands/move/movable.interface';

@Injectable()
export class MovingAdapter implements IMovable {
	private location: VectorService;
	
	private readonly velocity: VectorService;
	
	constructor(
		location: VectorService | undefined = new VectorService(0, 0),
		velocity: VectorService | undefined = new VectorService(0, 0),
	) {
		this.location = location;
		this.velocity = velocity;
	}
	
	getLocation(): VectorService {
		if (!this.location) {
			throw new Error('Невозможно прочитать положение в пространстве');
		}
		return this.location;
	}
	
	setLocation(position: VectorService): void {
		if (!position) {
			throw new Error(`Невозможно изменить положение в пространстве: position is ${position}`);
		}
		this.location = position;
	}
	
	getVelocity(): VectorService {
		if (!this.velocity) {
			throw new Error('Невозможно прочитать значение мгновенной скорости');
		}
		return this.velocity;
	}
}
