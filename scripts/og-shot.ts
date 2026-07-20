// Renders the Open Graph sharing images from the built site.
//
//   build/og/<lang>.html   →   build/og-image.<lang>.jpg   (1200×630)
//
// Runs as part of `npm run build`, after vite. Node executes this .ts file directly
// (type stripping, Node >= 24 — see "engines" in package.json); no build step, no tsx.
//
// The card itself is a normal SvelteKit route (src/routes/og/[lang]) — its text comes
// from src/content/<lang>/ui.yaml, so the image and og:image:alt cannot drift apart.
//
// We serve build/ over HTTP rather than opening file:// URLs, so the webfont, the logo
// and the map background load like ordinary assets — no base64 inlining. The font ships
// with the repo (src/lib/fonts), which is what makes the render identical on macOS and
// on a CI runner; a system font would silently differ.

import { createServer } from 'node:http';
import type { AddressInfo } from 'node:net';
import { readdir, rm, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import sirv from 'sirv';
import sharp from 'sharp';
import { chromium } from 'playwright';

const BUILD = fileURLToPath(new URL('../build', import.meta.url));
const BASE = '/consortium'; // must match BASE_PATH in package.json's build script
const WIDTH = 1200;
const HEIGHT = 630;
const QUALITY = 90;

// Which locales were prerendered — read from the build, so this needs no second list.
// Keyed on the .html files, which are the pages themselves; the sibling directories only
// exist because SvelteKit drops a __data.json in them and are not a stable contract.
const locales: string[] = (await readdir(`${BUILD}/og`))
	.filter((f) => f.endsWith('.html'))
	.map((f) => f.replace(/\.html$/, ''));

// Without this, a change in SvelteKit's output layout would silently ship a page whose
// og:image 404s — the build would still "succeed".
if (locales.length === 0) {
	throw new Error('No prerendered OG cards found in build/og — did the route change?');
}

const serve = sirv(BUILD, { dev: true });
const server = createServer((req, res) => {
	const url = req.url ?? '/';
	req.url = url.startsWith(BASE) ? url.slice(BASE.length) || '/' : url;
	serve(req, res);
});
await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
const { port } = server.address() as AddressInfo;
const origin = `http://127.0.0.1:${port}`;

const browser = await chromium.launch();
const page = await browser.newPage({
	viewport: { width: WIDTH, height: HEIGHT },
	deviceScaleFactor: 2,
});

for (const lang of locales) {
	await page.goto(`${origin}${BASE}/og/${lang}`, { waitUntil: 'networkidle' });
	await page.evaluate(() => document.fonts.ready); // never shoot a fallback-font frame

	// Playwright hands back the raw 2× buffer — sharp does the downsample, which is what
	// keeps the type crisp. JPEG, not PNG: the background is a map, PNG stores it at 5×.
	const shot = await page.screenshot({
		type: 'png',
		clip: { x: 0, y: 0, width: WIDTH, height: HEIGHT },
	});
	const out = `${BUILD}/og-image.${lang}.jpg`;
	await sharp(shot).resize(WIDTH, HEIGHT).jpeg({ quality: QUALITY }).toFile(out);
	const { size } = await stat(out);
	console.log(`✓ og-image.${lang}.jpg — ${WIDTH}×${HEIGHT}, ${Math.round(size / 1024)} KB`);
}

await browser.close();
server.close();

// The card pages are build scaffolding, not part of the site.
await rm(`${BUILD}/og`, { recursive: true, force: true });
