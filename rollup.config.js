import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import { scss } from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: !production,
		format: 'iife',
		name: 'Skizzle',
		file: 'public/build/bundle.js',
	},
	plugins: [
		replace({
			process: JSON.stringify({
				env: {
					isProd: production,
				},
			}),
		}),
		svelte({
			dev: !production,
			preprocess: [
				scss({
					output: true,
					failOnError: true,
				}),
			],
			css: css => {
				css.write('public/build/bundle.css');
			},
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		!production && serve(),
		!production && livereload('public'),
		production && terser(),
		filesize(),
	],
	watch: {
		clearScreen: false,
	},
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;
			}
		},
	};
}
