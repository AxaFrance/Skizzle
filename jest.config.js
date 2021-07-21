module.exports = {
  testEnvironment: 'jsdom',
	setupFiles: ['jest-localstorage-mock', './src/setupTests.ts'],
  verbose: true,
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec).+(ts|tsx|js)"],
  clearMocks: true,
  transform: {
    "^.+\\.(js|mjs)$": "babel-jest",
    "^.+\\.ts$": "ts-jest",
    "^.+\\.svelte$": [
      "svelte-jester",
      {
        "preprocess": true
      }
    ]    
  },
  moduleFileExtensions: [
    "js",
    "mjs",
    "ts",
    "svelte"
  ],
  coverageDirectory: "coverage",
  coverageReporters: ["json", "lcov", "text", "clover", "html"],
  collectCoverageFrom: [
    "src/**/*.js",
    "src/**/*.svelte",
    "src/**/*.ts"
  ],
  coverageProvider: "babel",
  coveragePathIgnorePatterns: [
    ".*\\.d\\.ts"
  ],
	testPathIgnorePatterns: ['node_modules'],
	transformIgnorePatterns: ['node_modules'],
	bail: false,
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect']
};