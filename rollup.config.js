import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'Skizzle',
		file: 'public/build/bundle.js',
	},
	plugins: [
		//typeCheck(),
		svelte({
			dev: !production,
			preprocess: sveltePreprocess(),
			css: css => {
				css.write('public/build/bundle.css');
			},
		}),
		typescript({ sourceMap: !production }),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		!production && livereload('public'),
		production && terser(),
	],
	watch: {
		clearScreen: false,
	},
};

function typeCheck() {
	return {
		writeBundle() {
			require('child_process').spawn('svelte-check', {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true,
			});
		},
	};
}
