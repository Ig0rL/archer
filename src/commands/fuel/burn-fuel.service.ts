import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';

@Injectable()
export class BurnFuelService implements ICommands {
	private readonly fuelAdapter: FuelAdapter;

	constructor(fuelAdapter: FuelAdapter) {
		this.fuelAdapter = fuelAdapter;
	}

	execute() {
		this.fuelAdapter.setFuel(
			this.fuelAdapter.getFuel() - this.fuelAdapter.getFuelConsumption(),
		);
	}
}
