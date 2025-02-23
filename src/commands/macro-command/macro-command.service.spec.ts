import { Test, TestingModule } from '@nestjs/testing';
import { MacroCommandService } from '@/commands/macro-command/macro-command.service';
import { ICommands } from '@/commands/commands.interface';

describe('MacroCommandService', () => {
  let macroCommandService: MacroCommandService;
  let mockCommand1: jest.Mocked<ICommands>;
  let mockCommand2: jest.Mocked<ICommands>;
  
  beforeEach(async () => {
    // Мокаем два объекта команд
    mockCommand1 = { execute: jest.fn() };
    mockCommand2 = { execute: jest.fn() };
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MacroCommandService,
        { provide: 'COMMANDS', useValue: [mockCommand1, mockCommand2] }, // Подставляем наши моки в массив команд
      ],
    }).compile();
    
    macroCommandService = module.get<MacroCommandService>(MacroCommandService);
  });
  
  it('Должен вызывать execute для каждой команды', () => {
    macroCommandService.execute();
    
    // Проверяем, что execute для каждой команды был вызван
    expect(mockCommand1.execute).toHaveBeenCalled();
    expect(mockCommand2.execute).toHaveBeenCalled();
  });
  
  it('Не должен вызывать execute для команд, если их нет в массиве', () => {
    // Создаем пустой массив команд и передаем в конструктор
    const emptyService = new MacroCommandService([]);
    emptyService.execute();
    
    // Убеждаемся, что execute не был вызван
    expect(mockCommand1.execute).not.toHaveBeenCalled();
    expect(mockCommand2.execute).not.toHaveBeenCalled();
  });
});
