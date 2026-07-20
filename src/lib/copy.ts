// Loads and validates the per-locale content from src/content/<locale>/:
//   ui.yaml   – structured UI strings (validated against UiSchema below)
//   letter.md – the open letter as Markdown (prose lives here, not in code)
//
// This runs at build/prerender time only (imported from +page.server.ts), so the
// YAML/Markdown parsers never reach the client bundle. To edit copy, change those
// files. To add a locale: add a folder + import below.

import { parse } from 'yaml';
import { marked } from 'marked';
import { z } from 'zod';
import { siteUrl, type Locale } from './content.js';

import deUi from '../content/de/ui.yaml?raw';
import enUi from '../content/en/ui.yaml?raw';
import deLetter from '../content/de/letter.md?raw';
import enLetter from '../content/en/letter.md?raw';

const UiSchema = z.object({
	meta: z.object({
		title: z.string(),
		description: z.string(),
		// The lines the sharing card shows; /og/<lang> renders them, og:image:alt reads them.
		ogImage: z.object({
			line1: z.string(),
			line2: z.string(),
			line3: z.string(),
			sub: z.string(),
		}),
	}),
	hero: z.object({
		kicker: z.string(),
		title1: z.string(),
		title2: z.string(),
		lead: z.string(),
		ctaPrimary: z.string(),
		ctaSecondary: z.string(),
	}),
	banner: z.object({
		heading: z.string(),
		countLabel: z.string(),
		sectorsHeading: z.string(),
		legend: z.object({
			contacted: z.string(),
			discussion: z.string(),
			accepted: z.string(),
			declined: z.string(),
		}),
		sectorGroups: z.record(z.string(), z.string()),
	}),
	letter: z.object({
		heading: z.string(),
		ctaPrimary: z.string(),
		ctaSecondary: z.string(),
	}),
	demos: z.object({
		heading: z.string(),
		linksHeading: z.string(),
		// Per-video text, keyed by DemoVideo.id (content.ts owns the order).
		videos: z.record(
			z.string(),
			z.object({
				title: z.string(),
				description: z.string(),
				// A link is either a leaf {label,url} or a labelled group of leaves.
				links: z.array(
					z.union([
						z.object({ label: z.string(), url: z.string() }),
						z.object({ label: z.string(), links: z.array(z.object({ label: z.string(), url: z.string() })) }),
					])
				),
			})
		),
	}),
	support: z.object({ heading: z.string(), text: z.string() }),
	faq: z.object({
		heading: z.string(),
		items: z.array(z.object({ q: z.string(), a: z.string() })),
		contactText: z.string(),
		contactCta: z.string(),
	}),
	chart: z.object({
		title: z.string(),
		axisX: z.string(),
		axisY: z.string(),
		note: z.string(),
		consortiumName: z.string(),
		listPriceLimit: z.string(),
	}),
	footer: z.string(),
});

type UiCopy = z.infer<typeof UiSchema>;

export interface Copy extends Omit<UiCopy, 'meta' | 'letter'> {
	meta: UiCopy['meta'] & { ogImageAlt: string };
	letter: UiCopy['letter'] & { bodyHtml: string };
}

// The card also shows the bare URL, bottom right.
const ogUrlLabel = siteUrl.replace(/^https?:\/\//, '');

function build(uiRaw: string, letterMd: string, name: string): Copy {
	const result = UiSchema.safeParse(parse(uiRaw));
	if (!result.success) {
		throw new Error(`Invalid content in ${name}: ${result.error.message}`);
	}
	const ui = result.data;
	// Open the letter's external links in a new tab. Component links use ext() from links.ts;
	// the letter is {@html}, so it is patched here at build time. Only http(s) links match —
	// the in-page cost-chart marker and any anchors are left alone.
	const bodyHtml = (marked.parse(letterMd) as string).replace(
		/<a href="(https?:\/\/)/g,
		'<a target="_blank" rel="noopener" href="$1'
	);
	// Derived, never hand-written: the alt text is what the image says, by construction.
	const { line1, line2, line3, sub } = ui.meta.ogImage;
	const ogImageAlt = [line1, line2, line3, sub, ogUrlLabel].join(' ');
	return {
		...ui,
		meta: { ...ui.meta, ogImageAlt },
		letter: { ...ui.letter, bodyHtml },
	};
}

export const copy: Record<Locale, Copy> = {
	de: build(deUi, deLetter, 'de/ui.yaml'),
	en: build(enUi, enLetter, 'en/ui.yaml'),
};
