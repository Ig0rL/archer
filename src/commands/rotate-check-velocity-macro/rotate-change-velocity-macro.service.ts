import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { RotateService } from '@/commands/rotate/rotate.service';
import { ChangeVelocityCommandService } from '@/commands/change-velocity-command/change-velocity-command.service';
import { RotationAdapter } from '@/commands/rotate/rotation.adapter';
import { ChangeVelocityCommandAdapter } from '@/commands/change-velocity-command/change-velocity-command.adapter';
import { MacroCommandService } from '@/commands/macro-command/macro-command.service';

@Injectable()
export class RotateChangeVelocityMacroService implements ICommands {
	private readonly rotateService: RotateService;
	private readonly changeVelocityCommandService: ChangeVelocityCommandService;
	
	constructor(
		private readonly rotateAdapter: RotationAdapter,
		private readonly changeVelocityCommandAdapter: ChangeVelocityCommandAdapter,
	) {
		this.rotateService = new RotateService(this.rotateAdapter);
		this.changeVelocityCommandService = new ChangeVelocityCommandService(this.changeVelocityCommandAdapter);
	}
	
	execute() {
		const macroCommandService = new MacroCommandService([
			this.rotateService,
			this.changeVelocityCommandService,
		]);
		macroCommandService.execute();
	}
}
