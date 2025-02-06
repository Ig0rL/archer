import { VectorService } from '@/commands/vector/vector.service';

export interface IMovable {
	getLocation(): VectorService;
	setLocation(position: VectorService): void;
	getVelocity(): VectorService;
}
