import { error } from '@sveltejs/kit';
import { locales, type Locale } from '$lib/content.js';
import { copy } from '$lib/copy.js';

export const prerender = true;

export function entries() {
	return locales.map((lang) => ({ lang }));
}

export function load({ params }: { params: { lang: string } }) {
	if (!locales.includes(params.lang as Locale)) {
		error(404, 'Unknown language');
	}
	const lang = params.lang as Locale;
	return { lang, og: copy[lang].meta.ogImage };
}
