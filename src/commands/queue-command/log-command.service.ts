import { ICommands } from '@/commands/commands.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogCommandService implements ICommands {
	constructor(private readonly error: Error) {}

	execute() {
		console.error(`[Ошибка] ${this.error.message}`);
	}
}
