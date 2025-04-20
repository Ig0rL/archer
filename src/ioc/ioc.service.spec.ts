import { Test, TestingModule } from '@nestjs/testing';
import { IocService } from './ioc.service';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { ICommands } from '@/commands/commands.interface';

describe('IocService', () => {
  let service: IocService;
  let exceptionHandler: ExceptionsService;
  
  beforeEach(async () => {
    exceptionHandler = { handle: jest.fn() } as any;
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IocService,
        { provide: ExceptionsService, useValue: exceptionHandler }
      ],
    }).compile();
    
    service = module.get<IocService>(IocService);
  });
  
  describe('Зависимости', () => {
    it('должен регистрировать и разрешать зависимость в текущем скопе', () => {
      const mockFactory = () => 'test';
      const registerCommand = service.resolve<ICommands>('IoC.Register', 'testKey', mockFactory);
      registerCommand.execute();
      
      const result = service.resolve<string>('testKey');
      expect(result).toBe('test');
    });
    
    it('выбрасывает ошибку при попытке разрешить несуществующую зависимость', () => {
      expect(() => service.resolve('nonexistentKey')).toThrow('Зависимость не найдена');
    });
  });
  
  describe('Скопы', () => {
    it('должен создавать новый скоп и переключаться на него', () => {
      const newScopeCommand = service.resolve<ICommands>('Scopes.New', 'testScope');
      const currentScopeCommand = service.resolve<ICommands>('Scopes.Current', 'testScope');
      
      newScopeCommand.execute();
      currentScopeCommand.execute();
      
      const mockFactory = () => 'scopedValue';
      const registerCommand = service.resolve<ICommands>('IoC.Register', 'scopedKey', mockFactory);
      registerCommand.execute();
      
      expect(service.resolve<string>('scopedKey')).toBe('scopedValue');
    });
    
    it('выбрасывает ошибку при переключении на несуществующий скоп', () => {
      const command = service.resolve<ICommands>('Scopes.Current', 'nonexistentScope');
      expect(() => command.execute()).toThrow('Скоп не найден');
    });
  });
  
  describe('Очереди команд', () => {
    beforeEach(() => {
      const newScopeCommand = service.resolve<ICommands>('Scopes.New', 'default');
      newScopeCommand.execute();
    });
    
    it('должен добавлять и обрабатывать команды в очереди', async () => {
      const mockCommand: ICommands = { execute: jest.fn() };
      service.addToQueue('default', mockCommand);
      
      const startCommand = service.resolve<ICommands>('Queue.Start', 'default');
      await startCommand.execute();
      
      expect(mockCommand.execute).toHaveBeenCalled();
    });
    
    it('должен мягко останавливать обработку очереди', () => {
      const queue = service['queues'].get('default');
      jest.spyOn(queue, 'requestStop');
      
      const stopCommand = service.resolve<ICommands>('Queue.SoftStop', 'default');
      stopCommand.execute();
      
      expect(queue.requestStop).toHaveBeenCalledWith(false);
    });
    
    it('должен жестко останавливать обработку очереди', () => {
      const queue = service['queues'].get('default');
      jest.spyOn(queue, 'requestStop');
      
      const stopCommand = service.resolve<ICommands>('Queue.HardStop', 'default');
      stopCommand.execute();
      
      expect(queue.requestStop).toHaveBeenCalledWith(true);
    });
    
    it('выполняет все очереди параллельно', async () => {
      const scope1Command = service.resolve<ICommands>('Scopes.New', 'scope1');
      const scope2Command = service.resolve<ICommands>('Scopes.New', 'scope2');
      
      scope1Command.execute();
      scope2Command.execute();
      
      const mockCommand1: ICommands = { execute: jest.fn() };
      const mockCommand2: ICommands = { execute: jest.fn() };
      
      const queue1 = service['queues'].get('scope1');
      const queue2 = service['queues'].get('scope2');
      
      queue1.add(mockCommand1);
      queue2.add(mockCommand2);
      
      const resolveCommand = service.resolve<ICommands>('IoC.ResolveQueue');
      await resolveCommand.execute();
      
      expect(mockCommand1.execute).toHaveBeenCalled();
      expect(mockCommand2.execute).toHaveBeenCalled();
    });
  });
  
  describe('Управление очередью', () => {
    it('должен запускать обработку команд в отдельном потоке', async () => {
      const mockCommand: ICommands = {
        execute: jest.fn().mockImplementation(() => Promise.resolve())
      };
      
      // Получаем очередь
      const queue = service['queues'].get('default');
      expect(queue.isRunning()).toBe(false);
      
      // Добавляем команду
      service.addToQueue('default', mockCommand);
      
      // Запускаем обработку
      const startCommand = service.resolve<ICommands>('Queue.Start', 'default');
      await startCommand.execute();
      
      // Проверяем выполнение команды
      expect(mockCommand.execute).toHaveBeenCalled();
    });
    
    it('должен продолжать работу при ошибке в команде', async () => {
      // Создаем промис для отслеживания выполнения нормальной команды
      let resolveNormal;
      const normalExecuted = new Promise(resolve => {
        resolveNormal = resolve;
      });
      
      const errorCommand: ICommands = {
        execute: jest.fn().mockImplementation(() => {
          throw new Error('Test error');
        })
      };
      const normalCommand: ICommands = {
        execute: jest.fn().mockImplementation(() => {
          resolveNormal();
          return Promise.resolve();
        })
      };
      
      // Получаем очередь
      const queue = service['queues'].get('default');
      expect(queue).toBeDefined();
      
      // Добавляем команды
      service.addToQueue('default', errorCommand);
      service.addToQueue('default', normalCommand);
      
      // Запускаем обработку
      const startCommand = service.resolve<ICommands>('Queue.Start', 'default');
      await startCommand.execute();
      
      // Ждем выполнения нормальной команды
      await normalExecuted;
      
      // Проверяем, что обе команды были вызваны
      expect(errorCommand.execute).toHaveBeenCalled();
      expect(normalCommand.execute).toHaveBeenCalled();
    });
  });
});
