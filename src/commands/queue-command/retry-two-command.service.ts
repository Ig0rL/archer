import { ICommands } from '@/commands/commands.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RetryTwoCommandService implements ICommands{
	constructor(private readonly originalCommand: ICommands) {}
	
	execute() {
		this.originalCommand.execute();
	}
}
