import { Test, TestingModule } from '@nestjs/testing';
import { ICommands } from '@/commands/commands.interface';
import { QueueCommandService } from '@/commands/queue-command/queue-command.service';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { RetryCommandService } from '@/commands/queue-command/retry-command.service';
import { LogCommandService } from '@/commands/queue-command/log-command.service';
import { RetryTwoCommandService } from '@/commands/queue-command/retry-two-command.service';
import { ExceptionsModule } from '@/exceptions/exceptions.module';
import { QueueCommandModule } from '@/commands/queue-command/queue-command.module';

class TestCommand implements ICommands {
	execute() {
		throw new Error('Test error');
	}
}

const commandSpyMock = (command: ICommands) => jest.spyOn(command, 'execute');

describe('ExceptionsService', () => {
	let queueService: QueueCommandService;
	let exceptionService: ExceptionsService;

	beforeEach(async () => {
		const moduleRef: TestingModule = await Test.createTestingModule({
			imports: [ExceptionsModule, QueueCommandModule],
			providers: [QueueCommandService, ExceptionsService],
		}).compile();

		queueService = moduleRef.get<QueueCommandService>(QueueCommandService);
		exceptionService = moduleRef.get<ExceptionsService>(ExceptionsService);
	});

	it('Повторяем команду 1 раз после пишем ошибку в лог', () => {
		const command = new TestCommand();
		// Регистрируем обработчики
		exceptionService.register('TestCommand', 'Error', ({ cmd }) => {
			queueService.add(new RetryCommandService(cmd));
		});
		exceptionService.register(
			'RetryCommandService',
			'Error',
			({ err: error }) => {
				queueService.add(new LogCommandService(error));
			},
		);

		// Мокируем методы
		const commandSpy = commandSpyMock(command);

		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		queueService.add(command);
		queueService.processQueue();

		expect(commandSpy).toHaveBeenCalledTimes(2);
		expect(consoleSpy).toHaveBeenCalledWith('[Ошибка] Test error');

		consoleSpy.mockRestore();
	});

	it('Повторяем команду 2 раз после пишем ошибку в лог', () => {
		const command = new TestCommand();
		// Регистрируем обработчики
		exceptionService.register('TestCommand', 'Error', ({ cmd }) => {
			queueService.add(new RetryCommandService(cmd));
		});
		exceptionService.register('RetryCommandService', 'Error', ({ cmd }) => {
			queueService.add(new RetryTwoCommandService(cmd));
		});
		exceptionService.register(
			'RetryTwoCommandService',
			'Error',
			({ err: error }) => {
				queueService.add(new LogCommandService(error));
			},
		);

		// Мокируем методы
		const commandSpy = commandSpyMock(command);

		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		queueService.add(command);
		queueService.processQueue();

		expect(commandSpy).toHaveBeenCalledTimes(3);
		expect(consoleSpy).toHaveBeenCalledWith('[Ошибка] Test error');

		consoleSpy.mockRestore();
	});
});
