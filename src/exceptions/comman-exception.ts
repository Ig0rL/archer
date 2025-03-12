import {
	Inject,
	Injectable
} from '@nestjs/common';

@Injectable()
export class CommandException extends Error {
	constructor(
		@Inject('MESSAGE') message: string,
		@Inject('EXCEPTION-NAME') name?: string
	) {
		super(message);
		this.name = name;
	}
}
