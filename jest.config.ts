import { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  moduleDirectories: ['node_modules', '<rootDir>'],
  transformIgnorePatterns: [
    'node_modules/(?!(@faker-js/faker|.*\\.mjs$))',
  ],
  testMatch: ['**/+(*.)+(spec).+(ts)'],
  moduleNameMapper: {
    '^@core/(.*)$': '<rootDir>/src/app/core/$1',
    '^@utils/(.*)$': '<rootDir>/src/app/utils/$1',
    '^@shared/(.*)$': '<rootDir>/src/app/shared/$1',
    '^@mocks/(.*)$': '<rootDir>/src/mocks/$1',
    '^@env/(.*)$': '<rootDir>/src/environments/$1',
  },
  // Coverage configuration
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  collectCoverageFrom: [
    'src/app/**/*.{ts,js}',
    '!src/app/**/*.spec.{ts,js}',
    '!src/app/**/*.d.ts',
    '!src/app/**/index.ts',
    '!src/app/app.routes.ts',
    '!src/app/app.config.ts',
    '!src/app/utils/utils.ts',
    '!src/app/utils/forms/validators.ts',
  ],
  // Coverage thresholds - fail if coverage is below 70%
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
    // You can also set specific thresholds for certain paths
    // 'src/app/shared/**/*.ts': {
    //   branches: 80,
    //   functions: 80,
    //   lines: 80,
    //   statements: 80,
    // },
    // 'src/app/core/**/*.ts': {
    //   branches: 75,
    //   functions: 75,
    //   lines: 75,
    //   statements: 75,
    // },
  },
};

export default config;
