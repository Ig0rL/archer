import { Inject, Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';

@Injectable()
export class MacroCommandService implements ICommands {
	private readonly commands: ICommands[];

	constructor(@Inject('COMMANDS') commands: ICommands[]) {
		this.commands = commands;
	}

	execute() {
		this.commands.forEach((command) => {
			command.execute();
		});
	}
}
