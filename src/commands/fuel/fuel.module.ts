import { Module, OnModuleInit } from '@nestjs/common';
import { CheckFuelService } from './check-fuel.service';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { ExceptionsModule } from '@/exceptions/exceptions.module';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';
import { BurnFuelService } from '@/commands/fuel/burn-fuel.service';

@Module({
	imports: [ExceptionsModule],
	providers: [
		CheckFuelService,
		FuelAdapter,
		BurnFuelService,
		{ provide: 'FUEL-LEVEL', useValue: 0 },
		{ provide: 'FUEL-CONSUMPTION', useValue: 0 },
	],
	exports: [CheckFuelService, FuelAdapter, BurnFuelService],
})
export class FuelModule implements OnModuleInit {
	constructor(
		private readonly exceptionService: ExceptionsService,
		private readonly checkFuelService: CheckFuelService,
	) {}

	onModuleInit(): any {
		this.exceptionService.register(
			this.checkFuelService.constructor.name,
			'CommandException',
			({ err }) => {
				throw err;
			},
		);
	}
}
