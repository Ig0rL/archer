import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { CommandException } from '@/exceptions/comman-exception';

@Injectable()
export class CheckFuelService implements ICommands {
	private readonly fuelAdapter: FuelAdapter;

	constructor(
		fuelAdapter: FuelAdapter,
		private readonly exceptionService: ExceptionsService,
	) {
		this.fuelAdapter = fuelAdapter;
	}

	execute() {
		if (this.fuelAdapter.getFuel() < this.fuelAdapter.getFuelConsumption()) {
			const exception = new CommandException(
				'Недостаточно топлива для движения',
				this.constructor.name,
			);
			this.exceptionService.handle(this, exception);
		}
	}
}
