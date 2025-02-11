import { ICommands } from '@/commands/commands.interface';
import { RetryCommandService } from '@/commands/queue-command/retry-command.service';

class MockCommand implements ICommands {
	execute() {
		throw new Error('Test Error');
	}
}

describe('RetryCommandService', () => {
	it('Повторный запуск переданной команды', async () => {
		// Создаем мок для команды
		const command = new MockCommand();
		
		// Мокаем метод execute на командe, чтобы отслеживать его вызов
		const executeSpy = jest.spyOn(command, 'execute').mockImplementation(() => {});
		
		// Создаем команду RetryCommandService с мокированной командой
		const retryCommand = new RetryCommandService(command);
		
		// Выполняем команду
		retryCommand.execute();
		
		// Проверяем, что метод execute был вызван у оригинальной команды
		expect(executeSpy).toHaveBeenCalled();
		
		// Проверяем, что в RetryCommandService был передан правильный мок
		expect(retryCommand['originalCommand']).toBe(command);
	});
});
