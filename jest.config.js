module.exports = {
	setupFiles: ['jest-localstorage-mock', './src/setupTests.js'],
	transform: {
		'^.+\\.svelte$': 'svelte-jester',
		'^.+\\.js$': 'babel-jest',
	},
	moduleFileExtensions: ['js', 'json', 'svelte'],
	coverageReporters: ['html'],
	bail: false,
	verbose: false,
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
