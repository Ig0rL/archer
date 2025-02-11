import { LogCommandService } from '@/commands/queue-command/log-command.service';

describe('LogCommandService', () => {
	it('Выводит ошибку в лог console.error(...)', async () => {
		const error = new Error('Test Error');
		const consoleSpy = jest
			.spyOn(console, 'error')
			.mockImplementation(() => {});

		const command = new LogCommandService(error);
		command.execute();

		expect(consoleSpy).toHaveBeenCalledWith(`[Ошибка] ${error.message}`);

		consoleSpy.mockRestore();
	});
});
