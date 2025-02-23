import {
	Inject,
	Injectable
} from '@nestjs/common';
import { IFuel } from '@/commands/fuel/fuel.interface';

@Injectable()
export class FuelAdapter implements IFuel {
	private fuelLevel: number;
	private readonly fuelConsumption: number;
	
	constructor(
		@Inject('FUEL-LEVEL') fuelLevel: number,
		@Inject('FUEL-CONSUMPTION') fuelConsumption: number,
	) {
		this.fuelLevel = fuelLevel;
		this.fuelConsumption = fuelConsumption;
	}
	
	getFuel(): number {
		return this.fuelLevel;
	}
	
	setFuel(fuel: number) {
		this.fuelLevel = fuel;
	}
	
	getFuelConsumption(): number {
		return this.fuelConsumption;
	}
}
