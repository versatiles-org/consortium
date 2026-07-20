import staticAdapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const base = process.env.BASE_PATH ?? '';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess({ scss: true }),
	kit: {
		adapter: staticAdapter(),
		paths: { base },
		prerender: { handleMissingId: 'ignore' },
	},
};

export default config;
