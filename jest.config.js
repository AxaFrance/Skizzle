module.exports = {
	setupFiles: ['jest-localstorage-mock', './src/setupTests.js'],
	transform: {
		'\\.(ts)$': 'ts-jest',
		'^.+\\.svelte$': 'svelte-jester',
		'^.+\\.js$': 'babel-jest',
	},
	moduleFileExtensions: ['js', 'ts', 'svelte'],
	setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
};
