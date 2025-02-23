import { Module } from '@nestjs/common';
import { ExceptionsService } from './exceptions.service';
import { CommandException } from '@/exceptions/comman-exception';

@Module({
	providers: [
		ExceptionsService,
		CommandException,
		{ provide: 'MESSAGE', useValue: ''},
		{ provide: 'EXCEPTION-NAME', useValue: ''},
	],
	exports: [ExceptionsService, CommandException],
})
export class ExceptionsModule {}
