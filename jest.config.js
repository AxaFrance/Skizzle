module.exports = {
	setupFiles: ['jest-localstorage-mock', './src/setupTests.js'],
	transform: {
		'\\.(ts)$': 'ts-jest',
		'^.+\\.svelte$': [
			'svelte-jester',
			{ preprocess: require('./svelte.config').createPreprocessors },
		],
		'^.+\\.js$': 'babel-jest',
	},
	moduleFileExtensions: ['js', 'ts', 'json', 'svelte'],
	testPathIgnorePatterns: ['node_modules'],
	transformIgnorePatterns: ['node_modules'],
	bail: false,
	verbose: true,
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
