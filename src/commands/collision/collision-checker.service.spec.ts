import { Test, TestingModule } from '@nestjs/testing';
import { CollisionCheckerService } from './collision-checker.service';
import { MacroCommandService } from '@/commands/macro-command/macro-command.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { VectorService } from '@/commands/vector/vector.service';
import { CollisionHandler } from './collision-handler.service';

describe('#CollisionCheckerService()', () => {
    let service: CollisionCheckerService;
    let macroCommandService: MacroCommandService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CollisionCheckerService,
                {
                    provide: MacroCommandService,
                    useValue: {
                        execute: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<CollisionCheckerService>(CollisionCheckerService);
        macroCommandService = module.get<MacroCommandService>(MacroCommandService);
    });

    describe('#NeighborhoodHandler()', () => {
        let object1: MovingAdapter;
        let object2: MovingAdapter;

        beforeEach(() => {
            object1 = new MovingAdapter(new VectorService(0, 0));
            object2 = new MovingAdapter(new VectorService(50, 50));
        });

        it('Размещение объектов в правильных окрестностях', () => {
            const handler = new CollisionHandler(macroCommandService);
            handler.handle(object1);
            handler.handle(object2);

            // Проверяем, что объекты находятся в правильных окрестностях
            expect(handler['objects'].get('0,0')?.has(object1)).toBeTruthy();
            expect(handler['objects'].get('0,0')?.has(object2)).toBeTruthy();
        });

        it('Обновляет окрестность при перемещении объекта', () => {
            const handler = new CollisionHandler(macroCommandService);
            handler.handle(object1);
            
            // Перемещаем объект в новую окрестность
            object1.setLocation(new VectorService(150, 150));
            handler.handle(object1);

            // Проверяем, что объект переместился в новую окрестность
            expect(handler['objects'].get('0,0')?.has(object1)).toBeFalsy();
            expect(handler['objects'].get('1,1')?.has(object1)).toBeTruthy();
        });

        it('Обработка нескольких окрестностей', () => {
            service = new CollisionCheckerService(macroCommandService);
            const objects = [
                new MovingAdapter(new VectorService(75, 75)),
                new MovingAdapter(new VectorService(125, 125))
            ];

            service.checkCollision(objects);

            // Проверяем, что объекты обрабатываются в обеих системах окрестностей
            expect(macroCommandService.execute).toHaveBeenCalled();
        });

        it('Обработка граничных случаев между окрестностями', () => {
            const handler = new CollisionHandler(macroCommandService);
            const borderObject = new MovingAdapter(new VectorService(99, 99));
            handler.handle(borderObject);

            // Объект должен быть добавлен в правильную окрестность
            expect(handler['objects'].get('0,0')?.has(borderObject)).toBeTruthy();
        });

        it('Создание команд проверки коллизий для объектов в одной окрестности', () => {
            const handler = new CollisionHandler(macroCommandService);
            const objects = [
                new MovingAdapter(new VectorService(10, 10)),
                new MovingAdapter(new VectorService(20, 20))
            ];

            objects.forEach(obj => handler.handle(obj));

            // Проверяем, что созданы команды проверки коллизий
            expect(macroCommandService.execute).toHaveBeenCalled();
        });
    });
});
