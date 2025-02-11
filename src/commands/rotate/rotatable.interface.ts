export interface IRotatable {
	getDirection(): number;
	getAngularVelocity(): number;
	setDirection(newDirection: number): void;
	getDirectionsNumber(): number;
}
