import { Test, TestingModule } from '@nestjs/testing';
import { QuadraticEquationService } from './quadratic-equation.service';

describe('Решение квадратных уравнений', () => {
	let service: QuadraticEquationService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [QuadraticEquationService],
		}).compile();

		service = module.get<QuadraticEquationService>(QuadraticEquationService);
	});

	it('Уравнение x^2 + 1 = 0 не имеет корней. Возвращаем пустой массив []', () => {
		expect(service.solve(1, 0, 1)).toEqual([]);
	});

	it('Уравнение x^2 - 1 = 0 должно возвращать два корня [1, -1]', () => {
		expect(service.solve(1, 0, -1)).toEqual([1, -1]);
	});

	it('Уравнение x^2 + 2x + 1 = 0 должно возвращать один корень кратности 2 [-1]', () => {
		expect(service.solve(1, 2, 1)).toEqual([-1]);
	});

	it('Если коэффициент "a" равен нулю. Выбрасывать ошибку', () => {
		expect(() => service.solve(0, 1, 1)).toThrowError(
			'Коэффициент "a" не может быть равен нулю.',
		);
	});

	it('Корректно обрабатываем дискриминант, близкий к нулю', () => {
		const EPSILON = 1e-10; // Малое значение для создания дискриминанта, близкого к нулю
		const a = 1;
		const b = 2 + EPSILON;
		const c = 1;
		// Ожидаем два близких корня
		const result = service.solve(a, b, c);

		expect(result.length).toBe(2);
		expect(result[0]).toBeCloseTo(-1);
		expect(result[1]).toBeCloseTo(-1);
	});

	it('Выбрасываем ошибку для некорректных коэффициентов', () => {
		const invalidValues = [NaN, Infinity, -Infinity];
		invalidValues.forEach((value) => {
			expect(() => service.solve(value, 1, 1)).toThrowError(
				'Коэффициенты должны быть числами.',
			);
			expect(() => service.solve(1, value, 1)).toThrowError(
				'Коэффициенты должны быть числами.',
			);
			expect(() => service.solve(1, 1, value)).toThrowError(
				'Коэффициенты должны быть числами.',
			);
		});
	});
});
