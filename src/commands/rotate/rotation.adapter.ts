import {
	Inject,
	Injectable
} from '@nestjs/common';
import { IRotatable } from '@/commands/rotate/rotatable.interface';

@Injectable()
export class RotationAdapter implements IRotatable {
	private direction: number;
	private readonly angularVelocity: number;
	private readonly directionsNumber: number;
	
	constructor(
		@Inject('DIRECTION') direction: number = 0,
		@Inject('ANGULAR_VELOCITY') angularVelocity: number = 0,
		@Inject('DIRECTION_NUMBER') directionsNumber: number = 360,
	) {
		this.direction = direction;
		this.angularVelocity = angularVelocity;
		this.directionsNumber = directionsNumber;
	}
	
	getDirection(): number {
		if (!this.direction) {
			throw new Error('Невозможно прочитать текущий угол поворота');
		}
		return this.direction;
	}
	
	getAngularVelocity(): number {
		if (!this.angularVelocity) {
			if (!this.direction) {
				throw new Error('Невозможно прочитать значение угловой скорости');
			}
		}
		return this.angularVelocity;
	}
	
	setDirection(newDirection: number): void {
		this.direction = newDirection;
	}
	
	getDirectionsNumber(): number {
		return this.directionsNumber;
	}
}
