module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  verbose: true,
  testPathIgnorePatterns: ['.history', 'node_modules'],
  coverageDirectory: './coverage'
};
