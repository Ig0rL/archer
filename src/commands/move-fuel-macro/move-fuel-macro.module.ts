import { Module } from '@nestjs/common';
import { MoveFuelMacroService } from './move-fuel-macro.service';
import { MoveModule } from '@/commands/move/move.module';
import { FuelModule } from '@/commands/fuel/fuel.module';
import { MacroCommandModule } from '@/commands/macro-command/macro-command.module';
import { ExceptionsModule } from '@/exceptions/exceptions.module';

@Module({
	imports: [MoveModule, FuelModule, MacroCommandModule, ExceptionsModule],
	providers: [MoveFuelMacroService],
	exports: [MoveFuelMacroService],
})
export class MoveFuelMacroModule {}
