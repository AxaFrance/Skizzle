

module.exports = {
  transform: {
    '\\.(ts)$': 'ts-jest',
    '^.+\\.svelte$': ['svelte-jester', { preprocess: true }],
    '^.+\\.js$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'ts', 'json', 'svelte'],
  testPathIgnorePatterns: ['node_modules'],
  transformIgnorePatterns: ['node_modules'],
  bail: false,
  verbose: true,
  moduleDirectories: ['node_modules', '.'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect', './src/setupTests.ts'],
  collectCoverageFrom: ['./src/**/*.svelte', './src/**/*.ts', './src/**/*.js'],
};