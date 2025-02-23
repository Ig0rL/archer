import { Test, TestingModule } from '@nestjs/testing';
import { RotateChangeVelocityMacroService } from './rotate-change-velocity-macro.service';
import { ChangeVelocityCommandAdapter } from '@/commands/change-velocity-command/change-velocity-command.adapter';
import { RotationAdapter } from '@/commands/rotate/rotation.adapter';
import { ChangeVelocityCommandService } from '@/commands/change-velocity-command/change-velocity-command.service';
import { RotateService } from '@/commands/rotate/rotate.service';

describe('RotateCheckVelocityMacroService', () => {
  let rotateChangeVelocityMacroService: RotateChangeVelocityMacroService;
  let changeVelocityCommandAdapter: ChangeVelocityCommandAdapter;
  let changeVelocityCommandService: ChangeVelocityCommandService;
  let rotationAdapter: RotationAdapter;
  let rotateService: RotateService;

  beforeEach(async () => {
    changeVelocityCommandService = {
      execute: jest.fn(),
    } as unknown as ChangeVelocityCommandService;
    
    rotateService = {
      execute: jest.fn(),
    } as unknown as RotateService;
    
    const module: TestingModule = await Test.createTestingModule({
      // imports: [RotateModule, ChangeVelocityCommandModule, MacroCommandModule],
      providers: [
        RotateChangeVelocityMacroService,
        {
          provide: ChangeVelocityCommandAdapter,
          useValue: {
            getVelocity: jest.fn().mockReturnValue({ x: 5, y: 12 }),
            getCurrentLocation: jest.fn(),
            getCurrentAngel: jest.fn(),
            setVelocity: jest.fn(),
          },
        },
        {
          provide: RotationAdapter,
          useValue: {
            getDirection: jest.fn(),
            getAngularVelocity: jest.fn(),
            setDirection: jest.fn(),
            getDirectionsNumber: jest.fn(),
          },
        },
        {
          provide: ChangeVelocityCommandService,
          useValue: changeVelocityCommandService,
        },
        {
          provide: RotateService,
          useValue: rotateService,
        }
      ],
    }).compile();
    
    rotateChangeVelocityMacroService = module.get<RotateChangeVelocityMacroService>(RotateChangeVelocityMacroService);
    rotationAdapter = module.get<RotationAdapter>(RotationAdapter);
    changeVelocityCommandAdapter = module.get<ChangeVelocityCommandAdapter>(ChangeVelocityCommandAdapter);
  });

  it('Меняем вектор мгновенной скорости при повороте объекта', () => {
    let direction = 0;
    
    jest
      .spyOn(rotationAdapter, 'getDirection')
      .mockImplementation(() => direction);
    jest.spyOn(rotationAdapter, 'getAngularVelocity').mockReturnValue(45);
    jest.spyOn(rotationAdapter, 'getDirectionsNumber').mockReturnValue(360);
    jest
      .spyOn(rotationAdapter, 'setDirection')
      .mockImplementation((newDirection: number) => {
        direction = newDirection;
      });
    
    // Настроим адаптер с координатами и углом
    changeVelocityCommandAdapter.getCurrentLocation = jest.fn().mockReturnValue({ x: 12, y: 5 });
    changeVelocityCommandAdapter.getCurrentAngel = jest.fn().mockReturnValue(45);
    
    const executeSpy = jest.spyOn(rotateChangeVelocityMacroService, 'execute');
    
    rotateChangeVelocityMacroService.execute();
    
    expect(executeSpy).toHaveBeenCalled();
    
    const currentAngel = rotationAdapter.getDirection();
    const currentVelocity = changeVelocityCommandAdapter.getVelocity();
    expect(currentAngel).toBe(45);
    expect(currentVelocity.x).toBe(5);
    expect(currentVelocity.y).toBe(12);
  });
});
