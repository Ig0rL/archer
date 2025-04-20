import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { IocContainer } from '@/ioc-container/ioc-container.service';

@Injectable()
export class AdapterGeneratorService {
	constructor(private iocContainer: IocContainer) {}
	
	public generateAdapter(data: any): void {
		const [interfaceImpl, interfaceName] = data;
		
		if (!interfaceName || typeof interfaceName !== 'string') {
			throw new Error('interfaceName должен быть строкой');
		}
		
		const adapterName = this.getAdapterName(interfaceName);
		const filePath = path.resolve('src', 'ioc-container', 'adapters', `${adapterName}.adapter.ts`);
		
		// Проверка на существование файла
		if (fs.existsSync(filePath)) {
			console.log(`Адаптер ${adapterName} уже существует. Пропускаем создание.`);
			return;
		}
		
		// Получение методов интерфейса
		const methods = this.getMethods(interfaceImpl);
		
		// Генерация кода адаптера
		const code = this.generateAdapterCode(data, methods);
		
		// Создание директории adapters, если её нет
		const dir = path.dirname(filePath);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true });
		}
		// Запись файла
		fs.writeFileSync(filePath, code);
		console.log(`Создан адаптер: ${filePath}`);
	}
	
	private getAdapterName(interfaceName: string): string {
		return `${interfaceName.replace(/^I/, '')}Adapter`;
	}
	
	private getMethods(interfaceImpl: any): MethodInfo[] {
		const prototype = interfaceImpl.prototype;
		const methods: MethodInfo[] = [];
		const methodNames = Object.getOwnPropertyNames(prototype).filter(
			(name) => name !== 'constructor' && typeof prototype[name] === 'function',
		);
		
		for (const methodName of methodNames) {
			methods.push({
				name: methodName,
				returnType: '',
				params: [],
			});
		}
		return methods;
	}
	
	private generateAdapterCode(data: string, methods: MethodInfo[]): string {
		const [interfaceName] = data
		const adapterName = this.getAdapterName(interfaceName);
		const interfacePath = `${interfaceName.toLowerCase()}.interface`.substring(1);
		let code = `import { Injectable } from '@nestjs/common';\n`;
		code += `import { IocContainer } from '@/ioc-container/ioc-container.service';\n`;
		code += `import { ${interfaceName} } from '@/commands/move/${interfacePath}';\n`;
		code += `import { ICommands } from '@/commands/commands.interface';\n\n`;
		
		code += `@Injectable()\n`;
		code += `export class ${adapterName} implements ${interfaceName} {\n`;
		code += `  constructor(private iocContainer: IocContainer) {}\n\n`;
		
		for (const method of methods) {
			const key = `${interfaceName}:${method.name}`;
			const paramsStr = method.params.map((p) => `${p.name}: ${p.type}`).join(', ');
			code += `  public ${method.name}(${paramsStr}): any {\n`;
			code += `    const key = "${key}";\n`;
			
			if (method.returnType === 'void') {
				code += `    const command = this.iocContainer.resolve<ICommands>(key, this${paramsStr ? ', ' + method.params.map((p) => p.name).join(', ') : ''});\n`;
				code += `    if (command && typeof command['execute'] === 'function') {\n`;
				code += `      command.execute();\n`;
				code += `    } else {\n`;
				code += `      throw new Error("Ожидался объект команды");\n`;
				code += `    }\n`;
			} else {
				code += `    const result = this.iocContainer.resolve<ICommands>(key, this${paramsStr ? ', ' + method.params.map((p) => p.name).join(', ') : ''});\n`;
				code += `    return result;\n`;
			}
			code += `  }\n\n`;
		}
		
		code += `}\n`;
		return code;
	}
}

interface MethodInfo {
	name: string;
	returnType: string;
	params: { name: string; type: string }[];
}
