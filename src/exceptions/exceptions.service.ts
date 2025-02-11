import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';

type ExceptionHandlerFunction = ({
	cmd,
	err,
}: {
	cmd?: ICommands;
	err?: Error;
}) => void;

@Injectable()
export class ExceptionsService {
	private handlers = new Map<string, Map<string, ExceptionHandlerFunction>>();

	register(
		commandType: string,
		exceptionType: string,
		handler?: ExceptionHandlerFunction,
	) {
		const exceptions = this.handlers.get(commandType) ?? new Map();
		exceptions.set(exceptionType, handler);
		this.handlers.set(commandType, exceptions);
	}

	getHandlers() {
		return this.handlers;
	}

	handle(command: ICommands, error: Error) {
		const commandName = command.constructor.name;
		const exceptionName = error.constructor.name;

		const commandHandlers = this.handlers.get(commandName);
		const handler = commandHandlers?.get(exceptionName);

		if (handler) {
			handler({ cmd: command, err: error });
		} else {
			console.error(`Неизвестная ошибка: ${error.message}`);
		}
	}
}
