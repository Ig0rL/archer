import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { MovingAdapter } from '@/commands/move/moving.adapter';

@Injectable()
export class MoveService implements ICommands {
	private movable: MovingAdapter;

	constructor(movable: MovingAdapter) {
		this.movable = movable;
	}

	execute() {
		this.movable.setLocation(
			this.movable.getLocation().setPosition(this.movable.getVelocity()),
		);
	}
}
