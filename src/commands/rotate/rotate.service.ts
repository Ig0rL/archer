import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { RotationAdapter } from '@/commands/rotate/rotation.adapter';

@Injectable()
export class RotateService implements ICommands {
	private rotation: RotationAdapter;

	constructor(rotation: RotationAdapter) {
		this.rotation = rotation;
	}

	execute() {
		this.rotation.setDirection(
			(this.rotation.getDirection() + this.rotation.getAngularVelocity()) %
				this.rotation.getDirectionsNumber(),
		);
	}
}
