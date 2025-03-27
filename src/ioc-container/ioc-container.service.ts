import { Injectable } from '@nestjs/common';
import { Worker, isMainThread, workerData, parentPort } from 'worker_threads';

@Injectable()
export class IocContainer {
	private globalDependencies: Map<string, (args: any[]) => any> = new Map();
	private scopes: Map<string, Map<string, (args: any[]) => any>> = new Map();
	private workers: Map<string, Worker> = new Map();
	private currentScope: string = 'default'; // Текущий scope в основном потоке
	
	constructor() {
		this.scopes.set('default', new Map());
		
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
	}
	
	public resolve<T>(key: string, ...args: any[]): T {
		return this.resolveInMainThread(key, args) as T;
	}
	
	private resolveInMainThread(key: string, args: any[]): any {
		const scopeId = isMainThread ? this.currentScope : workerData?.scopeId || 'default';
		const scopeDependencies = this.scopes.get(scopeId);
		
		if (scopeDependencies?.has(key)) {
			return scopeDependencies.get(key)(args);
		} else if (this.globalDependencies.has(key)) {
			return this.globalDependencies.get(key)(args);
		}
		throw new Error(`Зависимость не найдена: ${key}`);
	}
	
	private register(key: string, factory: (args: any[]) => any): void {
		const scopeId = isMainThread ? this.currentScope : workerData?.scopeId || 'default';
		const scopeDependencies = this.scopes.get(scopeId);
		scopeDependencies.set(key, factory);
	}
	
	private newScope(scopeId: string): void {
		if (!this.scopes.has(scopeId)) {
			this.scopes.set(scopeId, new Map());
		}
	}
	
	public setCurrentScope(scopeId: string): void {
		if (!this.scopes.has(scopeId)) {
			throw new Error(`Скоп не найден: ${scopeId}`);
		}
		
		if (isMainThread) {
			this.currentScope = scopeId; // Обновляем текущий scope
			
			if (scopeId !== 'default' && !this.workers.has(scopeId)) {
				const worker = new Worker(`${__dirname}/${scopeId}Worker.js`, {
					workerData: { scopeId },
				});
				this.workers.set(scopeId, worker);
				
				worker.on('message', (msg) => {
					console.log(`Главный поток получил от воркера ${scopeId}:`, msg);
					if (msg.type === 'resolve') {
						const result = this.resolveInMainThread(msg.key, msg.args);
						worker.postMessage({ type: 'result', result });
					}
				});
				
				worker.on('error', (err) => console.error(`Worker ${scopeId} error:`, err));
				worker.on('exit', (code) => {
					this.workers.delete(scopeId);
					console.log(`Worker ${scopeId} завершился с кодом ${code}`);
				});
			}
		}
	}
	
	public async executeInWorker<T>(scopeId: string, key: string, ...args: any[]): Promise<T> {
		const worker = this.workers.get(scopeId);
		if (!worker) {
			throw new Error(`Worker для скопа ${scopeId} не найден`);
		}
		return new Promise((resolve, reject) => {
			worker.postMessage({ type: 'resolve', key, args });
			
			const messageHandler = (msg: any) => {
				if (msg.type === 'result') {
					resolve(msg.result);
					worker.off('message', messageHandler);
				} else if (msg.type !== 'resolve') {
					reject(new Error(`Unexpected message from worker: ${JSON.stringify(msg)}`));
					worker.off('message', messageHandler);
				}
			};
			
			worker.on('message', messageHandler);
		});
	}
}
