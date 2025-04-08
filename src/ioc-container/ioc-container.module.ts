import { Module, OnModuleInit } from '@nestjs/common';
import { IocContainer } from './ioc-container.service';
import { VectorModule } from '@/commands/vector/vector.module';
import { MoveModule } from '@/commands/move/move.module';
import { ICommands } from '@/commands/commands.interface';
import { VectorService } from '@/commands/vector/vector.service';
import { MovingAdapter } from '@/commands/move/moving.adapter';
import { MoveService } from '@/commands/move/move.service';
import { FastMoveScopeWorker } from '@/ioc-container/fastMoveScopeWorker';

@Module({
	imports: [VectorModule, MoveModule],
	providers: [IocContainer, FastMoveScopeWorker],
	exports: [IocContainer],
})
export class IocContainerModule implements OnModuleInit {
	constructor(
		private readonly ioc: IocContainer,
		private worker: FastMoveScopeWorker,
	) {
		// Регистрация VectorService
		this.ioc
			.resolve<ICommands>('IoC.Register', 'VectorService', (args: any[]) => {
				const [x, y] = args;
				return new VectorService(x, y);
			})
			.execute();

		// Регистрация MovingAdapter
		this.ioc
			.resolve<ICommands>('IoC.Register', 'MovingAdapter', (args: any[]) => {
				const [locationArgs, velocityArgs] = args;
				const location = this.ioc.resolve<VectorService>(
					'VectorService',
					...locationArgs,
				);
				const velocity = this.ioc.resolve<VectorService>(
					'VectorService',
					...velocityArgs,
				);
				return new MovingAdapter(location, velocity);
			})
			.execute();

		// Регистрация MoveService в дефолтном scope
		this.ioc
			.resolve<ICommands>('IoC.Register', 'MoveService', (args: any[]) => {
				const [adapterArgs] = args;
				return new MoveService(adapterArgs);
			})
			.execute();

		// Создание scope с воркером и кастомной командой
		this.ioc.resolve<ICommands>('Scopes.New', 'fastMoveScope').execute();
		this.ioc.resolve<ICommands>('Scopes.Current', 'fastMoveScope').execute();
		this.ioc
			.resolve<ICommands>('IoC.Register', 'MoveService', (args: any[]) => {
				const [adapterArgs] = args;
				return new MoveService(adapterArgs);
			})
			.execute();

		// Возвращаемся в дефолтный scope
		this.ioc.resolve<ICommands>('Scopes.Current', 'default').execute();
	}

	async onModuleInit(): Promise<void> {
		const adapterArgs = [
			[12, 5],
			[-7, 3],
		];
		const movingAdapter = this.ioc.resolve<MovingAdapter>(
			'MovingAdapter',
			...adapterArgs,
		);

		// Создаем MoveService с адаптером
		const moveService = this.ioc.resolve<MoveService>(
			'MoveService',
			...[movingAdapter],
		);

		// Выводим начальную позицию
		const initialPosition = movingAdapter.getLocation().getPosition();
		console.log('Начальная позиция:', initialPosition); // [12, 5]
		// Выполняем команду execute
		moveService.execute();
		// Выводим обновленную позицию
		const updatedPosition = movingAdapter.getLocation().getPosition();
		console.log('Обновленная позиция:', updatedPosition); // [5, 8]

		// выполняем команду в воркере и возвращаем в основной поток
		const fastMoveResult = await this.ioc.executeInWorker(
			'fastMoveScope',
			'MoveService',
			...adapterArgs,
		);
		console.log('Обновленная позиция из воркера:', fastMoveResult);
	}
}
