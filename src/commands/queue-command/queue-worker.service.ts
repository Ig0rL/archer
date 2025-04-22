import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { ExceptionsService } from '@/exceptions/exceptions.service';

@Injectable()
export class QueueWorkerService {
	private queue: ICommands[] = [];
	private isProcessing: boolean = false;
	private stopRequested: boolean = false;
	private hardStop: boolean = false;
	
	constructor(private readonly exceptionHandler: ExceptionsService) {}
	
	add(command: ICommands) {
		this.queue.push(command);
		if (!this.isProcessing) {
			this.processQueue();
		}
	}
	
	requestStop(hardStop: boolean = false) {
		this.stopRequested = true;
		this.hardStop = hardStop;
		
		if (hardStop) {
			this.queue = [];
		}
	}
	
	isRunning() {
		return this.isProcessing;
	}
	
	async processQueue() {
		if (this.isProcessing) return;
		
		this.isProcessing = true;
		this.stopRequested = false;
		
		while (this.queue.length > 0 && !this.stopRequested) {
			const command = this.queue.shift();
			try {
				await Promise.resolve(command.execute());
			} catch (error) {
				this.exceptionHandler.handle(command, error);
			}
		}
		
		this.isProcessing = false;
	}
}
