// A deliberately tiny markup for copy strings in ui.yaml. Three things, nothing more:
//
//   • a blank line or a line break starts a new paragraph
//   • lines starting with "1. ", "2. " … become an ordered list
//   • [label](https://example.org) becomes a link
//
// Not Markdown, and not rendered as HTML: parse() returns a token tree that Rich.svelte
// renders with real Svelte elements. So the text is escaped like any other interpolation
// (no {@html}, no XSS surface) and component-scoped CSS still reaches it — which is
// precisely what does NOT work for the Markdown letter, whose styles must live in
// global.scss.
//
// Anything not matching the above is literal text, including stray brackets.

export interface Inline {
	text: string;
	/** Set when this run is a link. */
	href?: string;
}

export type Block = { type: 'p'; parts: Inline[] } | { type: 'ol'; items: Inline[][] };

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const LIST_ITEM = /^\d+\.\s+(.*)$/;

/** Splits one line into text runs and links. */
function inlines(line: string): Inline[] {
	const parts: Inline[] = [];
	let last = 0;
	for (const m of line.matchAll(LINK)) {
		if (m.index > last) parts.push({ text: line.slice(last, m.index) });
		parts.push({ text: m[1], href: m[2] });
		last = m.index + m[0].length;
	}
	if (last < line.length) parts.push({ text: line.slice(last) });
	return parts;
}

export function parseRich(text: string): Block[] {
	const blocks: Block[] = [];
	for (const line of text.split('\n')) {
		const trimmed = line.trim();
		if (!trimmed) continue;

		const item = LIST_ITEM.exec(trimmed);
		if (item) {
			const prev = blocks.at(-1);
			// Consecutive numbered lines belong to the same list.
			if (prev?.type === 'ol') prev.items.push(inlines(item[1]));
			else blocks.push({ type: 'ol', items: [inlines(item[1])] });
		} else {
			blocks.push({ type: 'p', parts: inlines(trimmed) });
		}
	}
	return blocks;
}
