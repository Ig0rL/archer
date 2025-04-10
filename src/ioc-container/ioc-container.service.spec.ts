import { Test, TestingModule } from '@nestjs/testing';
import { IocContainer } from './ioc-container.service';
import { ICommands } from '@/commands/commands.interface';

// Простая заглушка для команды
class MockCommand implements ICommands {
	constructor(private value: string) {}
	execute(): void {
		console.log(`Executing with value: ${this.value}`);
	}
	getValue(): string {
		return this.value;
	}
}

// Мокаем worker_threads
jest.mock('worker_threads', () => {
	const mockWorker = {
		on: jest.fn((event, callback) => {
			if (event === 'message') {
				// Эмулируем ответ от воркера
				// Немедленный вызов вместо setTimeout для предсказуемости
				callback({ type: 'result', result: new MockCommand('worker') });
			}
			return mockWorker;
		}),
		off: jest.fn(),
		postMessage: jest.fn(),
	};

	return {
		Worker: jest.fn(() => mockWorker),
		isMainThread: true,
		workerData: { scopeId: 'workerScope' },
		parentPort: {
			on: jest.fn(),
			postMessage: jest.fn(),
		},
	};
});

describe('IocContainer', () => {
	let ioc: IocContainer;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [IocContainer],
		}).compile();

		ioc = module.get<IocContainer>(IocContainer);
	});

	describe('Выполнение скопа в основном потоке', () => {
		it('должен регистрировать и разрешать зависимости в дефолтном scope', () => {
			ioc
				.resolve<ICommands>('IoC.Register', 'testCommand', (args: any[]) => {
					const [value = 'default'] = args;
					return new MockCommand(value);
				})
				.execute();

			const command = ioc.resolve<MockCommand>('testCommand');
			expect(command.getValue()).toBe('default');
		});

		it('должен поддерживать передачу аргументов в resolve', () => {
			ioc
				.resolve<ICommands>('IoC.Register', 'testCommand', (args: any[]) => {
					const [value = 'default'] = args;
					return new MockCommand(value);
				})
				.execute();

			const commandWithArgs = ioc.resolve<MockCommand>(
				'testCommand',
				'customArg',
			);
			expect(commandWithArgs.getValue()).toBe('customArg');
		});

		it('должен выбрасывать ошибку при отсутствии зависимости', () => {
			expect(() => ioc.resolve<any>('unknownKey')).toThrow(
				'Зависимость не найдена: unknownKey',
			);
		});
	});

	// 2. Реализация скопа в воркере
	// 2. Реализация скопа в воркере
	describe('Запуск скопа в отдельном потоке', () => {
		it('должен работать с воркером в новом scope', async () => {
			// Создание нового scope с воркером
			ioc.resolve<ICommands>('Scopes.New', 'workerScope').execute();
			ioc.resolve<ICommands>('Scopes.Current', 'workerScope').execute();

			// Регистрация зависимости в workerScope
			ioc
				.resolve<ICommands>('IoC.Register', 'testCommand', (args: any[]) => {
					const [value = 'worker'] = args;
					return new MockCommand(value);
				})
				.execute();

			// Мокаем поведение воркера
			/* eslint-disable @typescript-eslint/no-var-requires */
			const workerMock = require('worker_threads').Worker;
			workerMock.mockImplementation(() => {
				const mock = {
					on: jest.fn((event, callback) => {
						if (event === 'message') {
							callback({
								type: 'result',
								result: new MockCommand('worker'),
							});
						}
						return mock;
					}),
					off: jest.fn(),
					postMessage: jest.fn(),
				};
				return mock;
			});

			// Выполнение в воркере
			const workerCommand = await ioc.executeInWorker<MockCommand>(
				'workerScope',
				'testCommand',
			);
			expect(workerCommand.getValue()).toBe('worker');

			// Проверка вызова воркера
			expect(workerMock).toHaveBeenCalledWith(
				`${__dirname}/workerScopeWorker.js`,
				{
					workerData: { scopeId: 'workerScope' },
				},
			);
		}, 10000);

		it('должен выбрасывать ошибку, если воркер не найден', async () => {
			await expect(
				ioc.executeInWorker('nonExistentScope', 'testCommand'),
			).rejects.toThrow('Worker для скопа nonExistentScope не найден');
		});
	});

	describe('Переключение скопа', () => {
		it('должен создавать новый scope и изолировать зависимости', () => {
			// Регистрация в дефолтном scope
			ioc
				.resolve<ICommands>('IoC.Register', 'testCommand', (args: any[]) => {
					const [value = 'default'] = args;
					return new MockCommand(value);
				})
				.execute();

			// Создание нового scope и регистрация другой реализации
			ioc.resolve<ICommands>('Scopes.New', 'customScope').execute();
			ioc.resolve<ICommands>('Scopes.Current', 'customScope').execute();
			ioc
				.resolve<ICommands>('IoC.Register', 'testCommand', (args: any[]) => {
					const [value = 'custom'] = args;
					return new MockCommand(value);
				})
				.execute();

			// Проверка в customScope
			const customCommand = ioc.resolve<MockCommand>('testCommand');
			expect(customCommand.getValue()).toBe('custom');

			// Возврат в дефолтный scope и проверка
			ioc.resolve<ICommands>('Scopes.Current', 'default').execute();
			const defaultCommand = ioc.resolve<MockCommand>('testCommand');
			expect(defaultCommand.getValue()).toBe('default');
		});

		it('должен выбрасывать ошибку при переключении на несуществующий scope', () => {
			expect(() =>
				ioc.resolve<ICommands>('Scopes.Current', 'nonExistentScope').execute(),
			).toThrow('Скоп не найден: nonExistentScope');
		});
	});
});
