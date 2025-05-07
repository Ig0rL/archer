import { Module } from '@nestjs/common';
import { MoveModule } from './move/move.module';
import { RotateModule } from './rotate/rotate.module';
import { QueueCommandModule } from '@/commands/queue-command/queue-command.module';
import { FuelModule } from '@/commands/fuel/fuel.module';
import { ChangeVelocityCommandModule } from './change-velocity-command/change-velocity-command.module';
import { MacroCommandModule } from './macro-command/macro-command.module';
import { MoveFuelMacroModule } from './move-fuel-macro/move-fuel-macro.module';
import { RotateCheckVelocityMacroModule } from './rotate-check-velocity-macro/rotate-check-velocity-macro.module';
import { QueueWorkerService } from '@/commands/queue-command/queue-worker.service';
import { ExceptionsModule } from '@/exceptions/exceptions.module';
import { CollisionModule } from '@/commands/collision/collision.module';

@Module({
	imports: [
		MoveModule,
		RotateModule,
		QueueCommandModule,
		FuelModule,
		ChangeVelocityCommandModule,
		MacroCommandModule,
		MoveFuelMacroModule,
		RotateCheckVelocityMacroModule,
		ExceptionsModule,
		CollisionModule,
	],
	providers: [QueueWorkerService],
	exports: [QueueWorkerService],
})
export class CommandsModule {}
