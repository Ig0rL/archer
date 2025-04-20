import { Injectable } from '@nestjs/common';
import { QueueWorkerService } from '@/commands/queue-command/queue-worker/queue-worker.service';
import { ExceptionsService } from '@/exceptions/exceptions.service';
import { ICommands } from '@/commands/commands.interface';

@Injectable()
export class IocService {
	private globalDependencies: Map<string, (args: any[]) => any> = new Map();
	private scopes: Map<string, Map<string, (args: any[]) => any>> = new Map();
	private queues: Map<string, QueueWorkerService> = new Map();
	private currentScope: string = 'default';
	
	constructor(private readonly exceptionHandler: ExceptionsService) {
		this.scopes.set('default', new Map());
		this.queues.set('default', new QueueWorkerService(this.exceptionHandler));
		
		this.globalDependencies.set('IoC.Register', (args: any[]) => {
			const [key, factory] = args as [string, (args: any[]) => any];
			return { execute: () => this.register(key, factory) };
		});
		
		this.globalDependencies.set('Scopes.New', (args: any[]) => {
			const [scopeId] = args as [string];
			return { execute: () => this.newScope(scopeId) };
		});
		
		this.globalDependencies.set('Scopes.Current', (args: any[]) => {
			const [scopeId] = args as [string];
			return { execute: () => this.setCurrentScope(scopeId) };
		});
		
		// Добавление команд для работы с очередью
		this.globalDependencies.set('Queue.Start', (args: any[]) => {
			const [scopeId] = args as [string];
			return {
				execute: () => this.startQueueProcessing(scopeId || this.currentScope)
			};
		});
		
		this.globalDependencies.set('Queue.HardStop', (args: any[]) => {
			const [scopeId] = args as [string];
			return {
				execute: () => this.stopQueueProcessing(scopeId || this.currentScope, true)
			};
		});
		
		this.globalDependencies.set('Queue.SoftStop', (args: any[]) => {
			const [scopeId] = args as [string];
			return {
				execute: () => this.stopQueueProcessing(scopeId || this.currentScope, false)
			};
		});
		
		this.globalDependencies.set('IoC.ResolveQueue', (args: any[]) => {
			return {
				execute: () => this.executeAllQueues()
			};
		});
	}
	
	public resolve<T>(key: string, ...args: any[]): T {
		return this.resolveInScope(key, this.currentScope, args) as T;
	}
	
	private resolveInScope(key: string, scopeId: string, args: any[]): any {
		const scopeDependencies = this.scopes.get(scopeId);
		
		if (scopeDependencies?.has(key)) {
			return scopeDependencies.get(key)(args);
		} else if (this.globalDependencies.has(key)) {
			return this.globalDependencies.get(key)(args);
		}
		throw new Error(`Зависимость не найдена: ${key}`);
	}
	
	private register(key: string, factory: (args: any[]) => any): void {
		const scopeDependencies = this.scopes.get(this.currentScope);
		scopeDependencies.set(key, factory);
	}
	
	private newScope(scopeId: string): void {
		if (!this.scopes.has(scopeId)) {
			this.scopes.set(scopeId, new Map());
			// Создание очереди для этого скопа
			this.queues.set(scopeId, new QueueWorkerService(this.exceptionHandler));
		}
	}
	
	public setCurrentScope(scopeId: string): void {
		if (!this.scopes.has(scopeId)) {
			throw new Error(`Скоп не найден: ${scopeId}`);
		}
		this.currentScope = scopeId;
	}
	
	// Добавление команды в очередь
	public addToQueue(scopeId: string, command: ICommands): void {
		const queue = this.queues.get(scopeId);
		if (!queue) {
			throw new Error(`Очередь для скопа ${scopeId} не найдена`);
		}
		queue.add(command);
	}
	
	// Запуск обработки очереди для скопа
	private startQueueProcessing(scopeId: string): Promise<void> {
		const queue = this.queues.get(scopeId);
		if (!queue) {
			throw new Error(`Очередь для скопа ${scopeId} не найдена`);
		}
		return queue.processQueue();
	}
	
	// Остановка обработки очереди (жесткая или мягкая)
	private stopQueueProcessing(scopeId: string, hardStop: boolean): void {
		const queue = this.queues.get(scopeId);
		if (!queue) {
			throw new Error(`Очередь для скопа ${scopeId} не найдена`);
		}
		queue.requestStop(hardStop);
	}
	
	// Выполнение всех очередей с использованием Promise.all
	public async executeAllQueues(): Promise<void> {
		const queueProcessingPromises = [];
		
		for (const [scopeId, queue] of this.queues.entries()) {
			if (!queue.isRunning()) {
				queueProcessingPromises.push(this.startQueueProcessing(scopeId));
			}
		}
		
		if (queueProcessingPromises.length > 0) {
			await Promise.all(queueProcessingPromises);
		}
	}
	
}
