import { Test, TestingModule } from '@nestjs/testing';
import { BurnFuelService } from '@/commands/fuel/burn-fuel.service';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';

describe('BurnFuelService', () => {
	let burnFuelService: BurnFuelService;
	let fuelAdapter: jest.Mocked<FuelAdapter>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				BurnFuelService,
				{
					provide: FuelAdapter,
					useValue: {
						getFuel: jest.fn(),
						setFuel: jest.fn(),
						getFuelConsumption: jest.fn(),
					},
				},
			],
		}).compile();

		burnFuelService = module.get<BurnFuelService>(BurnFuelService);
		fuelAdapter = module.get<FuelAdapter>(
			FuelAdapter,
		) as jest.Mocked<FuelAdapter>;
	});

	it('Команда должна уменьшать общее количество топлива на расход топлива', () => {
		fuelAdapter.getFuel.mockReturnValue(10); // начальный уровень топлива
		fuelAdapter.getFuelConsumption.mockReturnValue(3); // расход топлива

		burnFuelService.execute();

		// Проверяем, что метод setFuel был вызван с правильным значением
		expect(fuelAdapter.setFuel).toHaveBeenCalledWith(7); // 10 - 3 = 7
	});

	it('Команда должна устанавливать новый уровень топлива, если расход топлива равен 0', () => {
		fuelAdapter.getFuel.mockReturnValue(10); // начальный уровень топлива
		fuelAdapter.getFuelConsumption.mockReturnValue(0); // расход топлива равен 0

		burnFuelService.execute();

		// Проверяем, что метод setFuel не изменил уровень топлива
		expect(fuelAdapter.setFuel).toHaveBeenCalledWith(10); // 10 - 0 = 10
	});
});
