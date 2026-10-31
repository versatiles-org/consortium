import staticAdapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { defineConfig } from 'vite';

const base = (process.env.BASE_PATH ?? '') as '' | `/${string}`;

export default defineConfig({
	plugins: [
		sveltekit({
			preprocess: vitePreprocess(),
			adapter: staticAdapter(),
			paths: { base },
			prerender: { handleMissingId: 'ignore' },
		}),
	],
	build: {
		target: 'esnext',
	},
});
