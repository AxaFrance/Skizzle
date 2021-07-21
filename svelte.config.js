const sveltePreprocess = require('svelte-preprocess');

function createPreprocessors(sourceMap) {
	return sveltePreprocess({
		tsconfigFile: './tsconfig.json',
		sourceMap,
		scss: {
			includePaths: ['src'],
			implementation: require('sass'),
			renderSync: true
		},
	});
}

module.exports = {
	preprocess: createPreprocessors(true),
	createPreprocessors,
};
