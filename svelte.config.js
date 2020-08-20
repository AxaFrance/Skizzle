const sveltePreprocess = require('svelte-preprocess');

function createPreprocessors(sourceMap) {
	return sveltePreprocess({
		sourceMap,
		defaults: {
			script: 'typescript',
			style: 'scss',
		},
	});
}

module.exports = {
	preprocess: createPreprocessors(true),
	createPreprocessors,
};
