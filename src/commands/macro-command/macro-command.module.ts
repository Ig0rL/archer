import { Module } from '@nestjs/common';
import { MacroCommandService } from './macro-command.service';

@Module({
	providers: [MacroCommandService, { provide: 'COMMANDS', useValue: [] }],
	exports: [MacroCommandService],
})
export class MacroCommandModule {}
