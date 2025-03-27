import {
	isMainThread,
	parentPort
} from 'worker_threads';
import {
	Injectable
} from '@nestjs/common';
import { IocContainer } from '@/ioc-container/ioc-container.service';
import { ICommands } from '@/commands/commands.interface';
import { VectorService } from '@/commands/vector/vector.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { MoveService } from '@/commands/move/move.service';

@Injectable()
export class FastMoveScopeWorker {
	public initialize(): void {
		parentPort.on('message', (msg) => {
			// Отправляем полученное сообщение обратно в основной поток
			const ioc = new IocContainer();
			ioc.resolve<ICommands>('Scopes.New', 'fastMoveScope').execute();
			ioc.resolve<ICommands>('Scopes.Current', 'fastMoveScope').execute();
			// Регистрация VectorService
			ioc.resolve<ICommands>('IoC.Register', 'VectorService', (args: any[]) => {
				const [x, y] = args;
				return new VectorService(x, y);
			}).execute();
			
			// Регистрация MovingAdapter
			ioc.resolve<ICommands>('IoC.Register', 'MovingAdapter', (args: any[]) => {
				const [locationArgs, velocityArgs] = args
				const location = ioc.resolve<VectorService>('VectorService', ...locationArgs);
				const velocity = ioc.resolve<VectorService>('VectorService', ...velocityArgs);
				return new MovingAdapter(location, velocity);
			}).execute();
			
			// Регистрация MoveService в дефолтном scope
			ioc.resolve<ICommands>('IoC.Register', 'MoveService', (args: any[]) => {
				const [adapterArgs] = args;
				return new MoveService(adapterArgs);
			}).execute();
			
			const movingAdapter = ioc.resolve<MovingAdapter>('MovingAdapter', ...msg.args);
			
			// Создаем MoveService с адаптером
			const moveService = ioc.resolve<MoveService>('MoveService', ...[movingAdapter]);
			// Выполняем команду execute
			moveService.execute();
			// Выводим обновленную позицию
			const updatedPosition = movingAdapter.getLocation().getPosition();
			parentPort.postMessage({ type: 'result', result: updatedPosition });
		});
	}
}

if (!isMainThread) {
	(new FastMoveScopeWorker()).initialize();
}
