import { Test, TestingModule } from '@nestjs/testing';
import { CheckFuelService } from '@/commands/fuel/check-fuel.service';
import { FuelAdapter } from '@/commands/fuel/fuel.adapter';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { CommandException } from '@/exceptions/comman-exception';

describe('CheckFuelService', () => {
  let checkFuelService: CheckFuelService;
  let fuelAdapter: jest.Mocked<FuelAdapter>;
  let exceptionService: jest.Mocked<ExceptionsService>;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CheckFuelService,
        {
          provide: FuelAdapter,
          useValue: {
            getFuel: jest.fn(),
            getFuelConsumption: jest.fn(),
          },
        },
        {
          provide: ExceptionsService,
          useValue: {
            handle: jest.fn(),
          },
        },
      ],
    }).compile();
    
    checkFuelService = module.get<CheckFuelService>(CheckFuelService);
    fuelAdapter = module.get<FuelAdapter>(FuelAdapter) as jest.Mocked<FuelAdapter>;;
    exceptionService = module.get<ExceptionsService>(ExceptionsService) as jest.Mocked<ExceptionsService>;;
  });
  
  it('Команда не должна выбрасывать исключения если топлива достаточно', () => {
    fuelAdapter.getFuel.mockReturnValue(10);
    fuelAdapter.getFuelConsumption.mockReturnValue(5);
    
    checkFuelService.execute();
    
    expect(exceptionService.handle).not.toHaveBeenCalled();
  });
  
  it('Команда должна выбрасывать исключение, если топлива недостаточно', () => {
    fuelAdapter.getFuel.mockReturnValue(2);
    fuelAdapter.getFuelConsumption.mockReturnValue(5);
    
    checkFuelService.execute();
    
    expect(exceptionService.handle).toHaveBeenCalledWith(
      checkFuelService,
      new CommandException('Недостаточно топлива для движения', 'CheckFuelService'),
    );
  });
});
