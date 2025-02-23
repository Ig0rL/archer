import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { ChangeVelocityCommandAdapter } from '@/commands/change-velocity-command/change-velocity-command.adapter';

@Injectable()
export class ChangeVelocityCommandService implements ICommands {
	private velocity: ChangeVelocityCommandAdapter;
	
	constructor(velocity: ChangeVelocityCommandAdapter) {
		this.velocity = velocity;
	}
	
	execute() {
		this.velocity.setVelocity();
	}
}
