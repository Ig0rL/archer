import type { JestConfigWithTsJest } from 'ts-jest';

const config: JestConfigWithTsJest = {
	preset: 'ts-jest',
	moduleFileExtensions: ['js', 'json', 'ts'],
	transform: {
		'^.+\\.(t|j)sx?$': 'ts-jest',
	},
	testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/src/$1',
	},
};

export default config;
