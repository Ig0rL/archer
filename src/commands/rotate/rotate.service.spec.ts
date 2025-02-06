import { Test, TestingModule } from '@nestjs/testing';
import { RotateService } from './rotate.service';
import { RotationAdapter } from '@/commands/rotate/rotation.adapter';
import { MovingAdapter } from '@/commands/move/moving.adapter';

describe('RotateService', () => {
  let rotateService: RotateService;
  let rotateAdapter: RotationAdapter;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RotateService,
        {
          provide: RotationAdapter,
          useValue: {
            getDirection: jest.fn(),
            getAngularVelocity: jest.fn(),
            setDirection: jest.fn(),
            getDirectionsNumber: jest.fn(),
          }
        }
      ],
    }).compile();
    
    rotateService = module.get<RotateService>(RotateService);
    rotateAdapter = module.get<RotationAdapter>(RotationAdapter);
  });

  it('Объект повернут на 320 градусов, угловая скорость 100, поворот осуществляется на 60 градусов от нулевого положения', () => {
    let direction = 320;
    
    jest.spyOn(rotateAdapter, 'getDirection').mockImplementation(() => direction);
    jest.spyOn(rotateAdapter, 'getAngularVelocity').mockReturnValue(100);
    jest.spyOn(rotateAdapter, 'getDirectionsNumber').mockReturnValue(360);
    jest.spyOn(rotateAdapter, 'setDirection').mockImplementation((newDirection: number) => {
      direction = newDirection;
    });
    
    rotateService.execute();
    expect(rotateAdapter.getDirection()).toBe(60);
  });
  
  it('Объект повернут на 320 градусов, угловая скорость 0, поворот не осуществляется', () => {
    let direction = 320;
    
    jest.spyOn(rotateAdapter, 'getDirection').mockImplementation(() => direction);
    jest.spyOn(rotateAdapter, 'getAngularVelocity').mockReturnValue(0);
    jest.spyOn(rotateAdapter, 'getDirectionsNumber').mockReturnValue(360);
    jest.spyOn(rotateAdapter, 'setDirection').mockImplementation((newDirection: number) => {
      direction = newDirection;
    });
    
    rotateService.execute();
    expect(rotateAdapter.getDirection()).toBe(320);
  });
  
  it('Выдаем ошибку при вызове getDirection когда невозможно получить текущий угол поворота', () => {
    const rotationAdapter = new RotationAdapter();
    (rotationAdapter as any).direction = undefined; // Симулируем потерю данных
    expect(() => rotationAdapter.getDirection()).toThrow('Невозможно прочитать текущий угол поворота');
  });
  
  it('Выдаем ошибку при вызове getAngularVelocity когда невозможно прочитать значение угловой скорости', () => {
    const rotationAdapter = new RotationAdapter();
    (rotationAdapter as any).angularVelocity = undefined; // Симулируем потерю данных
    expect(() => rotationAdapter.getAngularVelocity()).toThrow('Невозможно прочитать значение угловой скорости');
  });
});
