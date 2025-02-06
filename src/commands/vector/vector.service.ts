import {
	Inject,
	Injectable
} from '@nestjs/common';

@Injectable()
export class VectorService {
	constructor(
		@Inject('VECTOR_X') private x: number,
		@Inject('VECTOR_Y') private y: number,
	) {}
	
	getPosition() {
		return { x: this.x, y: this.y };
	}
	
	setPosition(vector: VectorService): VectorService {
		return new VectorService(this.x + vector.x, this.y + vector.y);
	}
}
