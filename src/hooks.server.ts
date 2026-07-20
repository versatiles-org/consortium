import type { Handle } from '@sveltejs/kit';

// Set <html lang> per page (runs during prerender for the static build).
export const handle: Handle = ({ event, resolve }) => {
	const segments = event.url.pathname.split('/').filter(Boolean);
	const lang = segments.includes('en') ? 'en' : 'de';
	return resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%lang%', lang),
	});
};
