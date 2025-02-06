import { Test, TestingModule } from '@nestjs/testing';
import { MoveService } from './move.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { VectorService } from '@/commands/vector/vector.service';

describe('MoveService', () => {
  let moveService: MoveService;
  let movableAdapter: MovingAdapter;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoveService,
        {
          provide: MovingAdapter,
          useValue: {
            getLocation: jest.fn(),
            getVelocity: jest.fn(),
            setLocation: jest.fn(),
          },
        },
      ],
    }).compile();
    
    moveService = module.get<MoveService>(MoveService);
    movableAdapter = module.get<MovingAdapter>(MovingAdapter);
  });
  
  it('Перемещаем объект из (12, 5) со скоростью (-7, 3) в (5, 8)', () => {
    let currentLocation = new VectorService(12, 5);
    
    // Мокаем методы
    jest.spyOn(movableAdapter, 'getLocation').mockImplementation(() => currentLocation);
    jest.spyOn(movableAdapter, 'getVelocity').mockReturnValue(new VectorService(-7, 3));
    jest.spyOn(movableAdapter, 'setLocation').mockImplementation((newLocation) => {
      currentLocation = newLocation;
    });
    
    moveService.execute();
    
    expect(movableAdapter.setLocation).toHaveBeenCalledWith(
      expect.objectContaining({ x: 5, y: 8 })
    );
    
    const newLocation = movableAdapter.getLocation();
    const { x, y } = newLocation.getPosition();
    expect(x).toBe(5);
    expect(y).toBe(8);
  });
  
  it('Выдаем ошибку при вызове getLocation когда невозможно прочитать положение в пространстве', () => {
    const movingAdapter = new MovingAdapter();
    (movingAdapter as any).location = undefined; // Симулируем потерю данных
    expect(() => movingAdapter.getLocation()).toThrow('Невозможно прочитать положение в пространстве');
  });
  
  it('Выдаем ошибку при вызове setLocation когда невозможно изменить положение в пространстве', () => {
    const movingAdapter = new MovingAdapter();
    expect(() => movingAdapter.setLocation(undefined as any))
      .toThrow('Невозможно изменить положение в пространстве: position is undefined');
  });
  
  it('Выдаем ошибку при вызове getVelocity когда невозможно прочитать значение мгновенной скорости', () => {
    const movingAdapter = new MovingAdapter();
    (movingAdapter as any).velocity = undefined; // Симулируем потерю данных
    expect(() => movingAdapter.getVelocity()).toThrow('Невозможно прочитать значение мгновенной скорости');
  });
});
