module.exports = {
    testEnvironment: 'node',
    transform: {
      '^.+\\.ts?$': 'ts-jest',
    },
    moduleFileExtensions: ['js', 'ts'],
    testPathIgnorePatterns: ['/node_modules/', '/.next/'],
    verbose: true,
  };
  