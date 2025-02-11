import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { ExceptionsService } from '@/exceptions/exceptions.service';

@Injectable()
export class QueueCommandService {
	private queue: ICommands[] = [];
	
	constructor(private readonly exceptionHandler: ExceptionsService) {}
	
	add(command: ICommands) {
		this.queue.push(command);
	}
	
	getQueue() {
		return this.queue;
	}
	
	processQueue() {
		while (this.queue.length > 0) {
			const command = this.queue.shift();
			try {
				command.execute();
			} catch (error) {
				this.exceptionHandler.handle(command, error);
			}
		}
	}
}
