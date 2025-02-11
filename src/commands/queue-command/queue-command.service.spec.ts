import { Test, TestingModule } from '@nestjs/testing';
import { QueueCommandService } from './queue-command.service';

describe('QueueCommandService', () => {
	let service: QueueCommandService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [QueueCommandService],
		}).compile();

		service = module.get<QueueCommandService>(QueueCommandService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
