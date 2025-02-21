import { Module } from '@nestjs/common';
import { RotateService } from './rotate.service';
import { RotationAdapter } from '@/commands/rotate/rotation.adapter';

@Module({
	providers: [
		RotateService,
		RotationAdapter,
		{ provide: 'DIRECTION', useValue: 0 },
		{ provide: 'ANGULAR_VELOCITY', useValue: 0 },
		{ provide: 'DIRECTION_NUMBER', useValue: 360 },
	],
	exports: [RotateService, RotationAdapter],
})
export class RotateModule {}
