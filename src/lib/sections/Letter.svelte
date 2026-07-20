<script lang="ts">
	import CostChart from '$lib/CostChart.svelte';
	import Lines from '$lib/Lines.svelte';
	import type { Copy } from '$lib/copy.js';

	let { letter, chart, lang }: { letter: Copy['letter']; chart: Copy['chart']; lang: string } = $props();

	// The letter markdown carries a `<div id="cost-chart"></div>` marker where the
	// interactive cost chart is spliced in.
	const CHART_MARK = '<div id="cost-chart"></div>';
</script>

<article id="brief" class="letter">
	<div class="container container--narrow">
		<h2><Lines text={letter.heading} /></h2>

		{#if letter.bodyHtml.includes(CHART_MARK)}
			{@const parts = letter.bodyHtml.split(CHART_MARK)}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- author-controlled Markdown -->
			<div class="letter__body">{@html parts[0]}</div>
			<CostChart t={chart} {lang} />
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- author-controlled Markdown -->
			<div class="letter__body">{@html parts[1]}</div>
		{:else}
			<!-- eslint-disable-next-line svelte/no-at-html-tags -- author-controlled Markdown -->
			<div class="letter__body">{@html letter.bodyHtml}</div>
		{/if}

		<div class="actions">
			<a class="btn btn--primary" href="mailto:mail@versatiles.org?subject=VersaTiles-Konsortium">{letter.ctaPrimary}</a
			>
		</div>
	</div>
</article>
