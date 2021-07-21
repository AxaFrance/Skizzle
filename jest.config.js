module.exports = {
	setupFiles: ['jest-localstorage-mock', './src/setupTests.ts'],
  verbose: true,
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec).+(ts|tsx|js)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
    "^.+\\.svelte$": "svelte-jester",
    "^.+\\.js$": "babel-jest",
  },
	testPathIgnorePatterns: ['node_modules'],
	transformIgnorePatterns: ['node_modules'],
	bail: false,
  moduleFileExtensions: ["js", "svelte", "ts"],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};