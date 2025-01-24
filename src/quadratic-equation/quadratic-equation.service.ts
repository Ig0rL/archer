import {
	BadRequestException,
	Injectable
} from '@nestjs/common';

@Injectable()
export class QuadraticEquationService {
	// Метод solve принимает коэффициенты квадратного уравнения и возвращает массив корней
	solve(a: number, b: number, c: number): number[] {
		const EPSILON = 1e-10; // Константа для сравнения с нулем из-за особенностей работы с числами с плавающей точкой
		
		// Проверка, что все коэффициенты являются конечными числами
		if (!isFinite(a) || !isFinite(b) || !isFinite(c)) {
			throw new BadRequestException('Коэффициенты должны быть числами.');
		}
		
		// Проверка, что коэффициент "a" не равен нулю (сравнение с использованием EPSILON)
		if (Math.abs(a) < EPSILON) {
			throw new BadRequestException('Коэффициент "a" не может быть равен нулю.');
		}
		
		// Вычисление дискриминанта
		const discriminant = b * b - 4 * a * c;
		
		// Если дискриминант меньше нуля, корней нет
		if (discriminant < -EPSILON) {
			return [];
		} // Если дискриминант близок к нулю, есть один корень кратности 2
		else if (Math.abs(discriminant) < Number.EPSILON) {
			const result = -b / (2 * a); // Вычисление единственного корня
			return [result];
		}// Если дискриминант больше нуля, есть два различных корня
		else {
			const sqrtDiscriminant = Math.sqrt(discriminant); // Квадратный корень из дискриминанта
			const result1 = (-b + sqrtDiscriminant) / (2 * a); // Первый корень
			const result2 = (-b - sqrtDiscriminant) / (2 * a); // Второй корень
			return [result1, result2];
		}
	}
}
