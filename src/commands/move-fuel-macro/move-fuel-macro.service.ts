import { Injectable } from '@nestjs/common';
import { ICommands } from '@/commands/commands.interface';
import { MoveService } from '@/commands/move/move.service';
import { CheckFuelService } from '@/commands/fuel/check-fuel.service';
import { BurnFuelService } from '@/commands/fuel/burn-fuel.service';
import { MacroCommandService } from '@/commands/macro-command/macro-command.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';
import { ExceptionsService } from '@/exceptions/exceptions.service';

@Injectable()
export class MoveFuelMacroService implements ICommands {
	private readonly moveService: MoveService;
	private readonly checkFuelService: CheckFuelService;
	private readonly burnFuelService: BurnFuelService;
	
	constructor(
		private readonly movingAdapter: MovingAdapter,
		private readonly fuelAdapter: FuelAdapter,
		private readonly exceptionsService: ExceptionsService,
	) {
		this.moveService = new MoveService(this.movingAdapter);
		this.checkFuelService = new CheckFuelService(this.fuelAdapter, this.exceptionsService);
		this.burnFuelService = new BurnFuelService(this.fuelAdapter);
	}
	
	execute() {
		const macroCommandService = new MacroCommandService([
			this.checkFuelService,
			this.moveService,
			this.burnFuelService,
		]);
		macroCommandService.execute();
	}
}
