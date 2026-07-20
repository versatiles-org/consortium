<script lang="ts">
	// Renders a copy string that carries hard line breaks (newlines in ui.yaml) as
	// real <br> elements. The text itself stays a normal Svelte text node, so it is
	// escaped like any other interpolation — no {@html}, no XSS surface.
	//
	// A tilde between two non-space characters becomes a non-breaking space (U+00A0), the
	// TeX convention for tying two words onto one line — e.g. "für~Karten". The \S guards
	// mean a tilde with a space beside it (an approximate value like "~5 Mio") is left
	// alone. A literal U+00A0 in the YAML would work too but is invisible in the editor and
	// easily mangled by formatters. It stays a text node, so nothing else is interpreted.
	let { text }: { text: string } = $props();

	const lines = $derived(text.split('\n').map((line) => line.replace(/(\S)~(\S)/g, '$1\u00A0$2')));
</script>

<!-- prettier-ignore -->
{#each lines as line, i (i)}{#if i > 0}<br />{/if}{line}{/each}
