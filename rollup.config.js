import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import replace from '@rollup/plugin-replace';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import filesize from 'rollup-plugin-filesize';
import typescript from '@rollup/plugin-typescript';

const createPreprocessors = require('./svelte.config').createPreprocessors;
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
		replace({
			process: JSON.stringify({
				env: {
					isProd: production,
				},
			}),
		}),
		svelte({
			dev: !production,
			preprocess: createPreprocessors(!production),
			css: css => {
				css.write('public/build/bundle.css');
			},
		}),
		resolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		typescript({ sourceMap: !production }),
		!production && livereload('public'),
		production && terser(),
		filesize(),
	],
	external: ['electron', 'child_process', 'fs', 'path', 'url', 'module', 'os'],
	watch: {
		clearScreen: false,
	},
};
