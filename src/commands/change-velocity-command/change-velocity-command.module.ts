import { Module } from '@nestjs/common';
import { ChangeVelocityCommandService } from './change-velocity-command.service';
import { ChangeVelocityCommandAdapter } from '@/commands/change-velocity-command/change-velocity-command.adapter';

@Module({
	providers: [
		ChangeVelocityCommandService,
		ChangeVelocityCommandAdapter,
		{ provide: 'VECTOR', useValue: { x: 0, y: 0 } },
		{ provide: 'ANGLE', useValue: 0 },
	],
	exports: [ChangeVelocityCommandService, ChangeVelocityCommandAdapter],
})
export class ChangeVelocityCommandModule {}
