import { Test, TestingModule } from '@nestjs/testing';
import { ChangeVelocityCommandService } from '@/commands/change-velocity-command/change-velocity-command.service';
import { ChangeVelocityCommandAdapter } from '@/commands/change-velocity-command/change-velocity-command.adapter';

describe('ChangeVelocityCommandService', () => {
	let changeVelocityCommandService: ChangeVelocityCommandService;
	let changeVelocityCommandAdapter: jest.Mocked<ChangeVelocityCommandAdapter>;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ChangeVelocityCommandService,
				{
					provide: ChangeVelocityCommandAdapter,
					useValue: {
						setVelocity: jest.fn(),
						getVelocity: jest.fn().mockReturnValue({ x: 5, y: 12 }),
					},
				},
			],
		}).compile();

		changeVelocityCommandService = module.get<ChangeVelocityCommandService>(
			ChangeVelocityCommandService,
		);
		changeVelocityCommandAdapter = module.get<ChangeVelocityCommandAdapter>(
			ChangeVelocityCommandAdapter,
		) as jest.Mocked<ChangeVelocityCommandAdapter>;
	});

	it('должен корректно вычислять новую скорость', () => {
		const currentLocation = { x: 12, y: 5 };
		const currentAngel = 45;

		// Настроим адаптер с координатами и углом
		changeVelocityCommandAdapter.getCurrentLocation = jest
			.fn()
			.mockReturnValue(currentLocation);
		changeVelocityCommandAdapter.getCurrentAngel = jest
			.fn()
			.mockReturnValue(45);

		// Вызываем setVelocity, чтобы пересчитать скорость
		changeVelocityCommandService.execute();

		// Проверяем, что новая скорость рассчитана корректно
		const expectedVelocity = {
			x: Math.round(
				currentLocation.x * Math.cos((currentAngel * Math.PI) / 180) -
					currentLocation.y * Math.sin((currentAngel * Math.PI) / 180),
			),
			y: Math.round(
				currentLocation.x * Math.sin((currentAngel * Math.PI) / 180) +
					currentLocation.y * Math.cos((currentAngel * Math.PI) / 180),
			),
		};

		expect(changeVelocityCommandAdapter.getVelocity()).toEqual(
			expectedVelocity,
		);
	});
});
