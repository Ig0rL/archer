import {
	Inject,
	Injectable
} from '@nestjs/common';

export interface IVector {
	x: number;
	y: number;
}

@Injectable()
export class ChangeVelocityCommandAdapter {
	private readonly currentLocation: IVector;
	private readonly newAngel: number;
	private newVelocity: IVector;
	
	constructor(
		@Inject('VECTOR') currentLocation: IVector,
		@Inject('ANGLE') currentAngel: number,
	) {
		this.currentLocation = currentLocation;
		this.newAngel = currentAngel;
	}
	
	getVelocity(): IVector {
		return this.newVelocity;
	}
	
	getCurrentLocation(): IVector {
		return this.currentLocation;
	}
	
	getCurrentAngel(): number {
		return this.newAngel;
	}
	
	setVelocity(): void {
		const { x, y } = this.currentLocation;
		const angleRadian = (this.newAngel * Math.PI) / 180;
		const velocityX = Math.round(x * Math.cos(angleRadian) - y * Math.sin(angleRadian));
		const velocityY = Math.round(x * Math.sin(angleRadian) + y * Math.cos(angleRadian));
		this.newVelocity = { x: velocityX, y: velocityY };
	}
}
