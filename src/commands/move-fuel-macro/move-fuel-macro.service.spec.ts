import { Test, TestingModule } from '@nestjs/testing';
import { MoveFuelMacroService } from './move-fuel-macro.service';
import { MoveService } from '@/commands/move/move.service';
import { CheckFuelService } from '@/commands/fuel/check-fuel.service';
import { BurnFuelService } from '@/commands/fuel/burn-fuel.service';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';
import { CommandException } from '@/exceptions/comman-exception';
import { VectorService } from '@/commands/vector/vector.service';

describe('MoveFuelMacroService', () => {
  let moveFuelMacroService: MoveFuelMacroService;
  let movingAdapter: MovingAdapter;
  let fuelAdapter: FuelAdapter;
  let exceptionService: ExceptionsService;
  let moveService: MoveService;
  let burnFuelService: BurnFuelService;
  
  beforeEach(async () => {
    burnFuelService = {
      execute: jest.fn(),
    } as unknown as BurnFuelService;
    
    moveService = {
     execute: jest.fn(),
    } as unknown as MoveService;
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoveFuelMacroService,
        {
          provide: MovingAdapter,
          useValue: {
            getLocation: jest.fn(),
            getVelocity: jest.fn(),
            setLocation: jest.fn(),
          },
        },
        {
          provide: FuelAdapter,
          useValue: {
            getFuel: jest.fn(),
            setFuel: jest.fn(),
            getFuelConsumption: jest.fn(),
          },
        },
        {
          provide: ExceptionsService,
          useValue: {
            handle: jest.fn(),
          },
        },
        {
          provide: MoveService,
          useValue: moveService,
        },
        {
          provide: BurnFuelService,
          useValue: burnFuelService,
        },
      ],
    }).compile();
    
    moveFuelMacroService = module.get<MoveFuelMacroService>(MoveFuelMacroService);
    movingAdapter = module.get<MovingAdapter>(MovingAdapter);
    fuelAdapter = module.get<FuelAdapter>(FuelAdapter);
    exceptionService = module.get<ExceptionsService>(ExceptionsService);
  });
  
  it('Меняем позицию объекта в пространстве с расходом топлива', () => {
    jest.spyOn(fuelAdapter, 'getFuel').mockReturnValue(100);
    jest.spyOn(fuelAdapter, 'getFuelConsumption').mockReturnValue(10);
    
    let currentLocation = new VectorService(0, 0);
    
    // Мокаем методы
    jest
      .spyOn(movingAdapter, 'getLocation')
      .mockImplementation(() => currentLocation);
    jest
      .spyOn(movingAdapter, 'getVelocity')
      .mockReturnValue(new VectorService(10, 10));
    jest
      .spyOn(movingAdapter, 'setLocation')
      .mockImplementation((newLocation) => {
        currentLocation = newLocation;
      });
    
    const initialPosition = movingAdapter.getLocation();
    const initialFuel = fuelAdapter.getFuel();
    
    moveFuelMacroService.execute();
    
    const updatedPosition = movingAdapter.getLocation();
    const { x, y } = updatedPosition.getPosition();
    
    const { x: initX, y: initY } = initialPosition.getPosition();
    expect(x).toBe(initX + 10);
    expect(y).toBe(initY + 10);
    expect(fuelAdapter.setFuel).toHaveBeenCalledWith(initialFuel - 10);
  });
  
  it('Топлива недостаточно для перемещения. Выбрасываем исключение и останавливаем выполнение других команд', () => {
    jest.spyOn(fuelAdapter, 'getFuel').mockImplementation(() => 5);
    jest.spyOn(fuelAdapter, 'getFuelConsumption').mockReturnValue(10);
    
    let currentLocation = new VectorService(0, 0);
    
    // Мокаем методы
    jest
      .spyOn(movingAdapter, 'getLocation')
      .mockImplementation(() => currentLocation);
    jest
      .spyOn(movingAdapter, 'getVelocity')
      .mockReturnValue(new VectorService(10, 10));
    jest
      .spyOn(movingAdapter, 'setLocation')
      .mockImplementation((newLocation) => {
        currentLocation = newLocation;
      });
    
    const exception = new CommandException('Недостаточно топлива для движения', 'CheckFuelService');
    jest.spyOn(exceptionService, 'handle');
    
    moveFuelMacroService.execute();
    
    // Check that exception was handled
    expect(exceptionService.handle).toHaveBeenCalledWith(expect.any(CheckFuelService), exception);
    
    // Ensure that other commands (MoveService and BurnFuelService) are not called
    expect(moveService.execute).not.toHaveBeenCalled();
    expect(burnFuelService.execute).not.toHaveBeenCalled();
  });
});
